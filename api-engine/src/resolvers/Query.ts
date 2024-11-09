import { GraphQLError } from 'graphql'
import { Prisma, TransactionStatus, TransactionType } from '@prisma/client'
import { PrismaSelect } from '@paljs/plugins'
import Context from '../context'
import { Download, QueryResolvers, Transaction } from '../generated/graphql'

export function getMonthDates(startDate: string, endDate: string) {
  const date = new Date()
  const startDateObj = beginningOfMonth(date)
  const lastMonth = startDateObj.getMonth() - 1
  return {
    currentMonth: {
      startDate: () => startDateObj,
      endDate: () => endOfMonth(date),
    },
    lastMonth: {
      startDate: () => {
        const now = new Date()
        const newDate = new Date(now.getFullYear(), now.getMonth() - 1)
        return beginningOfMonth(newDate)
      },
      endDate: () => {
        const now = new Date()
        const newDate = new Date(now.getFullYear(), now.getMonth() - 1)
        return endOfMonth(newDate)
      },
    },
  }
}

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

/**
 * Returns a date set to the begining of the month
 *
 * @param {Date} myDate
 * @returns {Date}
 */
function beginningOfMonth(myDate: Date): Date {
  const date = new Date(myDate)
  date.setDate(1)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

/**
 * Returns a date set to the end of the month
 *
 * @param {Date} myDate
 * @returns {Date}
 */
function endOfMonth(myDate: Date): Date {
  const date = new Date(myDate)
  date.setDate(1) // Avoids edge cases on the 31st day of some months
  date.setMonth(date.getMonth() + 1)
  date.setDate(0)
  date.setHours(23)
  date.setMinutes(59)
  date.setSeconds(59)
  date.setMilliseconds(999)
  return date
}
