import { InMemoryCache } from '@apollo/client'
import { searchQueryVar } from '.'
import { cursorTakePaginatedFieldPolicy } from './utilities'

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        _searchQuery: {
          read() { return searchQueryVar() }
        },
      }
    },

    TransactionList: {
      fields: {
        transactions: {
          merge: cursorTakePaginatedFieldPolicy().merge
        },
        hasNextPage: {
          read(nextPage = false) { // default value
            return nextPage
          }
        },
        count: {
          read(count = 0) {  // default value
            return count;
          }
        }
      }
    },

    DownloadList: {
      fields: {
        downloads: {
          merge: cursorTakePaginatedFieldPolicy().merge
        },
        hasNextPage: {
          read(nextPage = false) { // default value
            return nextPage
          }
        },
        count: {
          read(count = 0) {  // default value
            return count;
          }
        }
      }
    },
  }
})
