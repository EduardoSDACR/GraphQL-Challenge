import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Token {
  @Field()
  readonly accessToken: string;

  @Field()
  readonly exp: string;
}
