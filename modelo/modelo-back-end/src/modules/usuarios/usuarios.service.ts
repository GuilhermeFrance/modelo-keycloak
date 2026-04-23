import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../plugins/database/services/prisma.service';
import { PaginateService } from 'src/shared/services/paginate.service';
import { AtualizaUsuarioDto } from './dto/atualiza-usuario.dto';
import { CriaUsuarioDto } from './dto/cria-usuario.dto';
import { AtualizaLoginKeycloakDto } from './dto/atualiza-login-keycloak.dto';
import { ConfigService } from '@nestjs/config';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import * as bcrypt from 'bcrypt';
import { Nivel, Situacao } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paginateService: PaginateService,
    private readonly configService: ConfigService,
  ) {}

  async cria(data: CriaUsuarioDto): Promise<any> {
    data.senha = await this.hashDado(data.senha);

    await this._emailExiste(data);
    await this._usuarioExiste(data);

    const usuario = this.prismaService.usuario.create({
      data,
    });

    return usuario;
  }

  async buscaOuCriaPorSub(tokenPayload: {
    sub: string;
    name: string;
    email: string;
    preferred_username: string;
    groups?: string[];
  }): Promise<any> {
    const usuarioExistente = await this.buscaPorSub(tokenPayload.sub);
    if (usuarioExistente) return usuarioExistente;

    const nivel = tokenPayload.groups?.some((g) =>
      g.toUpperCase().includes('ADMIN'),
    )
      ? Nivel.ADMIN
      : Nivel.USUARIO;

    return this.prismaService.usuario.create({
      data: {
        sub: tokenPayload.sub,
        nome: tokenPayload.name,
        email: tokenPayload.email,
        login: tokenPayload.preferred_username,
        senha: await this.hashDado(tokenPayload.sub),
        nivel,
        situacao: Situacao.ATIVO,
      },
    });
  }

  async buscaPorSub(sub: string) {
    const user = this.prismaService.usuario.findUnique({
      where: { sub },
    });
    return user;
  }

  async buscaPerfilPorSub(sub: string) {
    return this.prismaService.usuario.findUnique({
      where: { sub },
      select: {
        id: true,
        sub: true,
        nome: true,
        email: true,
        login: true,
        nivel: true,
        situacao: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async buscaTodos(
    pagina: number,
    itensPorPagina: number,
    busca: string,
    filtro?: string[],
    valor?: string[],
  ) {
    try {
      const querys: Record<string, any> = {};

      if (filtro && valor) {
        filtro.forEach((filtro, index) => {
          const currentValue = valor[index]?.trim();

          if (!currentValue) return;

          if (filtro === 'nivel') {
            const nivel = currentValue.toUpperCase() as Nivel;

            if (!Object.values(Nivel).includes(nivel)) return;

            querys[filtro] = {
              equals: nivel,
            };
            return;
          }

          if (filtro === 'situacao') {
            const situacao = currentValue.toUpperCase() as Situacao;

            if (!Object.values(Situacao).includes(situacao)) return;

            querys[filtro] = {
              equals: situacao,
            };
            return;
          }

          querys[filtro] = {
            contains: currentValue,
            mode: 'insensitive',
          };
        });
      }

      if (pagina && itensPorPagina && querys) {
        return this.paginateService.paginate({
          module: 'usuario',
          busca,
          pagina,
          itensPorPagina,
          querys,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao listar usuários. ${error.message}`,
      );
    }
  }

  async buscaPorLogin(login: string) {
    return await this.prismaService.usuario.findUnique({
      where: {
        login,
      },
      select: {
        id: true,
        login: true,
        email: true,
        senha: true,
        nivel: true,
        situacao: true,
        refreshToken: true,
      },
    });
  }

  async buscaPorId(id: string) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: {
        id,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return usuario;
  }

  async atualiza(id: string, data: AtualizaUsuarioDto) {
    const usuarioExists = await this.prismaService.usuario.findUnique({
      where: {
        id,
      },
    });

    if (!usuarioExists) {
      throw new NotFoundException('Usuario não existe');
    }

    if (data.email && usuarioExists.email !== data.email) {
      await this._emailExiste(data);
    }

    if (data.login && usuarioExists.login !== data.login) {
      await this._usuarioExiste(data);
    }

    if (data.senha) {
      data.senha = await this.hashDado(data.senha);
    }

    await this.prismaService.usuario.update({
      data,
      where: {
        id,
      },
    });
  }

  async deleta(id: string) {
    const usuarioExists = await this.prismaService.usuario.findUnique({
      where: {
        id,
      },
    });

    if (!usuarioExists) {
      throw new NotFoundException('usuario não existe!');
    }

    await this.prismaService.usuario.delete({
      where: {
        id,
      },
    });
  }

  async atualizaLoginNoKeycloak(sub: string, data: AtualizaLoginKeycloakDto) {
    const novoLogin = data.login.trim();
    const novaSenha = data.senha.trim();

    if (!novoLogin) {
      throw new BadRequestException('O login informado é inválido.');
    }

    const usuario = await this.prismaService.usuario.findUnique({
      where: { sub },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário autenticado não encontrado.');
    }

    if (usuario.login === novoLogin) {
      throw new BadRequestException(
        'O novo login deve ser diferente do atual.',
      );
    }

    const loginExistente = await this.prismaService.usuario.findUnique({
      where: { login: novoLogin },
      select: { id: true },
    });

    if (loginExistente) {
      throw new ConflictException('Esse login já existe na base de dados.');
    }

    const kcAdmin = new KcAdminClient({
      baseUrl: this.configService.get<string>('KEYCLOAK_URL'),
      realmName:
        this.configService.get<string>('KEYCLOAK_ADMIN_REALM') || 'master',
    });

    await kcAdmin.auth({
      username: this.configService.get<string>('KEYCLOAK_ADMIN_USER'),
      password: this.configService.get<string>('KEYCLOAK_ADMIN_PASS'),
      grantType: 'password',
      clientId:
        this.configService.get<string>('KEYCLOAK_ADMIN_CLIENT_ID') ||
        'admin-cli',
    });

    try {
      await kcAdmin.users.update(
        {
          realm: this.configService.get<string>('KEYCLOAK_REALM'),
          id: sub,
        },
        {
          username: novoLogin,
          credentials: [{ type: 'password', value: novaSenha }],
        },
      );
    } catch (error: any) {
      const status = error?.response?.status ?? error?.responseData?.status;
      const body =
        error?.response?.data ?? error?.responseData ?? error?.message;
      console.error('[Keycloak] Erro ao atualizar username:', { status, body });

      if (status === 409) {
        throw new ConflictException('Esse login já existe no Keycloak.');
      }

      throw new InternalServerErrorException(
        `Erro ao atualizar login no Keycloak. [${status}] ${JSON.stringify(
          body,
        )}`,
      );
    }

    return this.prismaService.usuario.update({
      where: { id: usuario.id },
      data: { login: novoLogin },
      select: {
        id: true,
        sub: true,
        nome: true,
        email: true,
        login: true,
        nivel: true,
        situacao: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async hashDado(rawData: string) {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hashSync(rawData, SALT);
  }

  async comparaDados(rawData: string, hash: string) {
    return bcrypt.compareSync(rawData, hash);
  }

  private async _usuarioExiste(
    data: CriaUsuarioDto | AtualizaUsuarioDto,
  ): Promise<CriaUsuarioDto> {
    const usuario = await this.prismaService.usuario.findFirst({
      where: {
        login: data.login,
      },
    });

    if (usuario) {
      throw new ConflictException(
        'Esse login de usuário já existe na base de dados',
      );
    }

    return usuario;
  }

  private async _emailExiste(
    data: CriaUsuarioDto | AtualizaUsuarioDto,
  ): Promise<CriaUsuarioDto> {
    const emailExiste = await this.prismaService.usuario.findFirst({
      where: {
        email: data.email,
      },
    });

    if (emailExiste) {
      throw new ConflictException('Esse e-mail já existe na base de dados');
    }

    return emailExiste;
  }
}
