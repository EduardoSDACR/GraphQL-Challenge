import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SignInDto, SignUpDto, TokenDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signin')
  signIn(@Body() input: SignInDto): Promise<TokenDto> {
    return this.authService.signIn(input);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  signUp(@Body() input: SignUpDto): Promise<TokenDto> {
    return this.authService.signUp(input);
  }
}
