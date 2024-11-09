import { ReactElement } from "react";
import { classNames } from "@/lib/utils";

interface RowsWrapperProps<TRow> {
  rows?: TRow[];
  loading?: boolean;
  columns: number;
  take?: number;
  children(arg: TRow[]): ReactElement[];
}

function RowsWrapper<TRow>({
  children,
  rows,
  loading = false,
  columns,
  take = 10,
}: RowsWrapperProps<TRow>) {

  if (loading || rows === undefined) return <RowsLoadingSkeleton take={take} columns={columns} />

  if (!rows.length) return <DataNotFoundRow columns={columns} />

  return children(rows)
}

export { RowsWrapper };

type RowsLoadingSkeletonProps = { take: number, columns: number }

function RowsLoadingSkeleton({ take, columns }: RowsLoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: take }, (_, idx) => idx).map((idx, j) => (
        <tr key={idx + j + 'genUniqueKey1'} className='bg-white animate-pulse-1s'>
          <td
            colSpan={columns}
            className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500'
          >
            <div
              className={classNames(
                "grid grid-flow-col gap-x-6",
                `grid-cols-${columns}`
              )}
            >
              {Array.from({ length: columns }, (_, idy) => idy).map(
                (idy, i) => (
                  <div
                    key={idy + i + 'genUniqueKey2'}
                    className='h-5 col-span-1 bg-slate-200 rounded'
                  ></div>
                )
              )}
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

export function DataNotFoundRow({ columns }: Pick<RowsLoadingSkeletonProps, 'columns'>) {
  return (
    <tr className='bg-white'>
      <td
        colSpan={columns}
        className='text-center px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500'
      >
        Data not found
      </td>
    </tr>
  )
}