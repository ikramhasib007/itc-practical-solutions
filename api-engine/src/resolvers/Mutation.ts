import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'
import { Prisma } from '@prisma/client'
import { MutationResolvers, AuthPayload, User } from '../generated/graphql'
import Context from '../context'
import generateToken from '../utils/generateToken'
import getUserId from '../utils/getUserId'
import hashPassword from '../utils/hashPassword'

const Mutation: MutationResolvers<Context> = {
  async createUser(parent, args, { prisma }, info) {
    const { firstName, lastName, email, password } = args.data
    try {
      const data: Prisma.UserCreateInput = {
        firstName,
        lastName,
        email,
      }
      if (password) {
        data.password = await hashPassword(password)
      }

      const user = await prisma.user.create({
        data,
      })

      return {
        user,
        token: generateToken(user.id),
      } as unknown as AuthPayload
    } catch (error: any) {
      throw new GraphQLError(error)
    }
  },

  async login(parent, args, { prisma }, info) {
    try {
      const { email, password } = args.data
      const query: Prisma.UserFindFirstOrThrowArgs = {
        where: {
          email,
        },
      }
      const user = await prisma.user.findFirstOrThrow(query)

      if (password) {
        if (!user.password)
          throw new GraphQLError('User exist with different sign in method')
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw new GraphQLError('Unable to login')
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
        },
      })

      return {
        user,
        token: generateToken(user.id),
      } as unknown as AuthPayload
    } catch (error: any) {
      throw new GraphQLError(error)
    }
  },

  async updateUser(parent, args, { prisma, request }, info) {
    try {
      const userId = getUserId(request)
      if (typeof args.data.password === 'string') {
        args.data.password = await hashPassword(args.data.password)
      }
      const { firstName, lastName, email, password } = args.data
      const data: Prisma.UserUpdateInput = {}
      if (firstName) data.firstName = firstName
      if (lastName) data.lastName = lastName
      if (email) data.email = email
      if (password) data.password = password
      const user = await prisma.user.update({
        where: {
          id: userId!,
        },
        data,
      })

      return user as unknown as User
    } catch (error: any) {
      throw new GraphQLError(error)
    }
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    try {
      const userId = getUserId(request)
      await prisma.user.findFirstOrThrow({
        where: { id: userId! },
      })

      const deleteUserOps = prisma.user.update({
        where: { id: userId! },
        data: { isDeleted: true },
      })

      const [userData] = await prisma.$transaction([deleteUserOps])
      return userData as unknown as User
    } catch (error: any) {
      throw new GraphQLError(error)
    }
  },
}

export default Mutation
