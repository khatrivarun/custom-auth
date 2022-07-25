import { UserService } from './../modules/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/models/user.model';
import { Request } from 'express';

export interface AccessTokenPayload {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly userService: UserService) {
    const fromCookiesOrHeader = (request: Request): string => {
      if (request && request.cookies && request.cookies.accessToken) {
        return request.cookies.accessToken;
      } else if (
        request &&
        request.headers &&
        request.headers['authorization']
      ) {
        return request.headers['authorization'].substring('Bearer '.length);
      } else return null;
    };
    super({
      jwtFromRequest: fromCookiesOrHeader,
      ignoreExpiration: false,
      secretOrKey: '<SECRET KEY>',
      signOptions: {
        expiresIn: '30s',
      },
    });
  }

  async validate(payload: AccessTokenPayload): Promise<User> {
    const { sub: id } = payload;

    const user = await this.userService.findForId(id);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
