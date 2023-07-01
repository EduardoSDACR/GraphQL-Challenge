import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';

@InputType({
  description: 'Information to update an existing product',
})
export class UpdateProductInput extends PartialType(CreateProductInput) {}
