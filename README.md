## Description

This is a API Rest project with services related to manage a product store. 

## API Documentation:
You can check the documentation of the project with the route "/api-docs", but also you can use the next url to see it (will take some minutes to charge):
- https://nest-nerdery-challenge.onrender.com/api-docs

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