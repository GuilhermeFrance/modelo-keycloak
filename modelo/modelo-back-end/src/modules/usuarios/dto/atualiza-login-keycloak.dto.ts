import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizaLoginKeycloakDto {
  @ApiProperty({
    description:
      'Novo login (username) do usuário no Keycloak e na base local.',
  })
  @IsString({ message: 'O login deve ser uma string.' })
  @MinLength(3, { message: 'O login deve ter no mínimo 3 caracteres.' })
  readonly login: string;
}
