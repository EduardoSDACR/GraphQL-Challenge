import { Exclude, Expose, Transform } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Exclude()
export class ProductDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  @Transform(({ value }) => JSON.parse(value))
  readonly price: Prisma.Decimal;

  @Expose()
  @Transform(({ value }) => `${process.env.DOMAIN_NAME}${value}`)
  readonly image: string;

  @Expose()
  readonly likes: number;

  @Expose()
  readonly stock: number;

  @Expose()
  readonly categoryId: number;

  constructor(partial: Partial<ProductDto>) {
    Object.assign(this, partial);
  }
}
