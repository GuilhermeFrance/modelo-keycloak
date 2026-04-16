import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UsuariosService } from 'src/modules/usuarios/usuarios.service';

@Injectable()
export class KeycloakSyncInterceptor implements NestInterceptor {
  constructor(private readonly usuariosService: UsuariosService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (user?.sub) {
      const localUser = await this.usuariosService.buscaOuCriaPorSub(user);
      if (localUser) {
        user.id = localUser.id; // LoggingInterceptor usa user.id como FK no RequestLog
      }
    }

    return next.handle();
  }
}
