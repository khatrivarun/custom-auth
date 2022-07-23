import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [DatabaseModule, RepositoryModule, UserModule],
})
export class AppModule {}
