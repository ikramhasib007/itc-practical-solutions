import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'
import fs from 'node:fs/promises'
import * as mkdirp from 'mkdirp'
import nodePath from 'node:path'
import {
  FileType,
  Prisma,
  TransactionStatus,
  TransactionType,
} from '@prisma/client'
import { Parser } from 'json2csv'
import { setTimeout as setTimeout$ } from 'node:timers/promises'
import { MutationResolvers, AuthPayload, User } from '../generated/graphql'
import Context from '../context'
import generateToken from '../utils/generateToken'
import getUserId from '../utils/getUserId'
import hashPassword from '../utils/hashPassword'

const Mutation: MutationResolvers<Context> = {
  async createUser(parent, args, { prisma }, info) {
    try {
      const { firstName, lastName, email, password } = args.data
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

  async generateCSV(parent, args, { prisma }, info) {
    try {
      const { startDate, endDate, type, status } = args

      // Query operation args for transaction
      const transactionOpArgs: Prisma.TransactionFindManyArgs = {
        where: { isDeleted: false },
      }
      if (args.startDate !== undefined && args.endDate !== undefined) {
        transactionOpArgs.where = {
          AND: [
            {
              ...transactionOpArgs.where,
            },
            {
              createdAt: {
                lte: args.endDate!,
                gte: args.startDate!,
              },
            },
          ],
        }
      }

      // Download history create payload
      const data: Prisma.DownloadCreateInput = {
        requestTime: new Date().toISOString(),
      }
      if (startDate) data.startDate = startDate
      if (endDate) data.endDate = endDate
      if (type) {
        data.transactionType = type
        transactionOpArgs.where = {
          AND: [
            {
              ...transactionOpArgs.where,
            },
            {
              type: { equals: type as TransactionType },
            },
          ],
        }
      }
      if (status) {
        data.transactionStatus = status
        transactionOpArgs.where = {
          AND: [
            {
              ...transactionOpArgs.where,
            },
            {
              status: { equals: status as TransactionStatus },
            },
          ],
        }
      }

      // Creating download history
      const download = await prisma.download.create({
        data,
      })

      // Waiting time
      await setTimeout$(+process.env.WAITING_TIME_FRAME! || 10000)

      const transactionsList =
        await prisma.transaction.findMany(transactionOpArgs)

      const fields = [
        {
          label: 'Transaction Type',
          value: 'type',
        },
        {
          label: 'Transaction Status',
          value: 'status',
        },
        {
          label: 'Amount',
          value: 'amount',
        },
        {
          label: 'Created At',
          value: 'createdAt',
        },
      ]
      const json2csvParser = new Parser({ fields })
      const csv = json2csvParser.parse(transactionsList)

      const uploadDir = './downloads'
      const filename = `transactions-${new Date().getTime()}.csv`
      const filePath = `${uploadDir}/${filename}`
      setTimeout(async () => {
        try {
          // Ensures that the downloads directory exists
          mkdirp.mkdirpSync(uploadDir)
          await fs.writeFile(nodePath.join(process.cwd(), filePath), csv)

          // Updating the download histroy
          await prisma.download.update({
            where: {
              id: download.id,
            },
            data: {
              completionTime: new Date().toISOString(),
              path: filePath.replace('./', ''),
              filename,
              type: FileType.CSV,
            },
          })
        } catch (err: any) {
          throw new GraphQLError(err)
        }
      }, 0)

      return download !== null
    } catch (error: any) {
      throw new GraphQLError(error)
    }
  },
}

export default Mutation
