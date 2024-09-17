import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { UsersService } from '../users/users.service';


@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>, // Inyección del repositorio de Company
    private readonly userService: UsersService
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userEmail: string): Promise<Company> {
    try {

    //todo: Busca el usuario por el email
    const userFound = await this.userService.findOneByEmail(userEmail);
    
    if (!userFound) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    //TODO: buscamos si la empresa existe en esa ubicacion
    const existingCompany = await this.companyRepository.findOne({
      where: { name: createCompanyDto.name, latitude: createCompanyDto.latitude, longitude: createCompanyDto.longitude }
    });

    if (existingCompany) {
      throw new ConflictException('Una empresa ya existe en esta ubicación.');
    }

      // TODO: Crea la empresa con el ID del usuario como propietario
      const company = new Company();
      company.name = createCompanyDto.name;
      company.logo = createCompanyDto.logo;
      company.banner = createCompanyDto.banner;
      company.type = createCompanyDto.type;
      company.neighborhood = createCompanyDto.neighborhood;
      company.city = createCompanyDto.city;
      company.state = createCompanyDto.state;
      company.country = createCompanyDto.country;
      company.latitude = createCompanyDto.latitude;
      company.longitude = createCompanyDto.longitude;
      company.owner = userFound; // Asocia el usuario como propietario
      company.createdAt = new Date();
      company.updatedAt = new Date();
  
      //TODO: Guarda la empresa en la base de datos
      return await this.companyRepository.save(company);

    } catch (error) {

      throw new InternalServerErrorException( error + 'Error al crear la empresa.');
    }
  
  }

  findAll() {
    return `This action returns all companies`;
  }

  // Otros métodos comentados por ahora
}
