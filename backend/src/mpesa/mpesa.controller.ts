import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { MpesaCallbackDto } from './dto/mpesa-callback.dto';

@Controller('mpesa')
export class MpesaController {
  constructor(private readonly mpesaService: MpesaService) {}

  /**
   * Initiate M-Pesa STK Push payment
   */
  @Post('initiate')
  async initiatePayment(@Body() dto: InitiatePaymentDto) {
    return this.mpesaService.initiateSTKPush(
      dto.phoneNumber,
      dto.amount,
      dto.orderId,
      dto.accountReference,
      dto.transactionDesc
    );
  }

  /**
   * M-Pesa callback endpoint (receives payment notifications)
   */
  @Post('callback')
  @HttpCode(HttpStatus.OK)
  async handleCallback(@Body() callbackData: MpesaCallbackDto) {
    return this.mpesaService.handleCallback(callbackData);
  }

  /**
   * Query transaction status
   */
  @Get('query/:checkoutRequestId')
  async queryTransaction(@Param('checkoutRequestId') checkoutRequestId: string) {
    return this.mpesaService.queryTransaction(checkoutRequestId);
  }

  /**
   * Get transaction status from database
   */
  @Get('status/:checkoutRequestId')
  async getTransactionStatus(@Param('checkoutRequestId') checkoutRequestId: string) {
    return this.mpesaService.getTransactionStatus(checkoutRequestId);
  }
}
