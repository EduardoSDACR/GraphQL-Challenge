import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { SignInInput, SignUpInput } from '../dto';
import {
  authServiceMock,
  credentialsMock,
  RequestWithAuthHeaderMock,
} from './auth.mock';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthResolver, AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should grant access credentials when sign in', async () => {
    const body: SignInInput = {
      email: faker.internet.email(),
      password: faker.lorem.word(),
    };
    const result = await resolver.signIn(body);

    expect(result).toBe(credentialsMock);
  });

  it('should grant access credentials when sign up', async () => {
    const body: SignUpInput = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.lorem.word(),
    };
    const result = await resolver.signUp(body);

    expect(result).toBe(credentialsMock);
  });

  it('should return true', async () => {
    const result = await resolver.signOut(RequestWithAuthHeaderMock);

    expect(result).toBe(true);
  });
});
