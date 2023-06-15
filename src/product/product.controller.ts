import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private product: ProductService) {}

  @Get()
  getProducts() {
    return this.product.getProducts();
  }
}
