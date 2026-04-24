import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UserKeycloakDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^\d]+$/, { message: 'O primeiro nome não pode conter números' })
  readonly firstName: string;
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^\d]+$/, { message: 'O último nome não pode conter números' })
  readonly lastName: string;
  @IsBoolean()
  @IsOptional()
  readonly enabled: boolean;
  @IsBoolean()
  @IsOptional()
  readonly emailVerified: boolean;
  @IsArray()
  @IsOptional()
  readonly credentials: [
    {
      type: string;
      value: 'senha-temporaria-123';
      temporary: true;
    },
  ];
}
