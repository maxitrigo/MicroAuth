import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailService } from '../mail/mail.service';
import { UsersModule } from 'src/users/users.module';
import { JWT_SECRET } from 'src/config/env.config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET, //cambiar en prod..
      signOptions: { expiresIn: '4h' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService]
})
export class AuthModule {}
