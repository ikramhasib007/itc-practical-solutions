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
