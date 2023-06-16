import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from '../product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, ProductDto } from '../dto';
import { UpdateProductDto } from '../dto';
import {
  prismaForeignKeyExceptionMock,
  prismaNotFoundExceptionMock,
  productMock,
  productsMock,
  productsNotDisabledByCategoryMock,
} from './product.mock';

describe('ProductService', () => {
  let productService: ProductService;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .useMocker(createMock)
      .compile();

    productService = module.get<ProductService>(ProductService);
    prismaService = module.get(PrismaService);
  });

  describe('getProducts', () => {
    it('should return a list of all available products', async () => {
      prismaService.product.findMany.mockResolvedValueOnce(productsMock);

      const result = await productService.getProducts();

      expect(result.length).toEqual(productsMock.length);
    });
  });

  describe('find', () => {
    it('should return product found', async () => {
      const productNotDisabledMock = {
        ...productMock,
        isDisabled: false,
      };

      prismaService.product.findUnique.mockResolvedValueOnce(
        productNotDisabledMock,
      );

      const result = await productService.find(faker.number.int());

      expect(result).toMatchObject(
        new ProductDto({ ...productNotDisabledMock }),
      );
    });

    it('should throw an error when product is not found', async () => {
      prismaService.product.findUnique.mockResolvedValueOnce(null);

      await expect(
        productService.find(faker.number.int()),
      ).rejects.toThrowError(new NotFoundException('Product not found'));
    });

    it('should throw an error when product is disabled', async () => {
      prismaService.product.findUnique.mockResolvedValueOnce({
        ...productMock,
        isDisabled: true,
      });

      await expect(
        productService.find(faker.number.int()),
      ).rejects.toThrowError(new NotFoundException('Product not found'));
    });
  });

  describe('findCategoryProducts', () => {
    it('should return all not disabled products of a category', async () => {
      prismaService.product.findMany.mockResolvedValueOnce(
        productsNotDisabledByCategoryMock,
      );

      const result = await productService.findCategoryProducts(
        faker.number.int(),
      );

      expect(result.length).toEqual(productsNotDisabledByCategoryMock.length);
    });
  });

  describe('create', () => {
    it('should throw an error if product category does not exist', async () => {
      const input: CreateProductDto = {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.number.float(),
        stock: faker.number.int(),
        categoryId: faker.number.int(),
      };
      prismaService.product.create.mockRejectedValueOnce(
        prismaForeignKeyExceptionMock,
      );

      await expect(
        productService.create(input, faker.lorem.word()),
      ).rejects.toThrowError(new NotFoundException('Category not found'));
    });

    it('should create a product', async () => {
      const input: CreateProductDto = {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.number.float(),
        stock: faker.number.int(),
        categoryId: faker.number.int(),
      };
      prismaService.product.create.mockResolvedValueOnce(productMock);

      const result = await productService.create(input, faker.lorem.word());

      expect(result).toMatchObject(new ProductDto(productMock));
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      prismaService.product.update.mockResolvedValueOnce(productMock);
      const input: UpdateProductDto = {
        name: faker.lorem.word(),
      };

      const result = await productService.update(input, faker.number.int());

      expect(result).toMatchObject(new ProductDto(productMock));
    });

    it('should throw an error when product does not exist', async () => {
      prismaService.product.update.mockRejectedValueOnce(
        prismaNotFoundExceptionMock,
      );
      const input: UpdateProductDto = {
        description: faker.lorem.word(),
      };

      await expect(
        productService.update(input, faker.number.int()),
      ).rejects.toThrowError(new NotFoundException('Product not found'));
    });

    it('should throw an error when category does not exist', async () => {
      prismaService.product.update.mockRejectedValueOnce(
        prismaForeignKeyExceptionMock,
      );
      const input: UpdateProductDto = {
        stock: faker.number.int(),
      };

      await expect(
        productService.update(input, faker.number.int()),
      ).rejects.toThrowError(new NotFoundException('Category not found'));
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      prismaService.product.findUnique.mockResolvedValueOnce(productMock);
      prismaService.product.delete.mockResolvedValueOnce(productMock);

      const result = await productService.delete(faker.number.int());

      expect(result).toBeUndefined();
    });

    it('should throw an error if product does not exist', async () => {
      prismaService.product.findUnique.mockResolvedValueOnce(null);

      await expect(
        productService.delete(faker.number.int()),
      ).rejects.toThrowError(new NotFoundException('Product not found'));
    });
  });
});
