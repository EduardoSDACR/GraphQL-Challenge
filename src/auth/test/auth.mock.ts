import { faker } from '@faker-js/faker';
import { Token, User } from '@prisma/client';

export const userMock: User = {
  id: faker.number.int(),
  uuid: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  hash: faker.string.nanoid(),
  role: 'CLIENT',
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
};

export const tokenMock: Token = {
  id: faker.number.int(),
  uuid: faker.string.uuid(),
  createdAt: faker.date.anytime(),
  userId: faker.number.int(),
  jti: faker.string.uuid(),
};
