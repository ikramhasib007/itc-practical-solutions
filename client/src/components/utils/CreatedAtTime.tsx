import date from 'date-and-time'
import ReactTimeago from 'react-timeago'
import { dateTimeFormat } from '@/lib/utils';

interface CreatedAtTimeProps {
  data: {
    createdAt: string;
  }
}

function CreatedAtTime({ data }: CreatedAtTimeProps) {
  return (
    <ReactTimeago
      live={false}
      title={date.format(new Date(data.createdAt), dateTimeFormat)}
      date={data.createdAt}
    />
  )
}

export {
  CreatedAtTime
}