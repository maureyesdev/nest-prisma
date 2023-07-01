# nest-prisma-aws-poc

## Description

## Pipeline

rhel-openssl-1.0.x is the binary that prisma will used in order to run on lambdas (centos os based if not mistaken)

```bash
PRISMA_CLI_BINARY_TARGETS=native,rhel-openssl-1.0.x pnpm install
```

Prisma client generation based on the schema. 

```bash
pnpm prisma generate
```

Build the project using webpack

```bash
pnpm build:webpack
```

deploy to aws

```bash
pnpm serverless deploy
```

The following command will need to be included as a curl command in the pipeline in order to hit the lambda function to run prisma migrations. This would be a curl command in the pipeline or can be included in the bootstrap script. This will kind of mimic the behavior of typeorm for `runMigrations:true`

```bash
curl --request POST \
  --url http://localhost:3000/gql/users \
  --header 'Content-Type: application/json' \
  --data '{"query":"mutation run_migration {\n  runMigrations\n}"}'
```

___

## Create migrations. 

```bash
pnpm prisma migrate dev --name [migration-name]
```

Apply the migration into the db (This is the command that is used in order to apply the migration to the db in prod)

```bash
pnpm prisma migrate deploy
```

___


**It is worth to mention that prisma includes bunch of unnecessary files that can be excluded out of the lambda. Furthermore, we can create separate lambda layer just for prisma in order to be sharable across all of the other lambdas in case of microservices. That way the size of the lambda does not include all of the prisma engine generated.**