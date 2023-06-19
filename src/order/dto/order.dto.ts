import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../../product/dto';

@Exclude()
export class OrderDto {
  @Expose()
  readonly id: number;

  @ApiProperty({ example: 200.5 })
  @Expose()
  @Transform(({ value }) => JSON.parse(value))
  readonly total: Prisma.Decimal;

  @Expose()
  @Type(() => ProductDto)
  readonly products: ProductDto[];

  constructor(partial: Partial<OrderDto>) {
    Object.assign(this, partial);
  }
}
