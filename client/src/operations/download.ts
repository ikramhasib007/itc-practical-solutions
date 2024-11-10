import { gql, TypedDocumentNode } from "@apollo/client";
import { DOWNLOAD_FIELDS } from "./fragments";
import { DownloadList, MutationGenerateCsvArgs, QueryDownloadListArgs } from "@/__generated__/graphql";

interface GetDownloadListData {
  downloadList: DownloadList;
}

export const GET_DOWNLOAD_LIST: TypedDocumentNode<
  GetDownloadListData,
  QueryDownloadListArgs
> = gql`
  ${DOWNLOAD_FIELDS}

  query GetDownloadList($take: Int, $skip: Int, $cursor: String) {
    downloadList(take: $take, skip: $skip, cursor: $cursor) {
      downloads(skip: $skip, take: $take, cursor: $cursor) {
        ...DownloadFields
      }
      hasNextPage
      count
    }
  }
`;

interface GenerateCSVData {
  generateCSV: boolean;
}

export const GENERATE_CSV: TypedDocumentNode<
  GenerateCSVData,
  MutationGenerateCsvArgs
> = gql`
  mutation GenerateCSV(
    $startDate: String!
    $endDate: String!
    $type: TransactionType
    $status: TransactionStatus
  ) {
    generateCSV(
      startDate: $startDate
      endDate: $endDate
      type: $type
      status: $status
    )
  }
`;
