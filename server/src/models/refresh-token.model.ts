import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'refresh_tokens', underscored: true })
export class RefreshToken extends Model<RefreshToken> {
  @Column
  isRevoked: boolean;

  @Column
  expiresIn: Date;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  static createNewToken(user: User, ttl: number): RefreshToken {
    const refreshToken = new RefreshToken();

    refreshToken.user = user;
    refreshToken.userId = user.id;
    refreshToken.expiresIn = new Date(Date.now() + ttl);

    return refreshToken;
  }
}
