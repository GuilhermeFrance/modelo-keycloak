import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizaLoginKeycloakDto {
  @ApiProperty({
    description:
      'Novo login (username) do usuário no Keycloak e na base local.',
  })
  @IsString({ message: 'O login deve ser uma string.' })
  @MinLength(3, { message: 'O login deve ter no mínimo 3 caracteres.' })
  readonly login: string;

  @ApiPropertyOptional({
    description:
      'Nova senha do usuário no Keycloak. Se não informada, a senha atual é mantida.',
  })
  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  readonly senha?: string;
}
