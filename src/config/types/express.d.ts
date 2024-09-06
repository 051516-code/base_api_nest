import { User } from '../modules/users/entities/user.entity'; // Asegúrate de ajustar la ruta al archivo User

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        roles: string[];
      };
    }
  }
}