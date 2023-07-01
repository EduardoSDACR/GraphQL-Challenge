import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Used to classify products' })
export class Category {
  @Field(() => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field()
  readonly description: string;
}
