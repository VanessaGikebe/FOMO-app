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
    return this.ticketsService.getOrder(id);
  }
}
