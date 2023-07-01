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
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaErrorEnum } from '../utils/enums';
import { PrismaService } from '../prisma/prisma.service';
import { SignInInput, SignUpInput } from './dto';
import { Token as TokenModel } from './model';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailerService: MailerService,
  ) {}

  async signIn(input: SignInInput): Promise<TokenModel> {
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

  async signUp({ password, ...input }: SignUpInput): Promise<TokenModel> {
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

  async generateChangePasswordKey(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('This email is not registered in the app');
    }

    const token = await this.prisma.token.create({
      data: {
        userId: user.id,
      },
    });

    await this.mailerService.sendMail({
      to: email,
      from: this.config.get<string>('EMAIL_SENDER'),
      subject: 'Change password',
      text: 'This is your key to change your password',
      html: `<strong>Use this key to change your password: ${token.jti}</strong>`,
    });
  }

  async changePassword(key: string, newPassword: string): Promise<void> {
    const token = await this.prisma.token.findUnique({
      where: {
        jti: key,
      },
    });

    if (!token || !token.userId) {
      throw new UnprocessableEntityException('Invalid key');
    }

    const user = await this.prisma.user.update({
      where: {
        id: token.userId,
      },
      data: {
        hash: await hash(newPassword, 10),
      },
    });

    await this.prisma.token.delete({
      where: {
        id: token.id,
      },
    });

    await this.mailerService.sendMail({
      to: user.email,
      from: this.config.get<string>('EMAIL_SENDER'),
      subject: 'Password was change',
      text: `Your password was successfully change at ${Date.now()}}`,
      html: `<strong>Your password was successfully change at ${user.updatedAt}</strong>`,
    });
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

  generateAccessToken(sub: string): TokenModel {
    const secret = this.config.get('JWT_SECRET_KEY');
    const expiresIn = this.config.get('JWT_EXPIRATION_TIME');
    const accessToken = this.jwtService.sign(
      {
        sub,
      },
      { expiresIn, secret },
    );

    return {
      accessToken,
      exp: expiresIn,
    };
  }
}
