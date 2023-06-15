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
import { SignInDto } from '../dto';
import { AuthService } from '../auth.service';
import { tokenMock, userMock } from './auth.mock';

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
      const input: SignInDto = {
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
      const input: SignInDto = {
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
      const input: SignInDto = {
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

  describe('logOut', () => {
    it('should throw an error when user session is not found', async () => {
      prismaService.token.delete.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: '4.15.0',
        }),
      );

      await expect(
        authService.logOut(faker.string.nanoid()),
      ).rejects.toThrowError(new NotFoundException('Session not found'));
    });

    it('should delete user session', async () => {
      prismaService.token.delete.mockResolvedValueOnce(tokenMock);
      const result = await authService.logOut(faker.string.nanoid());

      expect(result).toBeUndefined();
    });
  });
});
