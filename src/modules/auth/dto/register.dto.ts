import { IsString, IsNotEmpty, IsEmail, MaxLength , MinLength} from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    readonly name : string;

    @IsEmail({}, { message: 'Debe proporcionar un email válido.'  })
    @IsNotEmpty()
    readonly email : string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    readonly password : string;

}