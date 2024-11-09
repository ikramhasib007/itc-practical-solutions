import { gql } from '@apollo/client'

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    id
    firstName
    lastName
    email
    createdAt
    updatedAt
  }
`

export const CORE_TRANSACTION_FIELDS = gql`
  fragment CoreTransactionFields on Transaction {
    id
    type
    amount
    status
    createdAt
    updatedAt
  }
`

export const CORE_DOWNLOAD_FIELDS = gql`
  fragment CoreDownloadFields on Download {
    id
    startDate
    endDate
    transactionType
    transactionStatus
    requestTime
    completionTime
    link
    createdAt
    updatedAt
  }
`
