import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../modules/users/users.service';

// Este guard verifica que el usuario esté autenticado usando un token JWT.
@Injectable()
export class AuthenticationGuard implements CanActivate {
  
  private readonly logger = new Logger(AuthenticationGuard.name);

  constructor (
    // Servicio para manejar JWT
    private readonly jwtService: JwtService,
    // Servicio para manejar usuarios
    private readonly usersService: UsersService,
    // Servicio para manejar configuraciones
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Accede al objeto de contexto para extraer la solicitud
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request); // Método para extraer el token del encabezado

    // Verifica si existe un token en el encabezado
    if (!token) {
      this.logger.warn('Token no encontrado en el encabezado de autorización.');
      throw new UnauthorizedException('El usuario no tiene un token.');
    }

    try {
      // Decodifica el token usando el secreto JWT
      const secret = this.configService.get<string>('JWT_SECRET');
      const decodedToken = await this.jwtService.verifyAsync(token, { secret });
      const userEmail = decodedToken.email;

      // Busca al usuario en la base de datos por su correo electrónico
      const user = await this.usersService.findOneByEmail(userEmail);

      // Verifica si el usuario existe en la base de datos
      if (!user) {
        this.logger.warn('Usuario no encontrado en la base de datos.');
        throw new UnauthorizedException('Usuario no encontrado.');
      }

      // Asigna la información del usuario al objeto de solicitud, mapeando roles a un array de cadenas
      request.user = {
        email: user.email,
        roles: user.roles.map(role => role.name) // Asegúrate de que `role.name` sea un string
      };
      console.log(request.user)
      return true;

    } catch (error) {
      this.logger.error(`Error al verificar el token: ${error.message}`);
      throw new UnauthorizedException('El token proporcionado no es válido.');
    }
  }

  // Método para extraer el token del encabezado de autorización
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return undefined;
    }
    return token;
  }
}
