# ITC practical exam solutions

# Ikram Ud Daula

## Instructions

> Create `prod.env` file at `api-engine/config/` and copy and paste the env details

```
HTTP_PORT=4001
DATABASE_URL="postgresql://postgres:1234@localhost:5432/itc_solutions?schema=public"
JWT_SECRET=boPhVS3jytJKDQGLAFNvEuNZtTFErMiw
CORS=http://localhost:3000
```

- postgresql://[USERNAME]:[PASSWORD]@localhost:5432/[DATABASE_NAME]?schema=public

> Create `.env.production.local` file at `client/` and copy and paste the env details

```
BASE_URL=http://localhost:3000
API_URL=http://localhost:4001/graphql
SUBSCRIPTION_URL=http://localhost:4001/graphql
```

And then run from project root directory these 3 commands

1.

```
cd api-engine && pnpm install && pnpm migrate && pnpm dev
```

> Wait for the message `🚀 Server ready at http://localhost:4001/graphql`. Open new terminal window and navigate root of the project

2.

```
cd client && pnpm install
```

> Close all the terminals and open new terminal window (make sure you are in root of the project) and run

3.

```
pnpm install && pnpm build && pnpm start
```

Then go the url at `http://localhost:3000` :)

## More details below

## API Engine

- Make sure you have installed PostgreSQL in your machine at `5432` port

- Before starting API Engine, you need to create an env file at `api-engine/config/` location named `dev.env` for development server, `test.env` for test. `prod.env` for production. sample file are given in desired location.

- I used [pnpm](https://pnpm.io/) instead of `npm`

```
cd api-engine && pnpm install
pnpm migrate
```

Sample

- `api-engine/config/dev.env` or `api-engine/config/prod.env` for production

```
HTTP_PORT=4001
DATABASE_URL="postgresql://postgres:1234@localhost:5432/itc_solutions?schema=public"
JWT_SECRET=boPhVS3jytJKDQGLAFNvEuNZtTFErMiw
CORS=http://localhost:3000
```

- `api-engine/config/test.env`

```
HTTP_PORT=5001
DATABASE_URL="postgresql://postgres:1234@localhost:5432/itc_solutions?schema=test"
JWT_SECRET=d7M4Ib6A1JHcLJvzB3s251vlSMYQ3L5W
CORS=http://localhost:3000
```

API development server start:

```
pnpm dev
```

- I have write few test cases for API server
- API server are developed using `Node.js` and `GraphQL`
- [yoga-server](https://the-guild.dev/graphql/yoga-server/docs)
- [prisma](https://www.prisma.io/docs/getting-started) as ORM

Tests API server

```
pnpm migrate:test
pnpm test
```

Then go the url at `http://localhost:4001/graphql`

## Client

- Client site development by `Next.js` with [Apollo Client](https://www.apollographql.com/docs/react)

- Before serving the Client site make sure you have created `client/.env.development.local` for development and `client/.env.production.local` for production release.

- Sample `client/.env.development.local`

```
BASE_URL=http://localhost:3000
API_URL=http://localhost:4001/graphql
SUBSCRIPTION_URL=http://localhost:4001/graphql
```

- Sample `client/.env.production.local`

```
BASE_URL=http://localhost:3000
API_URL=http://localhost:4001/graphql
SUBSCRIPTION_URL=http://localhost:4001/graphql
```

- Start the development server for Client

```
cd client && pnpm install
pnpm dev
```

- Production build

```
pnpm build
```

- Production server start

```
pnpm start
```

Then go the url at `http://localhost:3000`

## Shorthand

Shorthand commands for once: navigate to the root directory in your terminal and then copy paste below command, then press enter.

- Development environment

```
cd api-engine && pnpm install && pnpm migrate && cd ../client && pnpm install && cd .. && pnpm install && pnpm dev
```

- Production build

```
cd api-engine && pnpm install && pnpm migrate && cd ../client && pnpm install && cd .. && pnpm install && pnpm build && pnpm start
```

Thank you so much for the project. I'm looking forward to hear from you.
