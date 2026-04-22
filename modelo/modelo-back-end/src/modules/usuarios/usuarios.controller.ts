import {
  ForbiddenException,
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Query,
  Body,
  Post,
  Get,
  Req,
} from '@nestjs/common';
import {
  ApiCreateOperation,
  ApiDeleteOperation,
  ApiSearchOperation,
  ApiUpdateOperation,
} from 'src/common/documentation';
import { BuscaUsuarioFilterDto } from './dto/busca-usuarios.dto';
import { AtualizaUsuarioDto } from './dto/atualiza-usuario.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CriaUsuarioDto } from './dto/cria-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { Request } from 'express';
import { AtualizaLoginKeycloakDto } from './dto/atualiza-login-keycloak.dto';

@ApiBearerAuth()
@Controller('usuarios')
@ApiTags('Usuários')
export class UsuariosController {
  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiSearchOperation({
    summary: 'Busca usuários',
    description:
      'Faz uma busca que retorna um array de usuários com base nos parâmetros de filtro utilizados...',
  })
  async buscaTodos(@Query() queryParams?: BuscaUsuarioFilterDto) {
    const { busca, filtro, itensPorPagina, pagina, valor } = queryParams;

    return await this.usuarioService.buscaTodos(
      pagina,
      itensPorPagina,
      busca,
      filtro?.split(','),
      valor?.split(','),
    );
  }

  @Get('/me')
  @ApiSearchOperation({
    summary: 'Busca usuário autenticado',
    description:
      'Retorna os dados do usuário autenticado para sincronização pós-login...',
  })
  async buscaUsuarioAutenticado(@Req() request: Request): Promise<any> {
    const user = request.user as { id?: string; sub?: string } | undefined;

    if (user?.sub) {
      const usuario = await this.usuarioService.buscaPerfilPorSub(user.sub);
      if (usuario) {
        return usuario;
      }
    }

    throw new NotFoundException('Usuário autenticado não encontrado!');
  }

  @Patch('/:sub/login')
  @ApiUpdateOperation({
    summary: 'Atualiza login de um usuário no Keycloak',
    description:
      'Atualiza o login (username) no Keycloak e na base local do usuário identificado pelo sub. Exclusivo para admins.',
  })
  async atualizaLoginUsuario(
    @Param('sub') sub: string,
    @Req() request: Request,
    @Body() data: AtualizaLoginKeycloakDto,
  ) {
    const user = request.user as
      | {
          sub?: string;
          resource_access?: Record<string, { roles?: string[] }>;
        }
      | undefined;

    const clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID');

    if (!clientId) {
      throw new InternalServerErrorException(
        'KEYCLOAK_CLIENT_ID não configurado.',
      );
    }

    if (!user?.sub) {
      throw new NotFoundException('Usuário autenticado não encontrado!');
    }

    const clientRoles = user.resource_access?.[clientId]?.roles ?? [];
    const isAdmin = clientRoles.some((role) => role?.toLowerCase() === 'admin');

    if (!isAdmin) {
      throw new ForbiddenException(
        'Acesso negado: role admin ausente no client do Keycloak.',
      );
    }

    return this.usuarioService.atualizaLoginNoKeycloak(sub, data);
  }

  @Get('/:id')
  @ApiSearchOperation({
    summary: 'Busca um usuário',
    description:
      'Faz uma busca que retorna um usuário específico com base no ID passado como parâmetro...',
  })
  async buscaPorId(@Param('id') id: string): Promise<any> {
    return this.usuarioService.buscaPorId(id);
  }

  @Post()
  @ApiCreateOperation({
    summary: 'Cria um usuário',
    description:
      'Cria um usuário com base nos dados passados no corpo da requisição...',
  })
  async cria(@Body() dados: CriaUsuarioDto): Promise<any> {
    return await this.usuarioService.cria(dados);
  }

  @Patch('/:id')
  @ApiUpdateOperation({
    summary: 'Atualiza um usuário',
    description:
      'Atualiza um usuário com base no ID passado como parâmetro e dados passados no corpo da requisição...',
  })
  async atualiza(@Param('id') id: string, @Body() data: AtualizaUsuarioDto) {
    return await this.usuarioService.atualiza(id, data);
  }

  @Delete('/:id')
  @ApiDeleteOperation({
    summary: 'Exclui um usuário',
    description: 'Exclui um usuário com base no ID passado como parâmetro...',
  })
  async deleta(@Param('id') id: string) {
    return await this.usuarioService.deleta(id);
  }
}
