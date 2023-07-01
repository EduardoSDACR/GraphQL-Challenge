import { faker } from '@faker-js/faker';
import { Prisma, Token, User } from '@prisma/client';
import { Token as TokenModel } from '../model';

export const RequestWithAuthHeaderMock = {
  headers: {
    authorization: faker.string.nanoid(),
  },
};

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

export const credentialsMock: TokenModel = {
  accessToken: faker.string.nanoid(),
  exp: faker.string.numeric(),
};

export const authServiceMock = {
  signIn: jest.fn().mockResolvedValue(credentialsMock),
  signUp: jest.fn().mockResolvedValue(credentialsMock),
  signOut: jest.fn().mockResolvedValue(undefined),
  generateChangePasswordKey: jest.fn().mockResolvedValue(undefined),
  changePassword: jest.fn().mockResolvedValue(undefined),
};

export const prismaForeignKeyExceptionMock =
  new Prisma.PrismaClientKnownRequestError('', {
    code: 'P2003',
    clientVersion: '4.15.0',
  });
