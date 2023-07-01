import { faker } from '@faker-js/faker';
import { Category } from '../model/category.model';

export const categoryMock: Category = {
  id: faker.number.int(),
  name: faker.lorem.word(),
  description: faker.lorem.sentence(),
};

export const categoriesMock: Category[] = [
  {
    ...categoryMock,
    id: 1,
  },
  {
    ...categoryMock,
    id: 2,
  },
  {
    ...categoryMock,
    id: 3,
  },
];

export const categoryServiceMock = {
  list: jest.fn().mockResolvedValue(categoriesMock),
  create: jest.fn().mockResolvedValue(categoryMock),
  delete: jest.fn().mockResolvedValue(undefined),
};
