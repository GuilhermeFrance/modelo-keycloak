import { PaginateService } from 'src/shared/services/paginate.service';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { KeycloakAdminService } from '../keycloak/keycloak.service';

@Module({
  exports: [UsuariosService],
  controllers: [UsuariosController],
  providers: [UsuariosService, PaginateService, KeycloakAdminService],
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
})
export class UsuariosModule {}
