# NestJS API

## Getting started

- [Template Guidelines](./docs/template/01_NestJS_Template.md)

## Setup environment

```bash
# Use the version of Node.js specified in the .nvmrc file
nvm use

# Install the project dependencies
yarn

# Generate local config template
yarn ecs-deploy bootstrap --stage local

# Start the Docker containers
yarn docker:up

# Generate Prisma client and run Prisma migrations
yarn prisma:generate && yarn prisma:migrate
```

## Running the app

```bash
# Start the application in development mode
yarn start

# Start the application in watch mode for development
yarn start:dev

# Start the application in production mode
yarn start:prod
```

## Test

```bash
# Run unit tests
yarn test

# Run end-to-end tests
yarn test:e2e

# Generate test coverage report
yarn test:cov
```
