import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { OrderService } from '../order.service';
import { PrismaService } from '../../prisma/prisma.service';
import { userMock } from '../../auth/test/auth.mock';
import { productsMock } from '../../product/test/product.mock';
import { ordersMock } from './order.mock';

describe('OrderService', () => {
  let orderService: OrderService;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    orderService = module.get<OrderService>(OrderService);
    prismaService = module.get(PrismaService);
  });

  describe('findClientOrders', () => {
    it('should return client orders', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(userMock);
      prismaService.order.findMany.mockResolvedValueOnce(ordersMock);

      const result = await orderService.findClientOrders(faker.number.int());

      expect(result.length).toEqual(ordersMock.length);
    });

    it('should throw an error when user does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        orderService.findClientOrders(faker.number.int()),
      ).rejects.toThrowError(new NotFoundException('User not found'));
    });
  });

  describe('findCartProducts', () => {
    it('should return the products of the cart', async () => {
      prismaService.product.findMany.mockResolvedValueOnce(productsMock);
      const productIds = [faker.number.int(), faker.number.int()];

      const result = await orderService.findCartProducts(productIds);

      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('totalPrice');
    });
  });
});
