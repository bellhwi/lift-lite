'use client'

import { useRouter } from 'next/navigation'
import type { WorkoutLog } from '@/utils/storage'
import { Button } from '@/components/Landing/Button'
import { useUser } from '@/hooks/useUser'
import NotesSection from './NotesSection'
import Chart from './Chart'
import LiftSelector from './LiftSelector'
import { useLiftSetup } from '@/hooks/useLiftSetup'
import { useState } from 'react'

export default function ExerciseChart({
  defaultLift,
  logs,
  setLogs,
}: {
  defaultLift: string | null
  logs: WorkoutLog[]
  setLogs: React.Dispatch<React.SetStateAction<WorkoutLog[]>>
}) {
  const { liftName, setLiftName, allLifts, data, filteredLogs, userPlan } =
    useLiftSetup({ defaultLift, logs })

  const user = useUser()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  if (!userPlan || !liftName) return null

  return (
    <div className='w-full max-w-md mx-auto pb-8 space-y-6'>
      <LiftSelector
        liftName={liftName}
        setLiftName={setLiftName}
        allLifts={allLifts}
      />

      <Chart data={data} liftName={liftName} />

      {data.length > 0 && user !== undefined && (
        <NotesSection
          logs={filteredLogs}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setLogs={setLogs}
          user={user}
        />
      )}

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
