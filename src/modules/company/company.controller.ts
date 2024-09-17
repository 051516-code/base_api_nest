import {Controller, Post, Get, Request, Body, UseGuards, BadRequestException} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Company')
@Controller('company')
@UseGuards(AuthenticationGuard)
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create company' })
  @ApiBody({ type: CreateCompanyDto })
  async create(@Body() createCompanyDto: CreateCompanyDto ,@Request() req ): Promise<{ success: boolean, message?: string, data: CreateCompanyDto }> {
    
    
    try {
    const user = req.user.email;
    console.log('Solicitante  :', user)
    console.log('Compania :', createCompanyDto)

       //TODO: Llama al servicio para crear la empresa
    const companyResult = await this.companyService.create(createCompanyDto, user)
   
  return {
      success : true,
      message: 'Empresa creada con exito',
      data: companyResult,
    }

  
  
  } catch (error) {
    //TODO: maneja las exepciones de manera que el mensaje sea claro
    console.error('Error al crear la empresa:', error);
      throw new BadRequestException(error.response.message || 'Error al crear la empresa. Inténtalo nuevamente.');
    
  }
 
}

  @Get('all')
  findAll() {
    console.log('Solicitud de todas las company')
    return this.companyService.findAll();
  }

  
}
