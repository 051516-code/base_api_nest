import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//TODO: Imports necesarios
import { User } from './entities/user.entity';
import { Roles } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';



@Injectable()
export class UsersService {

  constructor(
   
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,

    @InjectRepository(Roles)
    private readonly roleRepository : Repository<Roles>
    // @InjectRepository(Permission) 
    // private readonly permissionRepository: Repository<Permission>,

  ){}

  // TODO: buscamos el usuario por el email proporcionado en el auth <email>
  async findByEmailWithPassword(email: string){

    return await this.userRepository.findOne({
      where: {email : email},
      select: ['userId', 'name', 'email', 'password', 'roles']
    })
  }

  // TODO: metodo para buscar un usuario por el email
  async findOneByEmail( email: string){
    const userFound = await this.userRepository.findOneBy({email})
    return userFound;
  }



 // TODO: metodo para crear un usuario 
  async createUser(createUserDto : CreateUserDto){
    //TODO> buscamos el rol por defecto en la base de datos ( ej: user )
    const defaultRole = await this.roleRepository.findOne({where: { name : 'user'}})
    
    if(!defaultRole){
      throw new Error('El rol por defecto no se encuentra en la base de datos');
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      roles:[defaultRole]
    });

    //TODO: salvamos en el usuario creado
    return this.userRepository.save(newUser)
  
  }

  async findOneByResetCode(resetCode: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { resetCode },
    });
  }


  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

 // TODO: metodo para saber los permisos de un usuario
  // async getUserPermissions(email: string): Promise<string[]> {
  //   // Encontrar al usuario por email
  //   const user = await this.userRepository.findOne({ where: { email }, relations: ['roles'] });

  //   if (!user) {
  //     throw new Error('Usuario no encontrado');
  //   }

  //   // Obtener roles del usuario
  //   const roles = await this.roleRepository.find({ where: { id: In(user.roles.map(role => role.id)) }, relations: ['permissions'] });

  //   // Obtener permisos de los roles
  //   const permissions = roles.flatMap(role => role.permissions);

  //   // Devolver permisos únicos como array de strings
  //   return [...new Set(permissions.map(permission => permission.name))];
  // }



}
