import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  readonly resetCode: string;

  @IsString()
  @MinLength(6)
  readonly newPassword: string;
}
