// scripts/migrate-users-to-keycloak.ts

import 'dotenv/config';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

const kcAdmin = new KcAdminClient({
  baseUrl: process.env.KEYCLOAK_URL,
  realmName: 'master', // realm admin
});

async function migrate() {
  // 1. Autentica como admin no Keycloak
  await kcAdmin.auth({
    username: process.env.KEYCLOAK_ADMIN_USER,
    password: process.env.KEYCLOAK_ADMIN_PASS,
    grantType: 'password',
    clientId: 'admin-cli',
  });

  // 2. Busca todos os usuários do banco que ainda não têm sub
  const users = await prisma.usuario.findMany({ where: { sub: null } });

  for (const user of users) {
    // 3. Cria o usuário no Keycloak
    const response = await kcAdmin.users.create({
      realm: process.env.KEYCLOAK_REALM,
      username: user.login,
      email: user.email,
      firstName: user.nome.split(' ')[0],
      lastName: user.nome.split(' ').slice(1).join(' '),
      enabled: user.situacao === 'ATIVO',
      emailVerified: true,
      credentials: [
        {
          type: 'password',
          value: 'senha-temporaria-123', // força trocar no primeiro login
          temporary: true,
        },
      ],
    });

    // 4. Pega o sub gerado e atualiza o banco
    const sub = response.id;

    await prisma.usuario.update({ where: { id: user.id }, data: { sub } });

    console.log(`✅ Migrado: ${user.email} → sub: ${sub}`);
  }
}

migrate().finally(() => prisma.$disconnect());
