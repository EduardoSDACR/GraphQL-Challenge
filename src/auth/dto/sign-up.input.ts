import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Information to register a new user inside of the application',
})
export class SignUpInput {
  @Field()
  @IsString()
  readonly firstName: string;

  @Field()
  @IsString()
  readonly lastName: string;

  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
