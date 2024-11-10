import '../utils/date.extensions'
import { Profiler, useReducer } from 'react'
import { useMutation } from '@apollo/client'
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TransactionStatus, TransactionType } from '@/__generated__/graphql'
import { GENERATE_CSV } from '@/operations/download'
import { onRenderCallback } from './utils/onRenderCallback'

type State = {
  date: DateRange | undefined
  type: TransactionType
  status: TransactionStatus
}

type Action =
  | { type: 'set_date_range', payload: DateRange | undefined }
  | { type: 'set_type', payload: TransactionType }
  | { type: 'set_status', payload: TransactionStatus }

const initialState: State = {
  date: {
    from: new Date().addDays(-1),
    to: new Date(),
  },
  type: TransactionType.All,
  status: TransactionStatus.All,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'set_date_range': {
      return {
        ...state,
        date: action.payload
      };
    }
    case 'set_type': {
      return {
        ...state,
        type: action.payload
      };
    }
    case 'set_status': {
      return {
        ...state,
        status: action.payload
      };
    }
    default:
      return state
  }
}

type TransactionHistoryHeaderProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any
}

function TransactionHistoryHeader({ refetch }: TransactionHistoryHeaderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mutateGenerateCSV] = useMutation(GENERATE_CSV)

  async function handleSearch() {
    refetch({
      startDate: state.date?.from?.toISOString(),
      endDate: state.date?.to?.toISOString(),
      type: state.type === 'ALL' ? undefined : state.type,
      status: state.status === 'ALL' ? undefined : state.status,
    })
  }

  function handleGenerateCSV() {
    mutateGenerateCSV({
      variables: {
        startDate: state.date?.from?.toISOString(),
        endDate: state.date?.to?.toISOString(),
        type: state.type === 'ALL' ? undefined : state.type,
        status: state.status === 'ALL' ? undefined : state.status,
      }
    })
  }

  return (
    <Profiler id='onTransactionHistoryHeader' onRender={onRenderCallback}>
      <div className="pb-4 items-end sm:pb-6 sm:flex sm:justify-end space-y-4 gap-4 sm:space-y-0 sm:gap-6">
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4'>
          <div className='col-span-1'>
            <div className={cn("grid gap-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !state.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {state.date?.from ? (
                      state.date.to ? (
                        <>
                          {format(state.date.from, "LLL dd, y")} -{" "}
                          {format(state.date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(state.date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick the date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={state.date?.from}
                    selected={state.date}
                    onSelect={(date) => dispatch({ type: 'set_date_range', payload: date })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className='col-span-3 grid grid-cols-4 gap-4'>
            <Select onValueChange={(value: TransactionType) => dispatch({ type: 'set_type', payload: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TransactionType.All}>All</SelectItem>
                <SelectItem value={TransactionType.Buy}>Buy</SelectItem>
                <SelectItem value={TransactionType.Sell}>Sell</SelectItem>
                <SelectItem value={TransactionType.Deposit}>Deposit</SelectItem>
                <SelectItem value={TransactionType.Withdrawal}>Withdrawal</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value: TransactionStatus) => dispatch({ type: 'set_status', payload: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TransactionStatus.All}>All</SelectItem>
                <SelectItem value={TransactionStatus.Completed}>Completed</SelectItem>
                <SelectItem value={TransactionStatus.Pending}>Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleSearch}>Search</Button>
            <Button onClick={handleGenerateCSV}>Generate CSV</Button>
          </div>
        </div>
      </div>
    </Profiler>
  )
}

export default TransactionHistoryHeader
