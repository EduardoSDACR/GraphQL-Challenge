import * as Stream from 'stream';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { CreateProductDto, UpdateProductDto } from '../dto';
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

  it('should return a product', async () => {
    const body: CreateProductDto = {
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: faker.number.float(),
      stock: faker.number.int(),
      categoryId: faker.number.int(),
    };
    const image: Express.Multer.File = {
      fieldname: faker.lorem.word(),
      originalname: faker.lorem.word(),
      encoding: faker.lorem.word(),
      mimetype: faker.lorem.word(),
      destination: faker.lorem.word(),
      filename: faker.lorem.word(),
      path: faker.lorem.word(),
      size: faker.number.int(),
      stream: new Stream.Readable(),
      buffer: Buffer.alloc(1),
    };

    const result = await controller.createProduct(body, image);

    expect(result).toMatchObject(productMock);
  });

  it('should return updated product', async () => {
    const body: UpdateProductDto = {
      description: faker.lorem.sentence(),
      stock: faker.number.int(),
    };

    const result = await controller.updateProduct(body, faker.number.int());

    expect(result).toMatchObject(productMock);
  });

  it('should return undefined', async () => {
    const result = await controller.deleteProduct(faker.number.int());

    expect(result).toBeUndefined();
  });

  it('should return undefined', async () => {
    const result = await controller.disableProduct(faker.number.int());

    expect(result).toBeUndefined();
  });
});
