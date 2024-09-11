import { SendResetCodeDto } from './dto/send-reset-code.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
    login(@Body() loginDto : LoginDto ) {
      return this.authService.login(loginDto)
    }
  
    @Post('register')
    register(@Body() registerDto : RegisterDto){
    return this.authService.register(registerDto)
    }

    //TODO:  recibe el email y envia el codigo
    @Post('send-reset-code')
    async sendResetCode(@Body() sendResetCodeDto: SendResetCodeDto): Promise<{ success: boolean }> {
      return this.authService.sendResetCode(sendResetCodeDto);
    }

    @Patch('reset-password/:resetCode')
    async resetPassword(@Param('resetCode') resetCode: string, @Body() resetPasswordDto: ResetPasswordDto): Promise<{ success: boolean }> {
      return this.authService.resetPassword(resetCode, resetPasswordDto);
    }


  }
