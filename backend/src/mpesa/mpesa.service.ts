import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as admin from 'firebase-admin';
import { EmailService } from '../email/email.service';

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);
  private db = admin.firestore();

  constructor(private readonly emailService: EmailService) {}
  
  // M-Pesa API URLs
  private readonly SANDBOX_URL = 'https://sandbox.safaricom.co.ke';
  private readonly PRODUCTION_URL = 'https://api.safaricom.co.ke';
  
  // Use sandbox by default (set MPESA_ENVIRONMENT=production in .env for live)
  private readonly baseUrl = process.env.MPESA_ENVIRONMENT === 'production' 
    ? this.PRODUCTION_URL 
    : this.SANDBOX_URL;
    
  private readonly consumerKey = process.env.MPESA_CONSUMER_KEY;
  private readonly consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  private readonly shortCode = process.env.MPESA_SHORTCODE;
  private readonly passkey = process.env.MPESA_PASSKEY;
  private readonly callbackUrl = process.env.MPESA_CALLBACK_URL;

  /**
   * Generate OAuth access token for M-Pesa API
   */
  private async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );
      
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get M-Pesa access token', error);
      throw new BadRequestException('Failed to authenticate with M-Pesa');
    }
  }

  /**
   * Generate password for STK Push
   */
  private generatePassword(): { password: string; timestamp: string } {
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14); // YYYYMMDDHHmmss
      
    const password = Buffer.from(
      `${this.shortCode}${this.passkey}${timestamp}`
    ).toString('base64');
    
    return { password, timestamp };
  }

  /**
   * Initiate STK Push (Lipa na M-Pesa Online)
   * @param phoneNumber - Customer phone number (format: 254XXXXXXXXX)
   * @param amount - Amount to charge
   * @param orderId - Order reference
   * @param accountReference - Account reference (e.g., "FOMO Tickets")
   * @param transactionDesc - Transaction description
   */
  async initiateSTKPush(
    phoneNumber: string,
    amount: number,
    orderId: string,
    accountReference: string = 'FOMO Tickets',
    transactionDesc: string = 'Event Ticket Payment'
  ) {
    try {
      // Validate inputs
      if (!phoneNumber || !amount || !orderId) {
        throw new BadRequestException('Missing required parameters');
      }

      // Format phone number (remove + and ensure it starts with 254)
      let formattedPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+/, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.slice(1);
      }
      if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      // Validate phone number format
      if (!/^254[17]\d{8}$/.test(formattedPhone)) {
        throw new BadRequestException('Invalid phone number format. Use 254XXXXXXXXX');
      }

      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const payload = {
        BusinessShortCode: this.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount), // M-Pesa requires integer
        PartyA: formattedPhone,
        PartyB: this.shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      };

      this.logger.log(`Initiating STK Push for ${formattedPhone}, Amount: ${amount}, Order: ${orderId}`);

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Store transaction in Firestore
      const transactionData = {
        orderId,
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        phoneNumber: formattedPhone,
        amount,
        status: 'pending',
        createdAt: admin.firestore.Timestamp.now(),
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage,
      };

      await this.db.collection('mpesa_transactions').doc(response.data.CheckoutRequestID).set(transactionData);

      this.logger.log(`STK Push initiated successfully: ${response.data.CheckoutRequestID}`);

      return {
        success: true,
        message: response.data.CustomerMessage || 'Payment request sent to your phone',
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
      };
    } catch (error) {
      this.logger.error('STK Push failed', error.response?.data || error.message);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException(
        error.response?.data?.errorMessage || 
        'Failed to initiate M-Pesa payment. Please try again.'
      );
    }
  }

  /**
   * Handle M-Pesa callback
   */
  async handleCallback(callbackData: any) {
    try {
      this.logger.log('Received M-Pesa callback', JSON.stringify(callbackData));

      const { Body } = callbackData;
      const { stkCallback } = Body;
      
      const checkoutRequestId = stkCallback.CheckoutRequestID;
      const merchantRequestId = stkCallback.MerchantRequestID;
      const resultCode = stkCallback.ResultCode;
      const resultDesc = stkCallback.ResultDesc;

      // Get transaction from Firestore
      const transactionRef = this.db.collection('mpesa_transactions').doc(checkoutRequestId);
      const transactionDoc = await transactionRef.get();

      if (!transactionDoc.exists) {
        this.logger.warn(`Transaction not found: ${checkoutRequestId}`);
        return { success: false, message: 'Transaction not found' };
      }

      const transactionData = transactionDoc.data();

      // Update transaction status based on result code
      if (resultCode === 0) {
        // Payment successful
        const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
        const metadata: any = {};
        
        callbackMetadata.forEach((item: any) => {
          metadata[item.Name] = item.Value;
        });

        await transactionRef.update({
          status: 'completed',
          resultCode,
          resultDescription: resultDesc,
          mpesaReceiptNumber: metadata.MpesaReceiptNumber,
          transactionDate: metadata.TransactionDate,
          updatedAt: admin.firestore.Timestamp.now(),
        });

        // Update order status to 'confirmed'
        if (transactionData.orderId) {
          await this.db.collection('orders').doc(transactionData.orderId).update({
            status: 'confirmed',
            paymentStatus: 'paid',
            mpesaReceiptNumber: metadata.MpesaReceiptNumber,
            updatedAt: admin.firestore.Timestamp.now(),
          });

          this.logger.log(`Order ${transactionData.orderId} payment confirmed`);

          // Send ticket confirmation email
          try {
            const orderDoc = await this.db.collection('orders').doc(transactionData.orderId).get();
            const orderData = orderDoc.data();

            if (orderData) {
              // Fetch event details for each item
              const itemsWithDetails = await Promise.all(
                orderData.items.map(async (item) => {
                  try {
                    const eventDoc = await this.db.collection('events').doc(item.eventId).get();
                    const eventData = eventDoc.data();
                    return {
                      eventTitle: eventData?.title || 'Event',
                      quantity: item.quantity,
                      pricePerTicket: item.pricePerTicket,
                    };
                  } catch (err) {
                    this.logger.warn(`Failed to fetch event details for ${item.eventId}`);
                    return {
                      eventTitle: 'Event',
                      quantity: item.quantity,
                      pricePerTicket: item.pricePerTicket,
                    };
                  }
                })
              );

              // Calculate total amount
              const totalAmount = itemsWithDetails.reduce(
                (sum, item) => sum + item.quantity * item.pricePerTicket,
                0
              );

              // Get customer email from order or use a default
              const customerEmail = orderData.customerEmail || transactionData.customerEmail;
              const customerName = orderData.customerName || 'Valued Customer';

              if (customerEmail) {
                await this.emailService.sendTicketConfirmation(
                  customerEmail,
                  customerName,
                  {
                    orderId: transactionData.orderId,
                    items: itemsWithDetails,
                    totalAmount,
                    mpesaReceiptNumber: metadata.MpesaReceiptNumber,
                    purchaseDate: new Date().toLocaleString('en-KE', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }),
                  }
                );
                this.logger.log(`Ticket confirmation email sent for order ${transactionData.orderId}`);
              } else {
                this.logger.warn(`No email found for order ${transactionData.orderId}, skipping email`);
              }
            }
          } catch (emailError) {
            this.logger.error(`Failed to send ticket email for order ${transactionData.orderId}:`, emailError);
            // Don't fail the payment callback if email fails
          }
        }

        this.logger.log(`Payment successful: ${checkoutRequestId}`);
      } else {
        // Payment failed or cancelled
        await transactionRef.update({
          status: 'failed',
          resultCode,
          resultDescription: resultDesc,
          updatedAt: admin.firestore.Timestamp.now(),
        });

        // Update order status
        if (transactionData.orderId) {
          await this.db.collection('orders').doc(transactionData.orderId).update({
            status: 'cancelled',
            paymentStatus: 'failed',
            failureReason: resultDesc,
            updatedAt: admin.firestore.Timestamp.now(),
          });
        }

        this.logger.warn(`Payment failed: ${checkoutRequestId} - ${resultDesc}`);
      }

      return { success: true, message: 'Callback processed' };
    } catch (error) {
      this.logger.error('Callback processing failed', error);
      return { success: false, message: 'Callback processing failed' };
    }
  }

  /**
   * Query STK Push transaction status
   */
  async queryTransaction(checkoutRequestId: string) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const payload = {
        BusinessShortCode: this.shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc,
      };
    } catch (error) {
      this.logger.error('Transaction query failed', error.response?.data || error.message);
      throw new BadRequestException('Failed to query transaction status');
    }
  }

  /**
   * Get transaction status from Firestore
   */
  async getTransactionStatus(checkoutRequestId: string) {
    try {
      const transactionDoc = await this.db
        .collection('mpesa_transactions')
        .doc(checkoutRequestId)
        .get();

      if (!transactionDoc.exists) {
        return { success: false, message: 'Transaction not found' };
      }

      const data = transactionDoc.data();
      return {
        success: true,
        transaction: {
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get transaction status', error);
      throw new BadRequestException('Failed to get transaction status');
    }
  }
}
