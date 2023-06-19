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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto, SignUpDto, TokenDto } from './dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard';

@ApiTags('Auth')
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

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete('signout')
  signOut(@Headers('Authorization') jwt: string): Promise<void> {
    return this.authService.signOut(jwt.replace('Bearer ', ''));
  }
}
