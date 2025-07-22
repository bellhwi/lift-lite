// lib/sync.ts
import { supabase } from '@/libs/supabase/client'
import { getLogs } from './storage'

export async function syncLocalLogsToSupabase() {
  const localLogs = getLogs()
  if (!localLogs.length) {
    alert('No local workout logs to sync.')
    return
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    alert('Unable to retrieve logged-in user.')
    return
  }

  const records = localLogs.map((log) => ({
    ...log,
    user_id: user.id,
  }))

  const { error: insertError } = await supabase.from('workouts').insert(records)

  if (insertError) {
    console.error('❌ Sync error:', insertError)
    alert('There was a problem syncing your logs.')
    return
  }

  // Optional: clear local logs after sync
  for (const key in localStorage) {
    if (key.startsWith('log-')) localStorage.removeItem(key)
  }

  alert('✅ Successfully synced workout logs to your account!')
}
