import { Global, Module } from '@nestjs/common';
import { repositoryProviders } from 'src/providers/repositories.provider';

@Global()
@Module({
  providers: [...repositoryProviders],
  exports: [...repositoryProviders],
})
export class RepositoryModule {}
