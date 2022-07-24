import { AuthModule } from './modules/auth/auth.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    RepositoryModule,
    UserModule,
    TokensModule,
    AuthModule,
  ],
})
export class AppModule {}
