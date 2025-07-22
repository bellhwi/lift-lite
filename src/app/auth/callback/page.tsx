// src/app/auth/callback/page.tsx
import { createClientWithResponse } from '@/libs/server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage() {
  const response = NextResponse.next()
  const supabase = await createClientWithResponse(response)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/log')
  } else {
    redirect('/')
  }
}
