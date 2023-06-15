import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { createMock } from '@golevelup/ts-jest';
import { ProductService } from '../product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { productsMock } from './product.mock';

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
});
