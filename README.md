# Rest API

Minimal REST API example built with Express, TypeScript, Mongoose and JWT-based auth.

## Features

- User registration and login (access + refresh tokens)
- Role-based access (regular vs admin)
- Validation with Joi
- Tests with Jest + SuperTest

## Table of contents

- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API endpoints](#api-endpoints)
- [Testing](#testing)
- [Notes & recommendations](#notes--recommendations)

## Requirements

- Node.js 18+ (or matching your environment)
- pnpm (recommended) or npm
- MongoDB for development and testing

## Quick start

1. Install dependencies

```powershell
pnpm install
```

2. Create environment variables (see next section) or copy `.env.example` to `.env`.

3. Run the app in development

```powershell
pnpm dev
```

The project uses `tsx`/`ts-node` and `nodemon` for development in `package.json`.

## Environment variables

Create a `.env` file with at least the following variables:

- MONGO_URI — your development MongoDB connection URI
- MONGO_URI_TEST — MongoDB connection for tests
- PORT — optional server port

## Scripts

- pnpm dev — run in development with hot reload
- pnpm build — compile TypeScript
- pnpm test — run Jest tests

## API endpoints

Base path: `/api`

Auth
- POST `/api/auth/register` — register user. Body: { name, email, password }
- POST `/api/auth/login` — login. Body: { email, password } -> returns { accessToken, refreshToken }
- POST `/api/auth/refresh` — refresh access token. Body: { refreshToken }

Users
- GET `/api/users` — list users (requires authentication)
- GET `/api/users/:id` — get user by id (requires authentication)
- POST `/api/users` — create user (requires admin role)
- PUT `/api/users/:id` — update user (requires admin role)
- DELETE `/api/users/:id` — delete user (requires admin role)

Note: the app expects JWT payloads to contain the minimal fields `{ role, user_id, email }`.

## Testing

The project uses Jest + ts-jest and SuperTest for API tests.

Set `MONGO_URI_TEST` to a test DB and run:

```powershell
pnpm test
```

Tests create and drop the `users` collection during runs so keep the test DB isolated.
