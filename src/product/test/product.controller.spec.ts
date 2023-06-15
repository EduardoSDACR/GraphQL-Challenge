import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { productServiceMock, productsMock } from './product.mock';

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
});
