import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Contains user credential data' })
export class Token {
  @Field()
  readonly accessToken: string;

  @Field()
  readonly exp: string;
}
