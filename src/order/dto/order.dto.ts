import { Exclude, Expose } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { ProductDto } from '../../product/dto';

@Exclude()
export class OrderDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly total: Prisma.Decimal;

  @Expose()
  readonly products: ProductDto[];

  constructor(partial: Partial<OrderDto>) {
    Object.assign(this, partial);
  }
}
