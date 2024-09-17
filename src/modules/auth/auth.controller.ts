import { SendResetCodeDto } from './dto/send-reset-code.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

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

     // TODO: Buscar el usuario por email y validar la contraseña
      const userLog = await this.authService.login(loginDto);

     // todo> Si el login es exitoso, devolver el token y el email
        if (userLog) {
          return {
            success: true,
            token: userLog.token,  // Enviar el token generado
            email: userLog.email,  // Enviar el email del usuario
            message: 'Usuario logueado con éxito'
          };
        } else {
          // todo> Si el login falla, devolver un mensaje de error
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

      try {
        
        const newUSer = await this.authService.register(registerDto);

        if(newUSer) {

          return {success: true , message : 'Usuario registrado con exito '};

        }else {

          return {success: false , message : 'Usuario no registrado'};

        }

      } catch (error) {

        console.error('Error en registerDto:', error);
        return { success: false, message: 'Error al registrar el usuario ' };

      }
    }




    @Post('send-reset-code')
    @ApiOperation({ summary: 'Send a password reset code to the user\'s email' })
    @ApiBody({ type: SendResetCodeDto })
    async sendResetCode(@Body() sendResetCodeDto: SendResetCodeDto): Promise<{ success: boolean, message?: string }> {
    
      console.log('Solicitud de envío de código de restablecimiento:', sendResetCodeDto);
    
      try {
        // Llamar al servicio para enviar el código
        const result = await this.authService.sendResetCode(sendResetCodeDto);
    
        if (result.success) {
          return {
            success: true,
            message: 'Código de restablecimiento enviado con éxito al correo.'
          };
        } else {
          return {
            success: false,
            message: 'No se pudo enviar el código de restablecimiento. Por favor, inténtalo de nuevo.'
          };
        }
    
      } catch (error) {
        console.error('Error al enviar el código de restablecimiento:', error);
        return {
          success: false,
          message: 'Error al enviar el código de restablecimiento. Inténtalo nuevamente.'
        };
      }
    }
    


    @Post('verify-code')
    @ApiOperation({ summary: 'Verify the password reset code' })
    @ApiBody({ type: VerifyCodeDto })
    async verifyCode(@Body() verifyCodeDto: VerifyCodeDto): Promise<{ success: boolean, message?: string }> {


      console.log('Solicitud de verificación de código:', verifyCodeDto);

      try {
        const result = await this.authService.verifyCode(verifyCodeDto.resetCode);

        if (result.success) {
          return {
            success: true,
            message: 'Código verificado con éxito.'
          };
        } else {
          return {
            success: false,
            message: 'Código de verificación inválido o ya utilizado.'
          };
        }
      } catch (error) {

        console.error('Error al verificar el código:', error);
        throw new BadRequestException('Error al verificar el código de restablecimiento. Inténtalo nuevamente.');
        
      }
    }

    
    @Patch('reset-password')
    @ApiOperation({ summary: 'Reset the user\'s password' })
    @ApiBody({ type: ResetPasswordDto })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ success: boolean, message?: string }> {
     
      console.log('Solicitud de restablecimiento de contraseña:', resetPasswordDto);
     
      try {
        //TODO: llamamos al servicio para restablecer la contrasena
        const result = await this.authService.resetPassword(resetPasswordDto);
      
        if( result.success){
          return {
            success: true,
            message:'Contraseña restablecida con éxito.'
          };
        }else {
          return {
            success: false,
            message:'No se pudo reestablecer la contrasenha. Verifica el codigo'
          };
        }

      }catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        throw new BadRequestException('Error al restablecer la contraseña. Inténtalo nuevamente.');
      }
    }

  }
