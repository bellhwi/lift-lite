'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/useUser'

type CustomLift = {
  id: string
  name: string
}

export default function CustomWorkoutManager({
  currentLift,
  onSelectLift,
  onClose,
  customLifts,
  setCustomLifts,
}: {
  currentLift: string
  onSelectLift: (lift: string) => void
  onClose: () => void
  customLifts: CustomLift[]
  setCustomLifts: React.Dispatch<React.SetStateAction<CustomLift[]>>
}) {
  const user = useUser()
  const [newLift, setNewLift] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleAdd = async () => {
    if (!user || !newLift.trim()) return

    const { data, error } = await supabase
      .from('custom_exercises')
      .insert([{ user_id: user.id, name: newLift.trim() }])
      .select('id, name')
      .single()

    if (!error && data) {
      setCustomLifts((prev) => [...prev, data])
      setNewLift('')
      onSelectLift(data.name)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!user) return
    const confirmed = confirm(`Are you sure you want to delete "${name}"?`)
    if (!confirmed) return

    await supabase.from('custom_exercises').delete().eq('id', id)
    setCustomLifts((prev) => prev.filter((l) => l.id !== id))

    if (currentLift === name) onSelectLift('Squat')
  }

  const handleEdit = async () => {
    if (!user || !editingId || !editName.trim()) return

    const { error } = await supabase
      .from('custom_exercises')
      .update({ name: editName.trim() })
      .eq('id', editingId)

    if (!error) {
      setCustomLifts((prev) =>
        prev.map((l) =>
          l.id === editingId ? { ...l, name: editName.trim() } : l
        )
      )

      if (currentLift === customLifts.find((l) => l.id === editingId)?.name) {
        onSelectLift(editName.trim())
      }

      setEditingId(null)
      setEditName('')
    }
  }

  return (
    <div className='mt-2 space-y-3 text-sm'>
      <div className='flex gap-2'>
        <input
          type='text'
          value={newLift}
          onChange={(e) => setNewLift(e.target.value)}
          placeholder='Add custom workout (e.g. Barbell Row)'
          className='w-full border border-gray-300 p-2 rounded'
        />
        <button
          onClick={handleAdd}
          className='text-sm text-white bg-blue-600 px-3 py-2 rounded'
        >
          Add
        </button>
      </div>

      {customLifts.length > 0 && (
        <ul className='space-y-1'>
          {customLifts.map(({ id, name }) => (
            <li
              key={id}
              className='flex justify-between items-center border border-gray-200 rounded px-3 py-2'
            >
              {editingId === id ? (
                <div className='flex w-full items-center gap-2'>
                  <input
                    type='text'
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className='flex-1 border border-gray-300 p-1 rounded'
                  />
                  <button
                    onClick={handleEdit}
                    className='text-xs text-blue-500 py-1 rounded'
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setEditName('')
                    }}
                    className='text-xs text-gray-400'
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{name}</span>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => {
                        setEditingId(id)
                        setEditName(name)
                      }}
                      className='text-blue-500 text-xs hover:underline'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id, name)}
                      className='text-red-500 text-xs hover:underline'
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className='flex justify-end pt-2'>
        <button onClick={onClose} className='text-xs text-gray-500'>
          Close
        </button>
      </div>
    </div>
  )
}
