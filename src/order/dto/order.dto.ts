import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { ProductDto } from '../../product/dto';

@Exclude()
export class OrderDto {
  @Expose()
  readonly id: number;

  @Expose()
  @Transform(({ value }) => JSON.parse(value))
  readonly total: Prisma.Decimal;

  @Expose()
  @Type(() => ProductDto)
  readonly products: Partial<ProductDto>[];

  constructor(partial: Partial<OrderDto>) {
    Object.assign(this, partial);
  }
}
