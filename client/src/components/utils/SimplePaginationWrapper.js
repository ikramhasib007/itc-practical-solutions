import { useState } from 'react'
import PropTypes from 'prop-types'
import { classNames } from "@/lib/utils";

function SimplePaginationWrapper({ children, refetch, take = 10, list, containerClassName = "" }) {
  const [state, setState] = useState({ take, skip: 0, hasPreviousPage: false })

  function handlePreviousPage(e) {
    e.preventDefault()
    if (!state.hasPreviousPage) return
    let take = state.take;
    let skip = state.skip - state.take;
    setState(prevState => ({ ...prevState, take, skip, hasPreviousPage: skip !== 0 }))
    refetch({
      take,
      skip
    })
  }

  function handleNextPage(e) {
    e.preventDefault()
    if (!list.hasNextPage) return
    let take = state.take;
    let skip = state.skip + state.take;
    setState(prevState => ({ ...prevState, take, skip, hasPreviousPage: true }))
    refetch({
      take,
      skip
    })
  }

  return (
    <>
      {children}

      <nav
        className={classNames(
          "bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6",
          containerClassName
        )}
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          {(list && list.count) ? <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{state.skip + 1}</span> to <span className="font-medium">{(state.take + state.skip) > list.count ? list.count : state.take + state.skip}</span> of{' '}
            <span className="font-medium">{list.count}</span> results
          </p> : <>
            {(list && list.count === 0) ? <p className="text-sm text-gray-700">
              Showing <span className="font-medium">0</span> of{' '}
              <span className="font-medium">0</span> results
            </p> : <div className="animate-pulse-1s">
              <div className="h-5 w-48 bg-slate-200 rounded" />
            </div>}
          </>}
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <a
            href="#"
            onClick={handlePreviousPage}
            className={classNames(
              state.hasPreviousPage ? "hover:bg-gray-50 text-gray-700" : "text-gray-500 cursor-not-allowed",
              "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white"
            )}
          >
            Previous
          </a>
          <a
            href="#"
            onClick={handleNextPage}
            className={classNames(
              list?.hasNextPage ? "hover:bg-gray-50 text-gray-700" : "text-gray-500 cursor-not-allowed",
              "ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white"
            )}
          >
            Next
          </a>
        </div>
      </nav>
    </>
  )
}

SimplePaginationWrapper.propTypes = {
  refetch: PropTypes.func.isRequired,
  list: PropTypes.any,
  containerClassName: PropTypes.string
}

export {
  SimplePaginationWrapper
}