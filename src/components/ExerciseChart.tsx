'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useRouter } from 'next/navigation'
import { getLogs } from '@/lib/storage'
import type { WorkoutLog } from '@/lib/storage'

const allLifts = ['Squat', 'Deadlift', 'Bench Press', 'Military Press']

export default function ExerciseChart({
  defaultLift,
}: {
  defaultLift: string | null
}) {
  const router = useRouter()
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [liftName, setLiftName] = useState<string | null>(null)
  const [data, setData] = useState<{ date: string; weight: number }[]>([])

  useEffect(() => {
    const logs = getLogs()
    setLogs(logs)

    const fallbackLift = logs[0]?.lift || 'Deadlift'
    setLiftName(defaultLift || fallbackLift)
  }, [defaultLift])

  useEffect(() => {
    if (!liftName || logs.length === 0) return

    const filtered = logs
      .filter((log) => log.lift === liftName)
      .map((log) => ({
        date: new Date(log.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        weight: log.weight,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    setData(filtered)
  }, [liftName, logs])

  return (
    <div className='w-full max-w-md mx-auto pb-8 space-y-6'>
      {/* Header with selector */}
      <div>
        <select
          value={liftName || ''}
          onChange={(e) => setLiftName(e.target.value)}
          className='text-xl font-bold text-gray-900 border-b border-gray-400 p-1 bg-transparent focus:outline-none'
        >
          {allLifts.map((lift) => (
            <option key={lift} value={lift}>
              {lift}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <p className='text-center text-gray-500 text-sm'>
          No logs yet for {liftName}.
        </p>
      ) : (
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={data}>
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value} lbs`, 'Weight']}
              />
              <Line
                type='monotone'
                dataKey='weight'
                stroke='#10b981'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Notes */}
      {data.length > 0 && (
        <div className='space-y-3 text-sm'>
          <h3 className='font-semibold text-gray-800'>Workout Notes</h3>
          {logs
            .filter((log) => log.lift === liftName)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((log) => {
              const formattedDate = new Date(log.date).toLocaleDateString(
                'en-US',
                {
                  month: 'long',
                  day: 'numeric',
                }
              )

              return (
                <div
                  key={`${log.date}-${log.lift}`}
                  className='border-b border-gray-300 pb-2 text-gray-700'
                >
                  <div className='flex justify-between'>
                    <span className='italic text-gray-600'>
                      {log.note?.trim() || 'no message'}
                    </span>
                    <span>
                      <span className='font-medium'>{log.weight} lbs</span> —{' '}
                      {formattedDate}
                    </span>
                  </div>
                </div>
              )
            })}
        </div>
      )}

      {/* Button */}
      <button
        onClick={() => router.push('/')}
        className='w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-900 mt-4'
      >
        Log New Workout
      </button>
    </div>
  )
}
