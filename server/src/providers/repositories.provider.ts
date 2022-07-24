import { RefreshToken } from 'src/models/refresh-token.model';
import { RefreshTokenRepository } from './../constants/repositories.constant';
import { Provider } from '@nestjs/common';
import { UserRepository } from 'src/constants/repositories.constant';
import { User } from 'src/models/user.model';

export const repositoryProviders: Provider<any>[] = [
  {
    provide: UserRepository,
    useValue: User,
  },
  {
    provide: RefreshTokenRepository,
    useValue: RefreshToken,
  },
];
