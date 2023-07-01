## Description

This is a GraphQL API project with services related to manage a product store. 

## Apollo Sandbox:
You can check the documentation or the project schema checking the route "/graphql".

## Installation

```bash
$ npm install
```

## Using Docker Compose to start PostgreSQL database

```bash
# start database container
$ npm run db:up

# stop and delete database container
$ npm run db:rm

# restart database container
$ npm run db:restart
```

## Environment variables
You need to define the env variables in a .env file to make the project work normally. Here is an example:
```
DATABASE_URL="postgresql://admin:password@localhost:5432/nest-challenge-db?schema=public"
DOMAIN_NAME="http://localhost:3000"

JWT_SECRET_KEY="secret"
JWT_EXPIRATION_TIME="30m"
```

## Don't forget to run migrations with prisma

```bash
# Run migrations
$ npm run prisma:deploy
```

## Running the app

```bash
$ npm run start:dev
```

## Running tests

```bash
# Run tests
$ npm run test
```

## Running test coverage

```bash
$ npm run test:cov
```

## Required header variables
There's two headers which need to be set to make some GraphQL operations work. The first is needed when a operation can upload an image and the other is for authenticate and validate user access:
> Apollo-Require-Preflight = True
 
> Authorization = Bearer <jwt_token>