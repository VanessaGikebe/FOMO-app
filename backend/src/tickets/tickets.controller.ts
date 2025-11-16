import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.ticketsService.createOrder(dto);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    const order = await this.ticketsService.getOrder(id);
    if (!order) {
      return { status: 'not_found', message: 'Order not found' };
    }
    return { status: 'ok', order };
  }

  @Get('user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    const orders = await this.ticketsService.getUserOrders(userId);
    return { status: 'ok', orders };
  }
}
