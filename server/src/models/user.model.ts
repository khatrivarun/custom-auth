import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users', underscored: true })
export class User extends Model {
  @Column
  username: string;

  @Column
  password: string;
}
