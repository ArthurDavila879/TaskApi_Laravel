# TaskApi_Laravel

API REST de gerenciamento de tarefas construída em Laravel, com autenticação via Sanctum, controle de permissões por token (abilities) e roles de usuário (admin/user).

## Funcionalidades

- **Autenticação** com Laravel Sanctum (login/logout via token)
- **Controle de acesso granular** por abilities de token (`tasks:read`, `tasks:write`, `tasks:delete`, `users:read`, `users:write`, `users:delete`)
- **Roles de usuário** (`admin` / `user`), com middleware dedicado para rotas administrativas
- **Autorização por policy** — cada usuário só pode ver/editar/excluir seus próprios dados e tarefas (exceto admins)
- **CRUD de tarefas** com status (`pending`, `completed`, `canceled`)
- **Consulta de CEP** via API externa (ViaCEP), associada ao endereço do usuário
- **Notificação por e-mail** ao criar uma nova tarefa
- **Documentação de API automática** via [Scramble](https://scramble.dedoc.co/) (OpenAPI)
- **Front-end em React** (pasta `task-frontend/`) consumindo a API
- **Ambiente Dockerizado** (Nginx + PHP + MySQL + Redis + phpMyAdmin)

## Stack

- PHP 8.2 / Laravel 12
- Laravel Sanctum ^4.3
- MySQL 8.0
- Redis
- Docker / Docker Compose
- React + Vite (front-end)

## Endpoints principais

| Método | Rota | Proteção | Descrição |
|---|---|---|---|
| POST | `/login` | — | Login, retorna token |
| POST | `/users` | — | Cadastro de usuário |
| POST | `/logout` | `auth:sanctum` | Logout |
| GET | `/me` | `auth:sanctum` | Dados do usuário autenticado |
| GET | `/users/endereco` | `auth:sanctum` | Endereço via CEP do usuário |
| GET | `/users/stats` | `Isadmin` | Estatísticas gerais (somente admin) |
| GET | `/users` | `Isadmin` | Lista todos os usuários (somente admin) |
| GET | `/users/{id}` | `ability:users:read` | Detalhe de um usuário |
| PUT | `/users/{id}` | `ability:users:write` | Atualiza usuário |
| DELETE | `/users/{id}` | `ability:users:delete` | Remove usuário |
| GET | `/tasks` | `ability:tasks:read` | Lista tarefas do usuário autenticado |
| GET | `/tasks/{id}` | `ability:tasks:read` | Detalhe de uma tarefa |
| POST | `/tasks` | `ability:tasks:write` | Cria tarefa |
| PUT | `/tasks/{id}` | `ability:tasks:write` | Atualiza tarefa |
| DELETE | `/tasks/{id}` | `ability:tasks:delete` | Remove tarefa |

## Instalação

### Via Docker (recomendado)

```bash
git clone https://github.com/ArthurDavila879/TaskApi_Laravel.git
cd TaskApi_Laravel
cp .env.example .env
docker compose up -d --build
docker compose exec app php artisan migrate
```

> Na primeira subida, o container instala as dependências (`composer install`) e gera a `APP_KEY` automaticamente via `docker/entrypoint.sh` — não é preciso rodar isso manualmente. O `vendor/` fica em um volume nomeado (`vendor:/var/www/vendor`) para não ser sobrescrito pelo bind mount do código e para não precisar reinstalar a cada `up`.

A API ficará disponível em `http://localhost:8000` e o phpMyAdmin em `http://localhost:8080`.

### Manual

```bash
git clone https://github.com/ArthurDavila879/TaskApi_Laravel.git
cd TaskApi_Laravel
composer install
cp .env.example .env
php artisan key:generate
# configure DB_* no .env
php artisan migrate
php artisan serve
```

## Front-end

O front-end React está em `task-frontend/`:

```bash
cd task-frontend
npm install
npm run dev
```

## Testes

```bash
php artisan test
```

## Documentação da API

Com o servidor rodando, a documentação OpenAPI gerada pelo Scramble fica disponível em `/docs/api`.

## Licença

MIT
