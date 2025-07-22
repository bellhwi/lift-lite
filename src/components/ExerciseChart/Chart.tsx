'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export type ChartDataPoint = {
  date: string
  weight: number
  maxReps?: number
}

export default function Chart({
  data,
  liftName,
}: {
  data: ChartDataPoint[]
  liftName: string
}) {
  if (data.length === 0) {
    return (
      <p className='text-center text-gray-500 text-sm'>
        No logs yet for {liftName}.
      </p>
    )
  }

  return (
    <div className='h-64'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data}>
          <XAxis dataKey='date' />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null
              const entry = payload[0].payload
              return (
                <div className='rounded bg-white px-3 py-2 shadow'>
                  <p className='text-sm font-semibold text-blue-600'>{label}</p>
                  <p className='text-sm text-gray-800'>
                    Weight: {entry.weight} lbs
                    {entry.maxReps ? ` × ${entry.maxReps}` : ''}
                  </p>
                </div>
              )
            }}
          />
          <Line
            type='monotone'
            dataKey='weight'
            stroke='#3f80ff'
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
