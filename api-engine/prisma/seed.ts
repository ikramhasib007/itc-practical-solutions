import './seed.util'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const casual = require('casual')
import {
  PrismaClient,
  TransactionType,
  TransactionStatus,
} from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Creating many users
  const createUsers = [
    ...Array.from({ length: 10 }, (v, i) =>
      prisma.user.create({ data: casual.user })
    ),
  ]
  const users = await prisma.$transaction(createUsers)

  const createTransactions = [
    ...Array.from({ length: 10 }, (v, i) =>
      prisma.transaction.create({
        data: casual.transaction(
          TransactionType.WITHDRAWAL,
          TransactionStatus.COMPLETED
        ),
      })
    ),
    ...Array.from({ length: 10 }, (v, i) =>
      prisma.transaction.create({
        data: casual.transaction(
          TransactionType.DEPOSIT,
          TransactionStatus.COMPLETED
        ),
      })
    ),
    ...Array.from({ length: 10 }, (v, i) =>
      prisma.transaction.create({
        data: casual.transaction(
          TransactionType.BUY,
          TransactionStatus.COMPLETED
        ),
      })
    ),
    ...Array.from({ length: 10 }, (v, i) =>
      prisma.transaction.create({
        data: casual.transaction(
          TransactionType.SELL,
          TransactionStatus.COMPLETED
        ),
      })
    ),
  ]

  const transactions = await prisma.$transaction(createTransactions)
  console.log(JSON.stringify({ users, transactions }, undefined, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
