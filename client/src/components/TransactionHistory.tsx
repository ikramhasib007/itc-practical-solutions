import '@/utils/string.extensions'
import { NetworkStatus, useQuery } from '@apollo/client'
import { CreatedAtTime, RowsWrapper, SimplePaginationWrapper } from '@/components/utils'
import { GET_TRANSACTION_LIST } from '../operations/transaction'
import TransactionHistoryHeader from './TransactionHistoryHeader'

const LIST_TAKE = 5

function TransactionHistory() {
  const { data, loading, refetch, networkStatus } = useQuery(GET_TRANSACTION_LIST, {
    variables: { take: LIST_TAKE },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true
  })

  return (
    <div>
      <div className="mb-4 sm:mb-6 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Transaction list</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the transaction with their amount, transaction type, status, etc.
          </p>
        </div>
      </div>

      <TransactionHistoryHeader refetch={refetch} />

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="mx-0.25 overflow-hidden shadow ring-1 ring-black/5 ring-opacity-2 rounded-md sm:rounded-lg">
              <SimplePaginationWrapper list={data?.transactionList} refetch={refetch} take={LIST_TAKE}>
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50 divide-y divide-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                      >
                        Transaction Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <RowsWrapper
                      rows={data?.transactionList?.transactions}
                      columns={4}
                      loading={loading && !data && networkStatus !== NetworkStatus.refetch}
                      take={LIST_TAKE}
                    >
                      {(transactionListData) => transactionListData.map((item, itemIdx) => (
                        <tr key={item.id} className={itemIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="whitespace-normal py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{item.type.toLocaleLowerCase().toCapitalizeFirst()}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">&#2547;{item.amount}</td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">{item.status.toLocaleLowerCase().toCapitalizeFirst()}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">
                            <CreatedAtTime data={item} />
                          </td>
                        </tr>
                      ))}
                    </RowsWrapper>
                  </tbody>
                </table>
              </SimplePaginationWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory
