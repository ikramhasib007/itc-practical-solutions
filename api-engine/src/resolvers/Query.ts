import { GraphQLError } from 'graphql'
import { Prisma, TransactionStatus, TransactionType } from '@prisma/client'
import { PrismaSelect } from '@paljs/plugins'
import Context from '../context'
import { Download, QueryResolvers, Transaction } from '../generated/graphql'

const Query: QueryResolvers<Context> = {
  async transaction(parent, args, { prisma }, info) {
    try {
      const select = new PrismaSelect(info!).value
      return (await prisma.transaction.findUniqueOrThrow({
        where: {
          id: args.id,
        },
        ...select,
      })) as unknown as Transaction
    } catch (error: any) {
      throw new GraphQLError(error)
    }
  },

  async transactionList(parent, args, { prisma }, info) {
    try {
      const select = new PrismaSelect(info!).value
      const opArgs: Prisma.TransactionFindManyArgs = {
        take: args.take ? args.take! + 2 : 5 + 2,
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          ...select.select.transactions.select,
        },
      }
      if (typeof args.skip !== 'undefined') {
        opArgs.skip = args.skip!
      }
      if (typeof args.cursor === 'string') {
        opArgs.cursor = {
          id: args.cursor,
        }
      }
      if (args.type) {
        opArgs.where = {
          AND: [
            {
              ...opArgs.where,
            },
            {
              OR: [
                {
                  type: { equals: args.type as TransactionType },
                },
              ],
            },
          ],
        }
      }
      if (args.status) {
        opArgs.where = {
          AND: [
            {
              ...opArgs.where,
            },
            {
              OR: [
                {
                  status: { equals: args.status as TransactionStatus },
                },
              ],
            },
          ],
        }
      }
      if (args.startDate !== undefined && args.endDate !== undefined) {
        opArgs.where = {
          AND: [
            {
              ...opArgs.where,
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

      const findTransactions = prisma.transaction.findMany(opArgs)
      const findCount = prisma.transaction.count({
        where: {
          ...opArgs.where,
        },
      })
      const [transactionsRes, count] = await prisma.$transaction([
        findTransactions,
        findCount,
      ])

      const transactions = transactionsRes as unknown as Transaction[]

      const listData = {
        count,
        hasNextPage: opArgs.cursor
          ? transactions.length === opArgs.take
          : transactions.length > (opArgs.take as number) - 2,
        transactions: opArgs.cursor
          ? transactions.length === opArgs.take
            ? transactions.slice(1, -1)
            : transactions.slice(1)
          : transactions.length === opArgs.take
            ? transactions.slice(0, -2)
            : transactions.length === (opArgs.take as number) - 1
              ? transactions.slice(0, -1)
              : transactions,
      }
      return listData
    } catch (error: any) {
      throw new GraphQLError(error)
    }
  },
  async download(parent, args, { prisma }, info) {
    try {
      const select = new PrismaSelect(info!).value
      return (await prisma.download.findUniqueOrThrow({
        where: {
          id: args.id,
        },
        ...select,
      })) as unknown as Download
    } catch (error: any) {
      throw new GraphQLError(error)
    }
  },

  async downloadList(parent, args, { prisma }, info) {
    try {
      const select = new PrismaSelect(info!).value
      const opArgs: Prisma.DownloadFindManyArgs = {
        take: args.take ? args.take! + 2 : 5 + 2,
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          ...select.select.downloads.select,
        },
      }
      if (typeof args.skip !== 'undefined') {
        opArgs.skip = args.skip!
      }
      if (typeof args.cursor === 'string') {
        opArgs.cursor = {
          id: args.cursor,
        }
      }

      const findDownloads = prisma.download.findMany(opArgs)
      const findCount = prisma.download.count({
        where: {
          ...opArgs.where,
        },
      })
      const [downloadsRes, count] = await prisma.$transaction([
        findDownloads,
        findCount,
      ])

      const downloads = downloadsRes as unknown as Download[]

      const listData = {
        count,
        hasNextPage: opArgs.cursor
          ? downloads.length === opArgs.take
          : downloads.length > (opArgs.take as number) - 2,
        downloads: opArgs.cursor
          ? downloads.length === opArgs.take
            ? downloads.slice(1, -1)
            : downloads.slice(1)
          : downloads.length === opArgs.take
            ? downloads.slice(0, -2)
            : downloads.length === (opArgs.take as number) - 1
              ? downloads.slice(0, -1)
              : downloads,
      }
      return listData
    } catch (error: any) {
      throw new GraphQLError(error)
    }
  },
}

export default Query
