import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

//TODO: Imports necesarios
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jw.constants';
import { UsersModule } from '../users/users.module';



//TODO: entities
@Module({
  imports: [
    UsersModule,

    //TODO: Config para el jwt
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d'}
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
