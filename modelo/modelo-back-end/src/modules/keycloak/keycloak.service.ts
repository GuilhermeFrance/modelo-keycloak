import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { InternalServerErrorException } from '@nestjs/common';

export class KeycloakAdminService {
  private kcAdminClient: KeycloakAdminClient;

  constructor() {
    this.kcAdminClient = new KeycloakAdminClient({
      baseUrl: process.env.KEYCLOAK_URL,
      realmName: 'master',
    });
  }

  async getClient(): Promise<KeycloakAdminClient> {
    try {
      await this.kcAdminClient.auth({
        username: process.env.KEYCLOAK_ADMIN_USER,
        password: process.env.KEYCLOAK_ADMIN_PASS,
        grantType: 'password',
        clientId: 'admin-cli',
      });
      return this.kcAdminClient;
    } catch (error) {
      console.error('Erro ao autenticar no Keycloak Admin: ', error);
      throw new InternalServerErrorException(
        'Falha na comunicação com o provedor',
      );
    }
  }
}
