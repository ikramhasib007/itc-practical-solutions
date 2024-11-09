import Query from './Query'
import Mutation from './Mutation'
import { Resolvers } from '../generated/graphql'
import Context from '../context'

export const resolvers: Resolvers<Context> = {
  Query,
  Mutation,
}
