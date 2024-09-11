import { Injectable, BadRequestException, NotFoundException} from '@nestjs/common';

//TODO: Imports necesarios para la auth
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendResetCodeDto } from './dto/send-reset-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

//TODO: para hash y encriptar
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';



@Injectable()
export class AuthService {

  constructor(
    private readonly userService : UsersService,
    private readonly jwtService : JwtService,
    private readonly mailService : MailerService
  ){}
  

  async register({ name, email, password} : RegisterDto){

    //TODO: validamos que no exista un usuario con este email en la base de datos
    const userFound = await this.userService.findOneByEmail(email);
    if (userFound) {
      throw new BadRequestException('El usuario ya existe en la base de datos');
    }

    // TODO: has de la contrasena
    const hashedPassword = await bcryptjs.hash(password, 10);

    // TODO: creamos el nuevo usuario
    await this.userService.createUser({
      name,
      email,
      password: hashedPassword,
      role:''
    })

    // TODO: retornamos el email y nombre creado
    return {
      name,
      email
    };
  }

  async login({ email, password }: LoginDto): Promise<{ token: string; email: string }> {

    // TODO: validamos la existencia del usuario
    const userFound = await this.userService.findByEmailWithPassword(email);
    
    if(!userFound){
      throw new Error("El usuario no existe en la base de datos.");

    }
    // TODO: validamos la contrasena del usuario
    const isPasswordValid = await bcryptjs.compare(password, userFound.password)
    if(!isPasswordValid){
      throw new Error("La contrasena es incorrecta");
    }
     // TODO: si ambos son correctos(email y password) creamos un token
     const payload = {
      email: userFound.email,
      roles: userFound.roles
     };

     // TODO: firmamos el token
     const token = await this.jwtService.signAsync(payload);
    
    // TODO: retornamos el token y el correo electronico
    return {
      token,
      email: userFound.email,
    }
  }

  async sendResetCode(sendResetCodeDto: SendResetCodeDto): Promise<{ success: boolean }> {
    const { email } = sendResetCodeDto;

    // Buscar el usuario por correo
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    // Generar el código de recuperación
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString(); // Código de 4 dígitos
    user.resetCode = resetCode; // Asignar el código al usuario
    await this.userService.save(user); // Guardar el usuario con el código

    try {
      // Enviar el correo con el código de recuperación
      await this.mailService.sendMail({
        to: email,
        subject: 'Código de recuperación de contraseña',
        template: '/reset-password-code', // Nombre del archivo de la plantilla sin extensión
        context: {
          code: resetCode, // Pasar el código al contexto de la plantilla
        },
      });

      return { success: true }; // Retornar éxito
    } catch (error) {
      console.error('Error sending reset code:', error); // Mostrar error en consola
      throw new BadRequestException('Failed to send reset code.'); // Manejar el error
    }
  }


async resetPassword(resetCode: string, resetPasswordDto: ResetPasswordDto): Promise<{ success: boolean }> {
    const user = await this.userService.findOneByResetCode(resetCode);

    if (!user) {
      throw new NotFoundException('Código de recuperación inválido o expirado.');
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcryptjs.hash(resetPasswordDto.newPassword, 10);

    // Actualizar la contraseña del usuario
    user.password = hashedPassword;
    user.resetCode = null; // Limpiar el código de recuperación
    await this.userService.save(user);

    return { success: true };
  }
}

