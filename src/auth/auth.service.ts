import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Token } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { PrismaErrorEnum } from '../utils/enums';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto, TokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(input: SignInDto): Promise<TokenDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are wrong');
    }

    const passwordIsValid = await compare(input.password, user.hash);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are wrong');
    }

    const token = await this.createToken(user.id);

    return this.generateAccessToken(token.jti);
  }

  async signUp({ password, ...input }: SignUpDto): Promise<TokenDto> {
    const userFound = await this.prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });

    if (userFound) {
      throw new UnprocessableEntityException('The email is already taken');
    }

    const user = await this.prisma.user.create({
      data: {
        ...input,
        hash: await hash(password, 10),
      },
    });

    const token = await this.createToken(user.id);

    return this.generateAccessToken(token.jti);
  }

  async signOut(jwt: string): Promise<void> {
    try {
      const { sub } = this.jwtService.verify(jwt, {
        secret: this.config.get<string>('JWT_SECRET_KEY'),
      });

      await this.prisma.token.delete({
        where: {
          jti: sub as string,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFoundException('Session not found');
          default:
            throw error;
        }
      }

      throw error;
    }
  }

  async createToken(id: number): Promise<Token> {
    try {
      return await this.prisma.token.create({
        data: {
          userId: id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.FOREIGN_KEY_CONSTRAINT:
            throw new NotFoundException('User not found');
          default:
            throw error;
        }
      }

      throw error;
    }
  }

  generateAccessToken(sub: string): TokenDto {
    const secret = this.config.get('JWT_SECRET_KEY');
    const expiresIn = this.config.get('JWT_EXPIRATION_TIME');
    const accessToken = this.jwtService.sign(
      {
        sub,
      },
      { expiresIn, secret },
    );

    return new TokenDto({
      accessToken,
      exp: expiresIn,
    });
  }
}
