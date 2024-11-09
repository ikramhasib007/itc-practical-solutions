import date from 'date-and-time'
import { dateFormat, dateTimeFormat } from '@/lib/utils'

type DateTimeHtmlEntityProps = {
  dateTime: Date
  format?: string
}

function DateTimeHtmlEntity({ dateTime, format = dateFormat }: DateTimeHtmlEntityProps) {
  return (
    <time
      dateTime={date.format(new Date(dateTime), format)}
      title={date.format(new Date(dateTime), dateTimeFormat)}
    >
      {date.format(new Date(dateTime), format)}
    </time>
  )
}

export {
  DateTimeHtmlEntity
}
