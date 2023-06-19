import { IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';

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
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  categoryId: number;
}
