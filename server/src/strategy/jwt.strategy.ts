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
    const fromCookies = (request: Request): string => {
      if (request && request.cookies) {
        console.log(request.cookies);

        return request.cookies.accessToken;
      }
      return null;
    };
    super({
      jwtFromRequest: fromCookies,
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
