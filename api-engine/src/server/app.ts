import '../utils/date.extensions'
import express from 'express'
import helmet from 'helmet'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createYoga, maskError, useExtendContext } from 'graphql-yoga'
import { useGraphQLSSE } from '@graphql-yoga/plugin-graphql-sse'
import { createFetch } from '@whatwg-node/fetch'
import { buildSubgraphSchema } from '@apollo/subgraph'
import { parse } from 'graphql'
import { resolvers } from '../resolvers'
import prisma from '../prisma'
import { pubSub } from '../pubsub'

const typeDefs = parse(readFileSync('./src/schema.graphql', 'utf8'))

export const schema = buildSubgraphSchema([{ typeDefs, resolvers }])

const corsOrigin = process.env.CORS
if (!corsOrigin) throw Error('Cors origin is not defined!')

const yoga = createYoga({
  cors: {
    origin: corsOrigin.split(','),
    credentials: true,
    allowedHeaders: [
      'X-Custom-Header',
      'X-Authorization',
      'Authorization',
      'Content-Type',
    ],
    methods: ['POST'],
  },
  schema,
  plugins: [useExtendContext(() => ({ pubSub, prisma })), useGraphQLSSE()],
  graphiql: process.env.NODE_ENV !== 'production',
  healthCheckEndpoint: '/live',
  fetchAPI: createFetch({
    formDataLimits: {
      fileSize: 1048576, // unit bytes // size 1M
      files: 4, // Maximum allowed number of files
      fieldSize: 4194304, // unit bytes // 1M x 4 (maxFiles)
      headerSize: 4194304, // unit bytes // 1M x 4 (maxFiles)
    },
  }),
  maskedErrors: {
    maskError(error, message, isDev) {
      // @ts-expect-error -> tba
      if (error?.extensions?.code === 'DOWNSTREAM_SERVICE_ERROR') {
        return {
          error: process.env.NODE_ENV !== 'production' ? error : undefined,
          name: 'error',
          message: 'Something went wrong!',
        }
      }

      return maskError(error, message, isDev)
    },
  },
})

export function buildApp(app: ReturnType<typeof express>) {
  const router = express.Router()

  // Add specific CSP for GraphiQL by using an express router
  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'style-src': ["'self'", 'unpkg.com'],
          'script-src': ["'self'", 'unpkg.com', "'unsafe-inline'"],
          'img-src': ["'self'", 'raw.githubusercontent.com'],
        },
      },
    })
  )
  router.use(yoga)

  // First register the router, to avoid Global CSP configuration to override the specific one
  app.use(yoga.graphqlEndpoint, router)

  // Static path defined to serve files
  const pathDir = path.join(__dirname, `../../downloads`)
  app.use('/downloads', express.static(pathDir))

  // Global CSP configuration
  app.use(helmet())

  return yoga.graphqlEndpoint
}
