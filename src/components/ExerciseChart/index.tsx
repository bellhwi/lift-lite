'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { WorkoutLog } from '@/utils/storage'
import { Button } from '@/components/Landing/Button'
import { useUser } from '@/hooks/useUser'
import { useCustomLifts } from '@/hooks/useCustomLifts'
import LiftSelector from './LiftSelector'
import Chart from './Chart'
import NotesSection from './NotesSection'
import {
  filterLogsByLift,
  formatChartData,
  sortLogsByDateDesc,
} from '@/utils/workoutLogHelpers'

export default function ExerciseChart({
  defaultLift,
  logs,
  setLogs,
}: {
  defaultLift: string | null
  logs: WorkoutLog[]
  setLogs: React.Dispatch<React.SetStateAction<WorkoutLog[]>>
}) {
  const presetLifts = ['Squat', 'Deadlift', 'Bench Press', 'Military Press']
  const { customLifts } = useCustomLifts()
  const [allLifts, setAllLifts] = useState<string[]>(presetLifts)
  const user = useUser()
  const router = useRouter()
  const [liftName, setLiftName] = useState<string>('Deadlift')
  const [userPlan, setUserPlan] = useState<'free' | 'plus' | null>(null)
  const [data, setData] = useState<
    { date: string; weight: number; maxReps?: number }[]
  >([])
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const plan = localStorage.getItem('userPlan') as 'free' | 'plus' | null
    setUserPlan(plan || 'free')
  }, [])

  useEffect(() => {
    if (userPlan === 'plus') {
      setAllLifts([...presetLifts, ...(customLifts ?? [])])
    } else {
      setAllLifts(presetLifts)
    }
  }, [userPlan, customLifts])

  useEffect(() => {
    const fallbackLift = logs[0]?.lift || 'Deadlift'
    setLiftName(defaultLift || fallbackLift)
  }, [defaultLift, logs])

  useEffect(() => {
    if (!liftName) return
    const filtered = filterLogsByLift(logs, liftName)
    setData(formatChartData(filtered))
  }, [liftName, logs])

  const filteredLogs = sortLogsByDateDesc(filterLogsByLift(logs, liftName))

  if (!userPlan) return null

  return (
    <div className='w-full max-w-md mx-auto pb-8 space-y-6'>
      {/* Lift selector */}
      <LiftSelector
        liftName={liftName}
        setLiftName={setLiftName}
        allLifts={allLifts}
      />

      {/* Chart */}
      <Chart data={data} liftName={liftName} />

      {/* Notes & Edit */}
      {data.length > 0 && (
        <NotesSection
          logs={filteredLogs}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setLogs={setLogs}
          user={user}
        />
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
