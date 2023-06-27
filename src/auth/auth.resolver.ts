import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SignInInput, SignUpInput } from './dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard';
import { Token } from './model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => Token)
  signIn(@Args('input') input: SignInInput): Promise<Token> {
    return this.authService.signIn(input);
  }

  @Mutation(() => Token)
  signUp(@Args('input') input: SignUpInput): Promise<Token> {
    return this.authService.signUp(input);
  }

  @UseGuards(JwtGuard)
  @Query(() => Boolean)
  async signOut(@Context('req') req): Promise<boolean> {
    const jwt = req.headers.authorization.replace('Bearer ', '');

    await this.authService.signOut(jwt);

    return true;
  }
}
