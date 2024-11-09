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

### postgresql connection url details:

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

Thank you so much for the project. I'm looking forward to hear from you.
