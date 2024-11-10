import '../src/utils/date.extensions'
import casual from 'casual'
import bcrypt from 'bcryptjs'
import { Prisma, TransactionType, TransactionStatus } from '@prisma/client'

casual.define('user', function (): Prisma.UserCreateInput {
  return {
    firstName: casual.first_name,
    lastName: casual.last_name,
    email: casual.email,
    password: bcrypt.hashSync('12345678', 10),
  }
})

casual.define(
  'transaction',
  function (
    type: TransactionType,
    status: TransactionStatus
  ): Prisma.TransactionCreateInput {
    return {
      type,
      status,
      amount: casual.integer(1000, 20000),
    }
  }
)

casual.define('download', function (): Prisma.DownloadCreateInput {
  return {
    startDate: new Date().addDays(-10).toISOString(),
    endDate: new Date().toISOString(),
    transactionType: casual.random_element([
      TransactionType.BUY,
      TransactionType.SELL,
      TransactionType.DEPOSIT,
      TransactionType.WITHDRAWAL,
    ]),
    transactionStatus: casual.random_element([
      TransactionStatus.PENDING,
      TransactionStatus.COMPLETED,
    ]),
    requestTime: new Date().toISOString(),
    completionTime: new Date().toISOString(),
    path: casual.url,
  }
})
