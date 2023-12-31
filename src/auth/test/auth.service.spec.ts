import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import * as bcrypt from 'bcrypt';
import {
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SignInInput } from '../dto';
import { AuthService } from '../auth.service';
import {
  prismaForeignKeyExceptionMock,
  tokenMock,
  userMock,
} from './auth.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .useMocker(createMock)
      .compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
  });

  describe('signIn', () => {
    it('should throw an error when user email is not found', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(null);
      const input: SignInInput = {
        email: faker.internet.email(),
        password: faker.lorem.word(),
      };

      await expect(authService.signIn(input)).rejects.toThrowError(
        new UnauthorizedException('Credentials are wrong'),
      );
    });

    it('should throw an error when password is incorrect', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(userMock);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
      const input: SignInInput = {
        email: faker.internet.email(),
        password: faker.lorem.word(),
      };

      await expect(authService.signIn(input)).rejects.toThrowError(
        new UnauthorizedException('Credentials are wrong'),
      );
    });

    it('should return user credentials', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(userMock);
      prismaService.token.create.mockResolvedValueOnce(tokenMock);
      const spyCreateToken = jest.spyOn(authService, 'createToken');
      const spyGenerateAccessToken = jest.spyOn(
        authService,
        'generateAccessToken',
      );
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      const input: SignInInput = {
        email: faker.internet.email(),
        password: faker.lorem.word(),
      };

      const result = await authService.signIn(input);

      expect(spyCreateToken).toHaveBeenCalledTimes(1);
      expect(spyGenerateAccessToken).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('exp');
    });
  });

  describe('signUp', () => {
    it('should throw an error if email is already taken', () => {
      prismaService.user.findUnique.mockResolvedValueOnce(userMock);
      const input = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.lorem.word(),
      };

      expect(authService.signUp(input)).rejects.toThrowError(
        new UnprocessableEntityException('The email is already taken'),
      );
    });

    it('should create a new user and grant access credentials', async () => {
      prismaService.user.create.mockResolvedValueOnce(userMock);
      prismaService.token.create.mockResolvedValueOnce(tokenMock);
      const spyCreateToken = jest.spyOn(authService, 'createToken');
      const spyGenerateAccessToken = jest.spyOn(
        authService,
        'generateAccessToken',
      );
      const input = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.lorem.word(),
      };

      const result = await authService.signUp(input);

      expect(spyCreateToken).toHaveBeenCalledTimes(1);
      expect(spyGenerateAccessToken).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('exp');
    });
  });

  describe('signOut', () => {
    it('should throw an error when user session is not found', async () => {
      prismaService.token.delete.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: '4.15.0',
        }),
      );

      await expect(
        authService.signOut(faker.string.nanoid()),
      ).rejects.toThrowError(new NotFoundException('Session not found'));
    });

    it('should throw an error when prisma operation had a problem', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: '---',
        clientVersion: '4.15.0',
      });
      prismaService.token.delete.mockRejectedValueOnce(prismaError);

      await expect(
        authService.signOut(faker.string.nanoid()),
      ).rejects.toThrowError(prismaError);
    });

    it('should delete user session', async () => {
      prismaService.token.delete.mockResolvedValueOnce(tokenMock);
      const result = await authService.signOut(faker.string.nanoid());

      expect(result).toBeUndefined();
    });

    it('should throw an error', async () => {
      prismaService.token.delete.mockRejectedValueOnce(new Error());

      await expect(
        authService.signOut(faker.string.nanoid()),
      ).rejects.toThrowError(new Error());
    });
  });

  describe('generateChangePasswordKey', () => {
    it('should generate a token and return null', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(userMock);
      prismaService.token.create.mockResolvedValueOnce(tokenMock);

      const result = await authService.generateChangePasswordKey(
        faker.internet.email(),
      );

      expect(result).toBeUndefined();
    });

    it('should throw an error if email is not registered', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        authService.generateChangePasswordKey(faker.internet.email()),
      ).rejects.toThrowError(
        new NotFoundException('This email is not registered in the app'),
      );
    });
  });

  describe('changePassword', () => {
    it('should change password and return null', async () => {
      prismaService.token.findUnique.mockResolvedValueOnce(tokenMock);
      prismaService.user.update.mockResolvedValueOnce(userMock);

      const result = await authService.changePassword(
        faker.string.uuid(),
        faker.lorem.word(),
      );

      expect(result).toBeUndefined();
    });

    it('should throw an error when key is invalid', async () => {
      prismaService.token.findUnique.mockResolvedValueOnce(null);

      await expect(
        authService.changePassword(faker.string.uuid(), faker.lorem.word()),
      ).rejects.toThrowError(new UnprocessableEntityException('Invalid key'));
    });
  });

  describe('createToken', () => {
    it('should throw an error when user is not found', async () => {
      prismaService.token.create.mockRejectedValueOnce(
        prismaForeignKeyExceptionMock,
      );

      await expect(
        authService.createToken(faker.number.int()),
      ).rejects.toThrowError(new NotFoundException('User not found'));
    });

    it('should throw an error when prisma operation had a problem', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: '---',
        clientVersion: '4.15.0',
      });
      prismaService.token.create.mockRejectedValueOnce(prismaError);

      await expect(
        authService.createToken(faker.number.int()),
      ).rejects.toThrowError(prismaError);
    });

    it('should throw an error', async () => {
      prismaService.token.create.mockRejectedValueOnce(new Error());

      await expect(
        authService.createToken(faker.number.int()),
      ).rejects.toThrowError(new Error());
    });
  });
});
