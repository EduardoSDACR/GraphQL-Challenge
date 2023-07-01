import { Prisma } from '@prisma/client';
import {
  Field,
  FieldMiddleware,
  Float,
  ID,
  MiddlewareContext,
  NextFn,
  ObjectType,
} from '@nestjs/graphql';

const imageURLMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();
  return `${process.env.DOMAIN_NAME}${value}`;
};

@ObjectType({ description: 'Contains information about a product' })
export class Product {
  @Field(() => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field()
  readonly description: string;

  @Field(() => Float)
  readonly price: Prisma.Decimal;

  @Field({ middleware: [imageURLMiddleware] })
  readonly image: string;

  @Field()
  readonly likes: number;

  @Field()
  readonly stock: number;

  @Field()
  readonly categoryId: number;
}
