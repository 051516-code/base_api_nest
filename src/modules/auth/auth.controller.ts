import { SendResetCodeDto } from './dto/send-reset-code.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiBody({ type: LoginDto })
      login(@Body() loginDto : LoginDto ) {
        return this.authService.login(loginDto)
    }
    
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    register(@Body() registerDto : RegisterDto){
    return this.authService.register(registerDto)
    }

    @Post('send-reset-code')
    @ApiOperation({ summary: 'Send a password reset code to the user\'s email' })
    @ApiBody({ type: SendResetCodeDto })
    async sendResetCode(@Body() sendResetCodeDto: SendResetCodeDto): Promise<{ success: boolean }> {
      return this.authService.sendResetCode(sendResetCodeDto);
    }

    
    @Patch('reset-password')
    @ApiOperation({ summary: 'Reset the user\'s password' })
    @ApiBody({ type: ResetPasswordDto })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ success: boolean }> {
      return this.authService.resetPassword(resetPasswordDto);
    }

  }
