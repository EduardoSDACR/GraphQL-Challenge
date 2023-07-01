import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { FileUpload } from 'graphql-upload';
import { ProductResolver } from '../product.resolver';
import { ProductService } from '../product.service';
import { CreateProductInput, UpdateProductInput } from '../dto';
import {
  productMock,
  productsByCategoryMock,
  productServiceMock,
  productsMock,
} from './product.mock';

describe('ProductResolver', () => {
  let resolver: ProductResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductResolver, ProductService],
    })
      .overrideProvider(ProductService)
      .useValue(productServiceMock)
      .compile();

    resolver = module.get<ProductResolver>(ProductResolver);
  });

  it('products should return a list of products', async () => {
    const result = await resolver.products();

    expect(result.length).toEqual(productsMock.length);
  });

  it('productsWithPagination should return a certain list of products', async () => {
    const result = await resolver.productsWithPagination(
      faker.number.int(),
      faker.number.int(),
    );

    expect(result.length).toEqual(productsMock.length);
  });

  it('product should return one specific product', async () => {
    const result = await resolver.product(faker.number.int());

    expect(result).toBe(productMock);
  });

  it('getProductsByCategory should return products by category', async () => {
    const result = await resolver.productsByCategory(faker.number.int());

    expect(result.length).toBe(productsByCategoryMock.length);
  });

  it('addProduct should return a product', async () => {
    const input: CreateProductInput = {
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: faker.number.float(),
      stock: faker.number.int(),
      categoryId: faker.number.int(),
    };
    const image: FileUpload = {
      filename: faker.lorem.word(),
    };

    const result = await resolver.addProduct(input, image);

    expect(result).toMatchObject(productMock);
  });

  it('updateProduct should return updated product', async () => {
    const input: UpdateProductInput = {
      description: faker.lorem.sentence(),
      stock: faker.number.int(),
    };

    const result = await resolver.updateProduct(input, faker.number.int());

    expect(result).toMatchObject(productMock);
  });

  it('updateProductImage should return the updated product', async () => {
    const image: FileUpload = {
      filename: faker.lorem.word(),
    };

    const result = await resolver.updateProductImage(faker.number.int(), image);

    expect(result).toMatchObject(productMock);
  });

  it('deleteProduct should return true', async () => {
    const result = await resolver.deleteProduct(faker.number.int());

    expect(result).toEqual(true);
  });

  it('disableProduct should return true', async () => {
    const result = await resolver.disableProduct(faker.number.int());

    expect(result).toEqual(true);
  });

  it('likeProduct should return true', async () => {
    const result = await resolver.likeProduct(
      faker.number.int(),
      faker.string.uuid(),
    );

    expect(result).toEqual(true);
  });
});
