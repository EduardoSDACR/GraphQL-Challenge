import { Prisma } from '@prisma/client';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field(() => ID)
  readonly id: number;

  @Field(() => Float)
  readonly total: Prisma.Decimal;
}
