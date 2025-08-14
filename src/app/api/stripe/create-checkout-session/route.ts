import { createClient } from '@/libs/supabase/server' // 네가 만든 createClient 함수 경로에 맞게 수정
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    console.error('Supabase getUser error:', error)
    return new Response(JSON.stringify({ error: 'Not logged in' }), {
      status: 401,
    })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/log`,
    metadata: {
      user_id: user.id,
    },
    allow_promotion_codes: true,
  })

  return new Response(JSON.stringify({ url: session.url }))
}
