import { IsString, IsNotEmpty, IsEnum, IsUrl, IsLatitude, IsLongitude, IsUUID, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['mecanica', 'guincho'])
  @IsNotEmpty()
  type: string;

  // @IsUrl()
  @IsOptional()
  logo?: string;

  // @IsUrl()
  @IsOptional()
  banner?: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

}
