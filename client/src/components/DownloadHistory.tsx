import type { NextConfig } from 'next'
import getConfig from 'next/config'
import { useQuery, NetworkStatus } from '@apollo/client'
import {
  BounceLoader,
  CreatedAtTime,
  DateTimeHtmlEntity,
  RowsWrapper,
  SimplePaginationWrapper,
} from '@/components/utils'
import { classNames } from '@/lib/utils'
import { GET_DOWNLOAD_LIST } from '@/operations/download'

const { publicRuntimeConfig }: NextConfig = getConfig()
const staticUrl = (publicRuntimeConfig!.API_PATH as string).replace('/graphql', '')

const LIST_TAKE = 5

function DownloadHistory() {
  const { data, loading, refetch, networkStatus } = useQuery(GET_DOWNLOAD_LIST, {
    variables: { take: LIST_TAKE },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    pollInterval: 1000 // Polling
  })

  return (
    <div>
      <div className="mb-4 sm:mb-6 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Download history</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the download history with their date range, request time, status, etc.
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="mx-0.25 overflow-hidden shadow ring-1 ring-black/5 ring-opacity-2 rounded-md sm:rounded-lg">
              <SimplePaginationWrapper list={data?.downloadList} refetch={refetch} take={LIST_TAKE}>
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50 divide-y divide-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                      >
                        Req #
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Date Range
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Req_Time
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Completion_Time
                      </th>
                      <th
                        scope="col"
                        className="relative py-3 pl-3 pr-4 sm:pr-6 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <RowsWrapper
                      rows={data?.downloadList?.downloads}
                      columns={5}
                      loading={loading && !data && networkStatus !== NetworkStatus.refetch}
                      take={LIST_TAKE}
                    >
                      {(downloadListData) => downloadListData.map((item, itemIdx) => (
                        <tr key={item.id} className={itemIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="whitespace-normal py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{itemIdx + 1}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">
                            <DateTimeHtmlEntity dateTime={item.startDate} format='DD-MMM-YY' />
                            {' '}To{' '}
                            <DateTimeHtmlEntity dateTime={item.endDate} format='DD-MMM-YY' />
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm font-medium text-gray-700">
                            <DateTimeHtmlEntity dateTime={item.requestTime} format='DD-MMM-YY HH:mmA' />
                          </td>
                          <td className="relative whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">
                            {!item.completionTime ? <div className='relative flex items-center'>
                              <span className='text-sm text-gray-600'>Processing {' '}</span> <BounceLoader className='mt-1 pl-1' />
                            </div> : <CreatedAtTime data={item} />}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                            <a
                              href={`${staticUrl}/${item.path}`}
                              target="_blank"
                              className={classNames(
                                !item.completionTime
                                  ? 'pointer-events-none text-primary/40'
                                  : 'text-indigo-600 hover:text-indigo-900'
                              )}
                            >
                              Link<span className="sr-only">, {item.filename}</span>
                            </a>
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

export default DownloadHistory