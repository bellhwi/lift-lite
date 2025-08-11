'use client'

import { useState } from 'react'
import { deleteLog, updateLog } from './LogActions'
import type { WorkoutLog } from '@/utils/storage'
import type { User } from '@supabase/supabase-js'
import { formatShortDateLocal } from '@/utils/workoutLogHelpers'

export default function NotesSection({
  logs,
  isEditing,
  setIsEditing,
  setLogs,
  user,
}: {
  logs: WorkoutLog[]
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  setLogs: React.Dispatch<React.SetStateAction<WorkoutLog[]>>
  user: User | null
}) {
  const [editingLog, setEditingLog] = useState<WorkoutLog | null>(null)
  const [editNote, setEditNote] = useState('')
  const [editWeight, setEditWeight] = useState('')
  const [editReps, setEditReps] = useState('')

  return (
    <div className='space-y-3 text-sm'>
      <div className='flex justify-between items-center'>
        <h3 className='font-semibold text-gray-800'>Notes</h3>
        <button
          onClick={() => {
            setIsEditing(!isEditing)
            setEditingLog(null)
          }}
          className='text-sm text-blue-600'
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {logs.map((log, index) => {
        const formattedDate = formatShortDateLocal(log.date)

        const isCurrent =
          editingLog?.date === log.date && editingLog?.lift === log.lift

        return (
          <div
            key={`${log.date}-${log.lift}-${index}`}
            className={`pb-2 text-gray-700 ${
              index !== logs.length - 1 ? 'border-b border-gray-300' : ''
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
                    onClick={async () => {
                      const updated = {
                        ...log,
                        note: editNote,
                        weight: parseInt(editWeight),
                        maxReps: editReps ? parseInt(editReps) : undefined,
                      }
                      await updateLog(user, log, updated)
                      setLogs((prev) =>
                        prev.map((l) =>
                          l.date === log.date && l.lift === log.lift
                            ? updated
                            : l
                        )
                      )
                      setEditingLog(null)
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
                    {log.weight} lbs
                    {log.maxReps ? ` × ${log.maxReps}` : ''} — {formattedDate}
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
                      onClick={async () => {
                        if (!confirm('Are you sure delete this log?')) return
                        await deleteLog(user, log, setLogs)
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
  )
}
