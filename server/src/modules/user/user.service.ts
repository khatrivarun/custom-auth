import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/constants/repositories.constant';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: typeof User,
  ) {}
}
