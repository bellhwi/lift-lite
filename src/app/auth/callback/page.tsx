// src/app/auth/callback/page.tsx
import { createClient } from '@/libs/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/log')
  } else {
    redirect('/')
  }
}
