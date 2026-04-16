import { AnalyticsModule } from './modules/analytics/analytics.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { DatabaseModule } from './plugins/database/database.module';
import { SharedModule } from './shared/shared.module';
import * as ConfigEnv from '@nestjs/config';
import { KeycloakSyncInterceptor } from './common/interceptors';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect';

@Module({
  imports: [
    ConfigEnv.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    KeycloakConnectModule.registerAsync({
      useFactory: (config: ConfigEnv.ConfigService) => ({
        authServerUrl: config.get<string>('KEYCLOAK_URL'),
        realm: config.get<string>('KEYCLOAK_REALM'),
        clientId: config.get<string>('KEYCLOAK_CLIENT_ID'),
        secret: '', // client publico,
        bearerOnly: true, //API só valida o token, não faz login
        tokenValidation: TokenValidation.OFFLINE,
      }),
      inject: [ConfigEnv.ConfigService],
    }),
    UsuariosModule,
    AnalyticsModule,
    DatabaseModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, //valida token Bearer globalemnte
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard, //controla acesso por resource
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard, //controle acesso por role
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: KeycloakSyncInterceptor, //migration lazy - verifica se o usuario já tem registro no keycloak, caso nao tenha ele cria
    },
  ],
})
export class AppModule {}
