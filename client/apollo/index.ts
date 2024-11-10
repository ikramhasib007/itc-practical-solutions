import 'cross-fetch/polyfill'
import type { NextConfig } from 'next'
import getConfig from 'next/config'
import {
  ApolloClient,
  split,
  from,
} from '@apollo/client'
import { YogaLink } from '@graphql-yoga/apollo-link'
import { onError } from '@apollo/client/link/error'
import { getMainDefinition } from '@apollo/client/utilities'
import { cache } from '@/stores/cache'
import { sseLink } from './SSELink'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'

if (process.env.NODE_ENV !== 'production') {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}
const { publicRuntimeConfig }: NextConfig = getConfig()

const httpLink = (token?: string) =>
  new YogaLink({
    endpoint: publicRuntimeConfig!.API_PATH,
    fetch: (uri, options) => {
      // @ts-expect-error -> tba
      options.headers.Authorization = token ? `Bearer ${token}` : ''
      return fetch(uri, options)
    },
  })

const splitLink = (token?: string) =>
  typeof window !== 'undefined'
    ? split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      sseLink(token),
      httpLink(token)
    )
    : httpLink(token)

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations, undefined, 2)}, Path: ${JSON.stringify(path, undefined, 2)}`
      )
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const getClient = (token?: string) => {
  return new ApolloClient({
    cache,
    link: from([errorLink, splitLink(token)]),
    connectToDevTools: process.env.NODE_ENV !== 'production',
    name: `itc-practical-solutions-client`,
    version: '1.0.0',
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    }
  })
}

export default getClient
