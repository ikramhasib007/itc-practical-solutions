import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'

export const getRequestId = (request: any, requireAuth = true) => {
  const header = request?.headers.get('x-authorization')

  if (header) {
    try {
      const token = header.replace('Bearer ', '')
      const decoded = jwt.verify(
        token,
        process.env.SUBGRAPH_ACCESS_TOKEN_SECRET || ''
      )
      // @ts-expect-error -> The user ID will exist in the header
      return decoded.requestId as string
    } catch (error: any) {
      throw new GraphQLError('Unable to verify request')
    }
  }
  if (requireAuth) throw new GraphQLError('X-Authentication required')

  return null
}

export default getRequestId
