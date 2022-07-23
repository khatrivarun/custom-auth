import { Provider } from '@nestjs/common';
import { UserRepository } from 'src/constants/repositories.constant';
import { User } from 'src/models/user.model';

export const repositoryProviders: Provider<any>[] = [
  {
    provide: UserRepository,
    useValue: User,
  },
];
