import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { OrderService } from '../order.service';
import { PrismaService } from '../../prisma/prisma.service';
import { userMock } from '../../auth/test/auth.mock';
import {
  prismaNotFoundExceptionMock,
  productsMock,
} from '../../product/test/product.mock';
import { OrderDto } from '../dto';
import { orderMock, ordersMock } from './order.mock';

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

  describe('find', () => {
    it('should return an order', async () => {
      prismaService.order.findUnique.mockResolvedValueOnce(orderMock);

      const result = await orderService.find(faker.number.int());

      expect(result).toMatchObject(new OrderDto(orderMock));
    });
  });

  describe('buyOrderProducts', () => {
    it('should return an order with purchased products', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(userMock);
      prismaService.product.findMany.mockResolvedValueOnce(productsMock);
      prismaService.order.create.mockResolvedValueOnce(orderMock);

      const result = await orderService.buyOrderProducts(faker.string.uuid(), [
        faker.number.int(),
      ]);

      expect(result).toMatchObject(new OrderDto(result));
    });

    it('should throw an error when some of the product ids doesnt find a product', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(userMock);
      prismaService.product.findMany.mockResolvedValueOnce(productsMock);
      prismaService.order.create.mockRejectedValueOnce(
        prismaNotFoundExceptionMock,
      );

      await expect(
        orderService.buyOrderProducts(faker.string.uuid(), []),
      ).rejects.toThrowError(
        new NotFoundException('One of the products does not exist'),
      );
    });
  });
});
