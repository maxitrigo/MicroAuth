import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_PORT, DB_USERNAME, DB_HOST, DB_PASSWORD, DB_DATABASE, DB_TYPE } from './config/env.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: DB_TYPE as any,
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
