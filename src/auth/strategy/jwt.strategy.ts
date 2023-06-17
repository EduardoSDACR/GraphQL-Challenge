import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: { sub: string }) {
    const token = await this.prisma.token.findUnique({
      where: {
        jti: payload.sub,
      },
      select: {
        user: {
          select: {
            uuid: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid authentication');
    }

    return token.user;
  }
}
