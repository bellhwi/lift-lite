'use client'

import { useState } from 'react'
import { supabase } from '@/libs/supabase/client'
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
              <>
                <span>{name}</span>
                <button
                  onClick={() => handleDelete(id, name)}
                  className='text-red-500 text-xs hover:underline'
                >
                  Delete
                </button>
              </>
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
