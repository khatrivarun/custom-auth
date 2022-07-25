import { RefreshTokenDto } from './../../dtos/auth/refresh-token.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginAccountDto } from 'src/dtos/auth/login-account.dto';
import { RegisterAccountDto } from 'src/dtos/auth/register-account.dto';
import { User } from 'src/models/user.model';
import { TokensService } from '../tokens/tokens.service';
import { UserService } from '../user/user.service';
import { JWTGuard } from 'src/guards/auth.guard';
import { Request, Response } from 'express';

export interface AuthenticationPayload {
  user: User;
  payload: {
    type: string;
    token: string;
    refresh_token?: string;
  };
}

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly tokenService: TokensService,
    private readonly userService: UserService,
  ) {}

  private buildResponsePayload(
    user: User,
    accessToken: string,
    refreshToken?: string,
  ): AuthenticationPayload {
    return {
      user: user,
      payload: {
        type: 'bearer',
        token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      },
    };
  }

  private getOneMonthLater(): Date {
    const today = new Date(Date.now());
    today.setMonth(today.getMonth() + 1);

    return today;
  }

  @Post('/register')
  public async register(@Body() registerAccountDto: RegisterAccountDto) {
    const user = await this.userService.createUserFromRequest(
      registerAccountDto,
    );

    const token = await this.tokenService.generateAccessToken(user);
    const refresh = await this.tokenService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const payload = this.buildResponsePayload(user, token, refresh);

    return {
      status: 'success',
      data: payload,
    };
  }

  @Post('/login')
  public async login(
    @Body() loginAccountDto: LoginAccountDto,
    @Res() response: Response,
  ) {
    const { username, password } = loginAccountDto;

    const user = await this.userService.findForUsername(username);
    const valid = user
      ? await this.userService.validateCredentials(user, password)
      : false;

    if (!valid) {
      throw new UnauthorizedException('The login is invalid');
    }

    const token = await this.tokenService.generateAccessToken(user);
    const refresh = await this.tokenService.generateRefreshToken(
      user,
      this.getOneMonthLater().getTime(),
    );

    const payload = this.buildResponsePayload(user, token, refresh);

    response.cookie('accessToken', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      expires: new Date(Date.now() + 60 * 30),
    });

    response.cookie('refreshToken', refresh, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      expires: this.getOneMonthLater(),
    });

    return response.send({
      status: 'success',
      data: payload,
    });
  }

  @Post('/refresh')
  public async refresh(
    @Req() request: Request,
    @Res() response: Response,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    const { user, token } =
      await this.tokenService.createAccessTokenFromRefreshToken(
        request.cookies.refreshToken ?? refreshTokenDto.refresh_token ?? null,
      );

    const payload = this.buildResponsePayload(user, token);

    response.cookie('accessToken', payload.payload.token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      expires: new Date(Date.now() + 60 * 30),
    });

    return response.send({
      status: 'success',
      data: payload,
    });
  }

  @Post('/lol')
  public async lol(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.cookie('key', 'value', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      expires: new Date(Date.now() + 60 * 60 * 24),
    });
    return response.send();
  }

  @Get('/me')
  @UseGuards(JWTGuard)
  public async getUser(@Req() request) {
    const userId = request.user.id;

    const user = await this.userService.findForId(userId);

    return {
      status: 'success',
      data: user,
    };
  }
}
