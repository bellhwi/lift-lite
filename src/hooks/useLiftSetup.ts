'use client'

import { useEffect, useState } from 'react'
import { useCustomLifts } from '@/hooks/useCustomLifts'
import { useUserPlan } from '@/hooks/useUserPlan'
import {
  filterLogsByLift,
  formatChartData,
  sortLogsByDateDesc,
} from '@/utils/workoutLogHelpers'
import type { WorkoutLog } from '@/utils/storage'

export function useLiftSetup({
  defaultLift,
  logs,
}: {
  defaultLift: string | null
  logs: WorkoutLog[]
}) {
  const presetLifts = ['Squat', 'Deadlift', 'Bench Press', 'Military Press']
  const { customLifts } = useCustomLifts()
  const { dbPlan, planLoading } = useUserPlan() // ✅ 로컬 플랜 제거, DB 플랜만 사용

  const [allLifts, setAllLifts] = useState<string[]>(presetLifts)
  const [liftName, setLiftName] = useState<string | null>(null)
  const [data, setData] = useState<
    { date: string; weight: number; maxReps?: number }[]
  >([])

  // 플랜/커스텀 리프트 변경 시 리프트 목록 갱신
  useEffect(() => {
    if (dbPlan === 'plus') {
      setAllLifts([...presetLifts, ...(customLifts ?? [])])
    } else {
      setAllLifts(presetLifts)
    }
  }, [dbPlan, customLifts])

  // 기본 리프트 선택 (플랜과 무관)
  useEffect(() => {
    if (liftName) return
    if (logs.length === 0) return
    const fallbackLift = logs[0]?.lift || 'Deadlift'
    setLiftName(defaultLift || fallbackLift)
  }, [defaultLift, logs, liftName])

  // 차트 데이터 계산
  useEffect(() => {
    if (!liftName) return
    const filtered = filterLogsByLift(logs, liftName)
    setData(formatChartData(filtered))
  }, [liftName, logs])

  const filteredLogs = liftName
    ? sortLogsByDateDesc(filterLogsByLift(logs, liftName))
    : []

  return {
    liftName,
    setLiftName,
    allLifts,
    data,
    filteredLogs,
    userPlan: dbPlan, // 🔁 외부 호환성 유지를 위해 같은 키로 반환
    planLoading, // (선택) 소비 측에서 로딩 제어 가능
  }
}
