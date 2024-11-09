import { gql } from "@apollo/client";
import {
  CORE_TRANSACTION_FIELDS,
  CORE_USER_FIELDS,
  CORE_DOWNLOAD_FIELDS,
} from "./core";

export const USER_FIELDS = gql`
  ${CORE_USER_FIELDS}

  fragment UserFields on User {
    ...CoreUserFields
    lastLogin
  }
`;

export const TRANSACTION_FIELDS = gql`
  ${CORE_TRANSACTION_FIELDS}

  fragment TransactionFields on Transaction {
    ...CoreTransactionFields
  }
`;

export const DOWNLOAD_FIELDS = gql`
  ${CORE_DOWNLOAD_FIELDS}

  fragment DownloadFields on Download {
    ...CoreDownloadFields
  }
`;
