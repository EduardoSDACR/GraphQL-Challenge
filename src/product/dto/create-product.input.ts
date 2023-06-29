import { IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';
import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'only two decimal places are accepted' },
  )
  @Max(1000)
  @IsNotEmpty()
  price: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
