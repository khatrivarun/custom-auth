import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './tokens.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: '<SECRET KEY>',
      signOptions: {
        expiresIn: '30s',
      },
    }),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
