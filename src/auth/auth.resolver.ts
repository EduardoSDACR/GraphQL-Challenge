import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SignInInput, SignUpInput } from './dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard';
import { Token } from './model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(/* istanbul ignore next */ () => Token, {
    description: 'With provided user access information obtain credentials',
  })
  signIn(@Args('input') input: SignInInput): Promise<Token> {
    return this.authService.signIn(input);
  }

  @Mutation(/* istanbul ignore next */ () => Token, {
    description: 'Register in the application',
  })
  signUp(@Args('input') input: SignUpInput): Promise<Token> {
    return this.authService.signUp(input);
  }

  @UseGuards(JwtGuard)
  @Mutation(/* istanbul ignore next */ () => Boolean, {
    description: 'End user session and delete credentials validation',
  })
  async signOut(@Context('req') req): Promise<boolean> {
    const jwt = req.headers.authorization.replace('Bearer ', '');

    await this.authService.signOut(jwt);

    return true;
  }
}
