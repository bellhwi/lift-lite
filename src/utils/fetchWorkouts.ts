import { supabase } from '@/libs/supabase/client'

export async function fetchWorkoutsFromSupabase() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (!user || userError) {
    console.error('❌ Failed to fetch user:', userError)
    return []
  }

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) {
    console.error('❌ Failed to fetch workouts:', error)
    return []
  }

  return data
}
