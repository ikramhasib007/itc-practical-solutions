import { PrismaClient } from '@prisma/client'
import { YogaInitialContext } from 'graphql-yoga'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { pubSub } from './pubsub'

export default interface Context extends YogaInitialContext {
  prisma: PrismaClient
  pubSub: typeof pubSub
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
  pubSub: DeepMockProxy<typeof pubSub>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
    pubSub: mockDeep<typeof pubSub>(),
  }
}
