import { Prisma } from '@prisma/client';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Product } from '../../product/model';

@ObjectType({ description: 'Contains products to buy later' })
export class Cart {
  @Field(() => [Product])
  readonly products: Product[];

  @Field(() => Float)
  readonly totalPrice: Prisma.Decimal;
}
