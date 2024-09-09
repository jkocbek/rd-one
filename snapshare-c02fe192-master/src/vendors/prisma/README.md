# Prisma ORM example

This example brings a basic implementation of [Prisma ORM](https://www.prisma.io/) to a NestJS project. Prisma is a new kind of ORM which greatly reduces the development time and improve DX when dealing with the data persistance layer. Here is a good [learning resource](https://www.prisma.io/docs/concepts/overview/prisma-in-your-stack/is-prisma-an-orm) to get familiar with the basic concepts and to find out what are the key distinctions with other ORMs (i.e TypeORM).

## Installation

1. `yarn generate prisma-example`

2. Add to `package.json`

```json
...
"scripts": {
  ...
  "prisma:cli": "bash ./src/vendors/prisma/scripts/prisma-cli-wrapper.sh",
  "prisma:introspect": "yarn prisma:cli db pull",
},
"prisma": {
  "schema": "src/database/prisma/schema.prisma"
}
...
```

3. Add to `nest-cli.json`

```json
...
"compilerOptions": {
  "deleteOutDir": true,
  "assets": [
    {
      "include": "vendors/prisma/client/**/*"
    }
  ],
  "watchAssets": true
}
...
```

4. Add to `.eslintrc.js`

```js
...,
ignorePatterns: [
  ...,
  'src/vendors/prisma/client/**/*',
],
...
```

5. Generate a typed db client from `schema.prisma`

```bash
$ yarn unplug prisma @prisma/client
$ yarn pnpify prisma generate
```

6. Import modules to the `app.module.ts`

```Typescript
...
import { PrismaModule } from '~vendors/prisma/prisma.module';
import { UserPrismaExampleModule } from '~modules/user-prisma-example/user-prisma-example.module';
...

@Module({
  imports: [
    ...
    PrismaModule,
    UserPrismaExampleModule,
  ],
  ...
})
export class AppModule {}

```

### Configuration

Add this configuration section to the appropriate 'stage' in `config.yml`:

```yaml
  ...
  prisma:
    databaseUrl: 'postgresql://admin:admin@localhost:5432/db?schema=public'
    log: ['query', 'info', 'warn', 'error']
  ...
```

### Prisma CLI

There is a npm script `prisma:cli` that provides a wrapper around `prisma cli` which prepares the environment required for executing prisma cli commands.

Usage:

```bash
# Creating and executing a migration. By default the environment will populated with the prisma envs from `local` stage found in config.yml.
yarn prisma:cli 'migrate dev'

# Only creating a migration
yarn prisma:cli 'migrate dev --create-only'

# If you want to change the stage, you can do this like this:
STAGE=test yarn prisma:cli 'migrate dev'
```

## Developing with Prisma

There are two approaches to how to model the development flow with Prisma:

1. **Using `schema.prisma` as db schema single source of truth**
   Here you'd make all the changes to the db schema by editing `schema.prisma` file and using Prisma's own DSL. You'll then apply the changes from `schema.prisma` to db schema by using [prisma migrate](https://www.prisma.io/migrate). This approach is present in this example.

2. **Using other db migration framework**
   With this approach you'd use your favourite db migration framework (i.e knex migration CLI) for changing the db schema and then run `prisma db pull` to update the `schema.prisma`. Manual changes to the `schema.prisma` are not allowed.

Both approaches have trade-offs as everything in our industry. However, it's good to be aware you're flexible with this decision which makes Prisma also a good drop-in replacement for the ORMs in the existing projects if that would be the case.
