import { faker } from '@faker-js/faker';
import { Order } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { productsMock } from '../../product/test/product.mock';
import { Cart } from '../model';

export const orderMock: Order = {
  id: faker.number.int(),
  total: new Prisma.Decimal(faker.number.float()),
  userId: faker.number.int(),
  updatedAt: faker.date.anytime(),
  createdAt: faker.date.anytime(),
};

export const ordersMock: Order[] = [
  {
    ...orderMock,
    id: 1,
  },
  {
    ...orderMock,
    id: 2,
  },
  {
    ...orderMock,
    id: 3,
  },
];

export const cartMock: Cart = {
  products: [],
  totalPrice: new Prisma.Decimal(faker.number.float()),
};

export const orderServiceMock = {
  findClientOrders: jest.fn().mockResolvedValue(ordersMock),
  findCartProducts: jest.fn().mockResolvedValue(cartMock),
  find: jest.fn().mockResolvedValue(orderMock),
  buyOrderProducts: jest.fn().mockResolvedValue(orderMock),
  findOrderProducts: jest.fn().mockResolvedValue(productsMock),
};
