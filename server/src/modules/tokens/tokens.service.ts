import {
  RefreshTokenRepository,
  UserRepository,
} from './../../constants/repositories.constant';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RefreshToken } from 'src/models/refresh-token.model';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user.model';

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://my-app.com',
  audience: 'https://my-app.com',
};

export interface RefreshTokenPayload {
  jti: number;
  sub: number;
}

@Injectable()
export class TokensService {
  constructor(
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: typeof RefreshToken,
    @Inject(UserRepository)
    private readonly userRepository: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken | null> {
    const tokenId = payload.jti;

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return await this.refreshTokenRepository.findOne({
      where: {
        id: tokenId,
      },
    });
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<User> {
    const subId = payload.sub;

    if (!subId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.userRepository.findOne({
      where: {
        id: subId,
      },
    });
  }

  public async generateAccessToken(user: User): Promise<string> {
    const options: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
    };

    return await this.jwtService.signAsync({}, options);
  }

  public async generateRefreshToken(
    user: User,
    expiresIn: number,
  ): Promise<string> {
    const token = RefreshToken.createNewToken(user, expiresIn);
    const savedToken = await token.save();

    const options: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(user.id),
      jwtid: String(savedToken.id),
    };

    return await this.jwtService.signAsync({}, options);
  }

  public async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: User; token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException('Refresh Token Not Found');
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException('Refresh Token Revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh Token Malformed');
    }

    return { user, token };
  }

  public async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: User }> {
    const { user } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { user, token };
  }
}
