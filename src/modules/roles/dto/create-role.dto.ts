import { IsString, IsNotEmpty  } from "class-validator";

export class RoleDto {

    @IsString()
    @IsNotEmpty()
    roleName: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

