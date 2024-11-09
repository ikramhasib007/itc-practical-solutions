import { PrismaClient } from '@prisma/client'
import { YogaInitialContext } from 'graphql-yoga'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

export default interface Context extends YogaInitialContext {
  prisma: PrismaClient
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  }
}
