import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import {
  productMock,
  productsByCategoryMock,
  productServiceMock,
  productsMock,
} from './product.mock';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    })
      .overrideProvider(ProductService)
      .useValue(productServiceMock)
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should return a list of products', async () => {
    const result = await controller.getProducts();

    expect(result.length).toEqual(productsMock.length);
  });

  it('should return one product', async () => {
    const result = await controller.getProductById(faker.number.int());

    expect(result).toBe(productMock);
  });

  it('should return products by category', async () => {
    const result = await controller.getProductsByCategory(faker.number.int());

    expect(result.length).toBe(productsByCategoryMock.length);
  });
});
