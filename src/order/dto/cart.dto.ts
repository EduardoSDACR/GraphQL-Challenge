import { Prisma } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ProductDto } from '../../product/dto';

@Exclude()
export class CartDto {
  @Expose()
  @Type(() => ProductDto)
  readonly products: ProductDto[];

  @Expose()
  @Transform(({ value }) => JSON.parse(value))
  readonly totalPrice: Prisma.Decimal;

  constructor(partial: Partial<CartDto>) {
    Object.assign(this, partial);
  }
}
