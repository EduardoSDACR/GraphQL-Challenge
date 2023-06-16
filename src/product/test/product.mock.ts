import { faker } from '@faker-js/faker';
import { Product, Prisma } from '@prisma/client';

export const productMock: Product = {
  id: faker.number.int(),
  name: faker.commerce.product(),
  description: faker.lorem.sentence(),
  price: new Prisma.Decimal(faker.number.float()),
  image: faker.internet.url(),
  likes: faker.number.int(),
  stock: faker.number.int(),
  isDisabled: faker.datatype.boolean(),
  categoryId: faker.number.int(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
};

export const productsMock: Product[] = [
  {
    ...productMock,
    id: 1,
  },
  {
    ...productMock,
    id: 2,
  },
];

export const productServiceMock = {
  getProducts: jest.fn().mockResolvedValue(productsMock),
  find: jest.fn().mockResolvedValue(productMock),
};
