// lib/syncProfile.ts
import { supabase } from '@/libs/supabase/client'

export async function syncUserProfile() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    console.error('❌ Failed to fetch user:', error)
    return
  }

  const { id } = user
  const { full_name, avatar_url } = user.user_metadata

  const { error: upsertError } = await supabase.from('profiles').upsert({
    id,
    full_name,
    avatar_url,
  })

  if (upsertError) {
    console.error('❌ Failed to upsert profile:', upsertError)
  } else {
    console.log('✅ Profile synced to Supabase')
  }
}
