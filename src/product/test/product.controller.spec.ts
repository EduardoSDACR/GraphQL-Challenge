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

  it('getProducts should return a list of products', async () => {
    const result = await controller.getProducts();

    expect(result.length).toEqual(productsMock.length);
  });

  it('getProductsListWithOffset should return a certain list of products', async () => {
    const result = await controller.getProductsListWithOffset(
      faker.number.int(),
      faker.number.int(),
    );

    expect(result.length).toEqual(productsMock.length);
  });

  it('getProductById should return one product', async () => {
    const result = await controller.getProductById(faker.number.int());

    expect(result).toBe(productMock);
  });

  it('getProductsByCategory should return products by category', async () => {
    const result = await controller.getProductsByCategory(faker.number.int());

    expect(result.length).toBe(productsByCategoryMock.length);
  });

  it('createProduct should return a product', async () => {
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

  it('updateProduct should return updated product', async () => {
    const body: UpdateProductDto = {
      description: faker.lorem.sentence(),
      stock: faker.number.int(),
    };

    const result = await controller.updateProduct(body, faker.number.int());

    expect(result).toMatchObject(productMock);
  });

  it('deleteProduct should return undefined', async () => {
    const result = await controller.deleteProduct(faker.number.int());

    expect(result).toBeUndefined();
  });

  it('disableProduct should return undefined', async () => {
    const result = await controller.disableProduct(faker.number.int());

    expect(result).toBeUndefined();
  });

  it('likeProduct should return undefined', async () => {
    const result = await controller.likeProduct(
      faker.number.int(),
      faker.string.uuid(),
    );

    expect(result).toBeUndefined();
  });

  it('updateProductImage should return the updated product', async () => {
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

    const result = await controller.updateProductImage(
      faker.number.int(),
      image,
    );

    expect(result).toMatchObject(productMock);
  });
});
