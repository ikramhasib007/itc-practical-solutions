import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'

// const header = request.request ? request.request.headers.authorization : request.connection.context.headers?.Authorization ? request.connection.context.headers.Authorization : request.connection.context.Authorization

const getUserId = (request: any, requireAuth = true) => {
  const header = request?.headers.get('authorization')

  if (header) {
    const token = header.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '')
    // @ts-expect-error -> The user ID will exist in the header
    return decoded.userId as string
  }
  if (requireAuth) throw new GraphQLError('Authentication required')

  return null
}

export default getUserId
