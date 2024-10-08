import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  readonly resetCode: string;

  @IsString()
  readonly newPassword: string;
}
