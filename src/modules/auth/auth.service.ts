import { Injectable, BadRequestException} from '@nestjs/common';

//TODO: Imports necesarios para la auth
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

//TODO: para hash y encriptar
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService : UsersService,
    private readonly jwtService : JwtService
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
}

