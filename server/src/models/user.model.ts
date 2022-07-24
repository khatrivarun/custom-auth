import { RegisterAccountDto } from './../dtos/auth/register-account.dto';
import { RefreshToken } from './refresh-token.model';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Table({ tableName: 'users', underscored: true })
export class User extends Model<User> {
  @Column
  username: string;

  @Column
  password: string;

  @HasMany(() => RefreshToken)
  refreshTokens: RefreshToken[];

  static async fromDto(registerAccountDto: RegisterAccountDto): Promise<User> {
    const user = new User();

    user.username = registerAccountDto.username;
    user.password = await bcrypt.hash(registerAccountDto.password, 10);
    user.refreshTokens = [];

    return user;
  }
}
