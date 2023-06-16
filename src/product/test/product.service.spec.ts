import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from '../product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductDto } from '../dto/product.dto';
import { productMock, productsMock } from './product.mock';

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
});
