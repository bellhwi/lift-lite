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
import { Button } from '@/components/Button'

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
  const [isEditing, setIsEditing] = useState(false)
  const [editingLog, setEditingLog] = useState<WorkoutLog | null>(null)
  const [editNote, setEditNote] = useState('')
  const [editWeight, setEditWeight] = useState('')
  const [editReps, setEditReps] = useState('')

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

  const filteredLogs = logs
    .filter((log) => log.lift === liftName)
    .sort((a, b) => b.date.localeCompare(a.date))

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
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null

                  const entry = payload[0].payload
                  const formattedDate = new Date(label).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                    }
                  )

                  return (
                    <div className='rounded bg-white px-3 py-2 shadow'>
                      <p className='text-sm font-semibold text-blue-600'>
                        {formattedDate}
                      </p>
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
      )}

      {/* Notes */}
      {data.length > 0 && (
        <div className='space-y-3 text-sm'>
          <div className='flex justify-between items-center'>
            <h3 className='font-semibold text-gray-800'>Notes</h3>
            <button
              onClick={() => {
                setIsEditing((prev) => !prev)
                setEditingLog(null)
              }}
              className='text-sm text-blue-600'
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {filteredLogs.map((log, index) => {
            const formattedDate = new Date(log.date).toLocaleDateString(
              'en-US',
              {
                month: 'long',
                day: 'numeric',
              }
            )

            const isCurrent =
              editingLog?.date === log.date && editingLog?.lift === log.lift

            return (
              <div
                key={`${log.date}-${log.lift}`}
                className={`pb-2 text-gray-700 ${
                  index !== filteredLogs.length - 1
                    ? 'border-b border-gray-300'
                    : ''
                }`}
              >
                {isCurrent ? (
                  <div className='space-y-2'>
                    <div className='flex gap-2'>
                      <input
                        type='number'
                        value={editWeight}
                        onChange={(e) => setEditWeight(e.target.value)}
                        className='w-24 p-2 border border-gray-300 rounded'
                        placeholder='lbs'
                      />
                      <input
                        type='number'
                        value={editReps}
                        onChange={(e) => setEditReps(e.target.value)}
                        className='w-24 p-2 border border-gray-300 rounded'
                        placeholder='reps'
                      />
                    </div>
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      className='w-full p-2 border border-gray-300 rounded'
                      placeholder='How did it feel?'
                    />
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => setEditingLog(null)}
                        className='text-gray-500'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const updated = {
                            ...log,
                            note: editNote,
                            weight: parseInt(editWeight),
                            maxReps: editReps ? parseInt(editReps) : undefined,
                          }
                          const key = `log-${log.date}-${log.lift}`
                          localStorage.setItem(key, JSON.stringify(updated))
                          setLogs((prev) =>
                            prev.map((l) =>
                              l.date === log.date && l.lift === log.lift
                                ? updated
                                : l
                            )
                          )
                          setEditingLog(null)
                          setIsEditing(false)
                        }}
                        className='text-blue-600 font-semibold'
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='flex justify-between items-start'>
                    <div className='w-full flex justify-between items-start'>
                      <span className='italic text-gray-600'>
                        {log.note?.trim() || 'no message'}
                      </span>
                      <div className='text-sm text-gray-500'>
                        {log.weight} lbs {log.maxReps ? `× ${log.maxReps}` : ''}{' '}
                        — {formattedDate}
                      </div>
                    </div>
                    {isEditing && (
                      <div className='flex gap-3 text-sm text-blue-600 text-right ml-4'>
                        <button
                          onClick={() => {
                            setEditingLog(log)
                            setEditNote(log.note || '')
                            setEditWeight(log.weight.toString())
                            setEditReps(log.maxReps?.toString() || '')
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            if (!confirm('Are you sure delete this log?'))
                              return
                            const key = `log-${log.date}-${log.lift}`
                            localStorage.removeItem(key)
                            setLogs((prev) =>
                              prev.filter(
                                (l) =>
                                  !(l.date === log.date && l.lift === log.lift)
                              )
                            )
                          }}
                          className='text-red-600'
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Button */}
      <Button
        onClick={() => router.push('/log')}
        className='w-full'
        color='blue'
      >
        Log New Workout
      </Button>
    </div>
  )
}
