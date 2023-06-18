import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CategoryService } from '../category.service';
import { PrismaService } from '../../prisma/prisma.service';
import { categoriesMock } from './category.mock';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    categoryService = module.get<CategoryService>(CategoryService);
    prismaService = module.get(PrismaService);
  });

  describe('list', () => {
    it('should return all categories', async () => {
      prismaService.category.findMany.mockResolvedValueOnce(categoriesMock);

      const result = await categoryService.list();

      expect(result.length).toEqual(categoriesMock.length);
    });
  });
});
