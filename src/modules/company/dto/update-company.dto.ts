import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
// import { CompanyType } from '../enums/company-type.enum'; // Asumiendo que tienes un enum para los tipos de empresa

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  name?: string;

//   @IsEnum(CompanyType)
//   @IsOptional()
//   type?: CompanyType;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  banner?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  neighborhood?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  // Otros campos según sea necesario
}
