import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleDto } from './dto/create-role.dto';

import { Roles } from './entities/role.entity';

@Injectable()
export class RoleService implements OnModuleInit {

  constructor(
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>
  ) {}


  async onModuleInit() {
    await this.createDefaultRoles();
  }

 async createDefaultRoles(): Promise<void>{
  const defaultRole = await this.roleRepository.findOne({where: { name : 'user'}});
  if(!defaultRole){
    const role = this.roleRepository.create({
      name: 'user',
      description: 'Default role for regular users'
    });
    await this.roleRepository.save(role);
  }
 }

 async findRoleByName(name: string): Promise<Roles | undefined> {
  return this.roleRepository.findOne({ where: { name } });
}


}
