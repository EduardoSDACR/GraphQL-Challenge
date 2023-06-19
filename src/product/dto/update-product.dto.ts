import { IsNumber, IsOptional, IsString, Max } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'only two decimal places are accepted' },
  )
  @Max(1000)
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
