import { IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'only two decimal places are accepted' },
  )
  @Max(1000)
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value))
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value))
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value))
  categoryId: number;
}
