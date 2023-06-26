import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInInput {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
