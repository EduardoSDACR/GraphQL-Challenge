import { faker } from '@faker-js/faker';
import { Order } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CartDto } from '../dto/cart.dto';

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

export const cartMock: CartDto = {
  products: [],
  totalPrice: new Prisma.Decimal(faker.number.float()),
};

export const orderServiceMock = {
  findClientOrders: jest.fn().mockResolvedValue(ordersMock),
  findCartProducts: jest.fn().mockResolvedValue(cartMock),
};
