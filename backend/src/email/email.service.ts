import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send ticket confirmation email after successful payment
   */
  async sendTicketConfirmation(
    recipientEmail: string,
    recipientName: string,
    orderDetails: {
      orderId: string;
      items: Array<{
        eventTitle: string;
        quantity: number;
        pricePerTicket: number;
      }>;
      totalAmount: number;
      mpesaReceiptNumber?: string;
      purchaseDate: string;
    }
  ) {
    try {
      const itemsList = orderDetails.items
        .map(
          (item) =>
            `<tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.eventTitle}</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">KSh ${item.pricePerTicket.toLocaleString()}</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">KSh ${(item.quantity * item.pricePerTicket).toLocaleString()}</td>
            </tr>`
        )
        .join('');

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your FOMO Tickets</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">🎉 Payment Successful!</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Your tickets are confirmed</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 20px;">
      <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">Hi ${recipientName},</p>
      
      <p style="font-size: 16px; color: #374151; margin: 0 0 30px 0;">
        Thank you for your purchase! Your payment has been confirmed and your tickets are ready. 
        We're excited to see you at the event!
      </p>

      <!-- Order Details Box -->
      <div style="background-color: #f9fafb; border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #111827;">Order Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order ID:</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${orderDetails.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Purchase Date:</td>
            <td style="padding: 8px 0; color: #111827; text-align: right;">${orderDetails.purchaseDate}</td>
          </tr>
          ${orderDetails.mpesaReceiptNumber ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">M-PESA Receipt:</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${orderDetails.mpesaReceiptNumber}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <!-- Ticket Details Table -->
      <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #111827;">Your Tickets</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Event</th>
            <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Qty</th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Price</th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 16px; text-align: right; font-weight: 600; font-size: 18px; color: #111827;">Total Amount:</td>
            <td style="padding: 16px; text-align: right; font-weight: 700; font-size: 18px; color: #16a34a;">KSh ${orderDetails.totalAmount.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Important Info -->
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 30px; border-radius: 4px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #92400e;">📱 Important Information</h3>
        <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px;">
          <li style="margin-bottom: 8px;">Keep this email safe - you'll need it at the event entrance</li>
          <li style="margin-bottom: 8px;">Show your Order ID at the venue for entry</li>
          <li style="margin-bottom: 8px;">Arrive early to avoid queues</li>
          <li>Check your event details for date, time, and location</li>
        </ul>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/eg-orders" 
           style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          View My Orders
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin: 30px 0 0 0; text-align: center;">
        If you have any questions, please contact our support team.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        © 2025 FOMO Events. All rights reserved.
      </p>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
      `;

      const mailOptions = {
        from: `"FOMO Events" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: `🎉 Your Tickets Are Ready - Order ${orderDetails.orderId}`,
        html: emailHtml,
        text: `
Hi ${recipientName},

Thank you for your purchase! Your payment has been confirmed.

Order Details:
- Order ID: ${orderDetails.orderId}
- Purchase Date: ${orderDetails.purchaseDate}
${orderDetails.mpesaReceiptNumber ? `- M-PESA Receipt: ${orderDetails.mpesaReceiptNumber}` : ''}

Your Tickets:
${orderDetails.items.map(item => `- ${item.eventTitle}: ${item.quantity} ticket(s) @ KSh ${item.pricePerTicket}`).join('\n')}

Total Amount: KSh ${orderDetails.totalAmount.toLocaleString()}

Important: Keep this email safe and present your Order ID at the event entrance.

Best regards,
FOMO Events Team
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Ticket confirmation email sent to ${recipientEmail}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error(`Failed to send ticket confirmation email to ${recipientEmail}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify email configuration
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('Email service is ready to send emails');
      return true;
    } catch (error) {
      this.logger.error('Email service verification failed:', error);
      return false;
    }
  }
}
