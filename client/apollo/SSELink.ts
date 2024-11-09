import type { NextConfig } from 'next'
import getConfig from 'next/config'
import {
  ApolloLink,
  Operation,
  Observable,
  FetchResult,
} from '@apollo/client'
import { print } from 'graphql'
import { createClient, ClientOptions, Client } from 'graphql-sse'

const { publicRuntimeConfig }: NextConfig = getConfig()

class SSELink extends ApolloLink {
  private client: Client

  constructor(options: ClientOptions) {
    super()
    this.client = createClient(options)
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          // @ts-expect-error -> tba
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        }
      )
    })
  }
}

export const sseLink = (token?: string) =>
  new SSELink({
    url: publicRuntimeConfig!.SUBSCRIPTION_PATH,
    headers: () => {
      return {
        Authorization: token ? `Bearer ${token}` : '',
      }
    },
  })
