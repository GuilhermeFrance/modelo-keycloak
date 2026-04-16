# PMVCloak - Keycloak com PostgreSQL

Setup Docker do Keycloak conectado ao PostgreSQL.

## Serviços

- **Keycloak**: Porta `5433` (http://localhost:5433)
- **PostgreSQL**: Porta `5432` (banco: `pmvcloak`)

## Como usar

### Iniciar os serviços

```bash
docker-compose up -d
```

### Verificar status

```bash
docker-compose ps
```

### Acessar logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas Keycloak
docker-compose logs -f keycloak

# Apenas PostgreSQL
docker-compose logs -f postgres
```

### Parar os serviços

```bash
docker-compose down
```

### Parar e remover volumes (dados serão perdidos)

```bash
docker-compose down -v
```

## Acesso ao Keycloak

- **URL**: http://localhost:5433
- **Usuário admin**: `admin`
- **Senha admin**: `admin`

## Credenciais do PostgreSQL

- **Host**: `localhost` (ou `postgres` dentro da rede Docker)
- **Porta**: `5432`
- **Database**: `pmvcloak`
- **Usuário**: `keycloak`
- **Senha**: `keycloak_password`

## Notas

- O Keycloak está rodando em modo de desenvolvimento (`start-dev`)
- Os dados do PostgreSQL são persistidos em um volume Docker
- Para produção, configure senhas fortes e HTTPS
