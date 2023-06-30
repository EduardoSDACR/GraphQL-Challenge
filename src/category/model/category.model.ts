import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field(() => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field()
  readonly description: string;
}
