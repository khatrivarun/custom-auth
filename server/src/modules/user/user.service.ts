import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserRepository } from 'src/constants/repositories.constant';
import { RegisterAccountDto } from 'src/dtos/auth/register-account.dto';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: typeof User,
  ) {}

  public async validateCredentials(
    user: User,
    password: string,
  ): Promise<boolean> {
    return await compare(password, user.password);
  }

  public async createUserFromRequest(
    registerAccountDto: RegisterAccountDto,
  ): Promise<User> {
    const { username } = registerAccountDto;

    const existingFromUsername = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    if (existingFromUsername) {
      throw new UnprocessableEntityException('Username already in use');
    }

    const newUser = await User.fromDto(registerAccountDto);
    return await newUser.save();
  }

  public async findForId(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async findForUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        username,
      },
    });
  }
}
