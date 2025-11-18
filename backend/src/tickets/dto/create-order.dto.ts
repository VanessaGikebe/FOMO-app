import { CartItemDto } from './cart-item.dto';

export class CreateOrderDto {
  userId?: string;
  cartItems: CartItemDto[];
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
}
