import { Logger, Provider } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeORM } from 'src/constants/database.constant';
import { User } from 'src/models/user.model';

export const databaseProviders: Provider<any>[] = [
  {
    provide: SequelizeORM,
    useFactory: async () => {
      const logger = new Logger('Sequelize PostgreSQL');

      logger.log('Connecting to the database');
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        logging: (...message) => logger.debug(message),
      });

      sequelize.addModels([User]);
      await sequelize.sync();

      logger.log('Successfully connected to the database');
      return sequelize;
    },
  },
];
