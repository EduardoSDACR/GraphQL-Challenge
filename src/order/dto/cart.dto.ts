import { Prisma, Product } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CartDto {
  @Expose()
  readonly products: Partial<Product>[];

  @Expose()
  readonly totalPrice: Prisma.Decimal;

  constructor(partial: Partial<CartDto>) {
    Object.assign(this, partial);
  }
}
