// /app/api/stripe/create-portal-session/route.ts
import { createClient } from '@/libs/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Supabase getUser error:', userError)
    return new Response(JSON.stringify({ error: 'Not logged in' }), {
      status: 401,
    })
  }

  // 1) profiles에서 customer id만 읽기 (email은 profiles에 없음)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('profiles query error:', profileError)
    return new Response(JSON.stringify({ error: 'profiles table error' }), {
      status: 500,
    })
  }

  let customerId = profile?.stripe_customer_id ?? null

  // 2) 없으면 Stripe에서 이메일로 검색해 백필
  if (!customerId) {
    const email = user.email // ← Supabase auth의 이메일
    if (!email) {
      return new Response(JSON.stringify({ error: 'User has no email' }), {
        status: 400,
      })
    }

    // Stripe Customer Search: email만으로 검색 (status 필드는 지원 안 함)
    const search = await stripe.customers.search({
      query: `email:"${email}"`,
      limit: 1,
    })
    const found = search.data[0]

    if (!found) {
      // 고객 자체가 없다면 보통은 결제를 먼저 완료해야 포털을 쓸 수 있음
      return new Response(
        JSON.stringify({
          error:
            'No Stripe customer found. Please complete a checkout first before opening the billing portal.',
        }),
        { status: 400 }
      )
    }

    customerId = found.id

    // 3) 백필 (실패해도 포털 생성은 진행)
    const { error: upsertErr } = await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
    if (upsertErr) {
      console.error('Failed to backfill stripe_customer_id:', upsertErr)
    }
  }

  // 4) 포털 세션 생성
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId!,
    return_url: `${origin}/log`,
  })

  return new Response(JSON.stringify({ url: session.url }), { status: 200 })
}
