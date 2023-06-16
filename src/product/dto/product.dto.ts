import { Exclude, Expose } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Exclude()
export class ProductDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly price: Prisma.Decimal;

  @Expose()
  readonly image: string;

  @Expose()
  readonly likes: number;

  @Expose()
  readonly categoryId: number;

  constructor(partial: Partial<ProductDto>) {
    Object.assign(this, partial);
  }
}
