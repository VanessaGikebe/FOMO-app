export class OrderResponseDto {
  orderId: string;
  status: 'ok' | 'insufficient_stock' | 'invalid';
  details?: any;
}
