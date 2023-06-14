import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { authServiceMock, signInDtoMock, tokenDtoMock } from './auth.mock';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .useMocker(createMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should grant access credentials', async () => {
    const result = await controller.signIn(signInDtoMock);

    expect(result).toBe(tokenDtoMock);
  });
});
