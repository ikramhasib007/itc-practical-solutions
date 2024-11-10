# ITC practical exam solutions

# Ikram Ud Daula

## Instructions

> Create `prod.env` file at `api-engine/config/` and copy and paste the env details

```
HTTP_PORT=4001
DATABASE_URL="postgresql://postgres:1234@localhost:5432/itc_solutions?schema=public"
JWT_SECRET=boPhVS3jytJKDQGLAFNvEuNZtTFErMiw
CORS=http://localhost:3000
# milliseconds
WAITING_TIME_FRAME=10000
```

- postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA

> Create `.env.production.local` file at `client/` and copy and paste the env details

```
BASE_URL=http://localhost:3000
API_URL=http://localhost:4001/graphql
SUBSCRIPTION_URL=http://localhost:4001/graphql
```

And then run from project root directory these 3 commands

1.

```
cd api-engine && pnpm install && pnpm migrate:deploy && pnpm build:release && pnpm start:prod
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

- The location of the database seed file `api-engine/prisma/seed.ts`
- I used [pnpm](https://pnpm.io/) instead of `npm`
- Make sure you have installed PostgreSQL in your machine at `5432` port
- API server are developed using `Node.js` and `GraphQL`
- [yoga-server](https://the-guild.dev/graphql/yoga-server/docs)
- [prisma](https://www.prisma.io/docs/getting-started) as ORM
- Client are developed by `Next.js` with [Apollo Client](https://www.apollographql.com/docs/react)
- API details: `cd api-engine && pnpm dev` and go to the url at `http://localhost:4001/graphql` for graphical interface

Thank you so much for the project. I'm looking forward to hear from you.
