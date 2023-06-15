import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Post,
  UseGuards,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { SignInDto, SignUpDto, TokenDto } from './dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard';

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

  @UseGuards(JwtGuard)
  @Delete('logout')
  logOut(@Headers('Authorization') jwt: string): Promise<void> {
    return this.authService.logOut(jwt.replace('Bearer ', ''));
  }
}
