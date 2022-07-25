import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @Optional()
  readonly refresh_token: string;
}
