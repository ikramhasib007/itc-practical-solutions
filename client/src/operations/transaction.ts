import { gql, TypedDocumentNode } from "@apollo/client";
import { TRANSACTION_FIELDS } from "./fragments";
import {
  TransactionList,
  QueryTransactionListArgs,
} from "@/__generated__/graphql";

interface GetTransactionListData {
  transactionList: TransactionList;
}

export const GET_TRANSACTION_LIST: TypedDocumentNode<
  GetTransactionListData,
  QueryTransactionListArgs
> = gql`
  ${TRANSACTION_FIELDS}

  query GetTransactionList(
    $take: Int
    $skip: Int
    $cursor: String
    $startDate: String
    $endDate: String
    $type: TransactionType
    $status: TransactionStatus
  ) {
    transactionList(
      take: $take
      skip: $skip
      cursor: $cursor
      startDate: $startDate
      endDate: $endDate
      type: $type
      status: $status
    ) {
      transactions(skip: $skip, take: $take, cursor: $cursor) {
        ...TransactionFields
      }
      hasNextPage
      count
    }
  }
`;
