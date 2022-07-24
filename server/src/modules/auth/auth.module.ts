import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  providers: [JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
