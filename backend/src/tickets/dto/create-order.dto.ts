import { CartItemDto } from './cart-item.dto';

export class CreateOrderDto {
  userId?: string;
  cartItems: CartItemDto[];
}
