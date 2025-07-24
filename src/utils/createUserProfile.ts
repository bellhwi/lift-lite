import type { SupabaseClient, User } from '@supabase/supabase-js'

export async function createUserProfile(supabase: SupabaseClient, user: User) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existing) {
    await supabase.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url,
      plan: 'free',
      date: new Date().toISOString(),
    })
  }
}
