import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Debe proporcionar un email válido.' })
    @IsNotEmpty()
    readonly email : string;

    @IsString()
    @IsNotEmpty()
    readonly password : string;
}