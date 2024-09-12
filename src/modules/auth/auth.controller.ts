import { SendResetCodeDto } from './dto/send-reset-code.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
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
     async login(@Body() loginDto : LoginDto ) {

      console.log('Solicitud login:', loginDto)

     // Buscar el usuario por email y validar la contraseña
      const userLog = await this.authService.login(loginDto);

     // Si el login es exitoso, devolver el token y el email
        if (userLog) {
          return {
            success: true,
            token: userLog.token,  // Enviar el token generado
            email: userLog.email,  // Enviar el email del usuario
            message: 'Usuario logueado con éxito'
          };
        } else {
          // Si el login falla, devolver un mensaje de error
          return { 
            success: false, 
            message: 'Usuario no logueado, credenciales incorrectas' 
          };
        }
    }
    
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    async register(@Body() registerDto : RegisterDto){

      console.log('Solicitud registro:', registerDto);
      
      const newUSer = await this.authService.register(registerDto);
      if(newUSer) {
        return {success: true , message : 'Usuario registrado con exito'};
      }else {
        return {success: false , message : 'Usuario no registrado'};
      }
    }




    @Post('send-reset-code')
    @ApiOperation({ summary: 'Send a password reset code to the user\'s email' })
    @ApiBody({ type: SendResetCodeDto })
    async sendResetCode(@Body() sendResetCodeDto: SendResetCodeDto): Promise<{ success: boolean, message?: string }> {

      console.log('Solicitud de codigo:', sendResetCodeDto);

      try {
        const result = await this.authService.sendResetCode(sendResetCodeDto)
        return { 
          success: result.success, message: result.success 
          ? 'Código enviado con éxito' 
          : 'Error al enviar el código' 
        };
      } catch (error) {

        console.error('Error en sendResetCode:', error);
        return { success: false, message: 'Error al enviar el código de recuperación' };
      
      }
    }

    
    @Patch('reset-password')
    @ApiOperation({ summary: 'Reset the user\'s password' })
    @ApiBody({ type: ResetPasswordDto })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ success: boolean }> {
     
      console.log('Solicitud de resetPAss:', resetPasswordDto);
     
      try {
        //TODO: llamamos al servicio para restablecer la contrasena
        const resultResetPass = await this.authService.resetPassword(resetPasswordDto);
      
      // Si el servicio devuelve éxito, retornamos un objeto con éxito
      return { success: resultResetPass.success };

      }catch (error) {
        // Si hay algún error, lo manejamos aquí y retornamos un objeto con éxito en falso
        if (error instanceof NotFoundException || error instanceof BadRequestException) {
          throw error; // Propagar el error para que el frontend lo maneje adecuadamente
        } else {
          throw new BadRequestException('Error al restablecer la contraseña.');
        }
      }
    }

  }
