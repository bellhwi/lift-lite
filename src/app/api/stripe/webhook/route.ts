import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/libs/supabase/admin'
export const config = {
  runtime: 'nodejs',
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

async function buffer(readable: ReadableStream<Uint8Array>) {
  const reader = readable.getReader()
  const chunks = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  return Buffer.concat(chunks)
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') || ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET!

  let rawBody: Buffer

  try {
    rawBody = await buffer(req.body as ReadableStream<Uint8Array>)
    console.log('📦 Raw body length:', rawBody.length)
  } catch (err) {
    console.error('❌ Failed to read raw body:', err)
    return new Response('Failed to read body', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret)
    console.log('✅ Webhook verified. Event:', event.type)
  } catch (err) {
    console.error('❌ Signature verification failed:', err)
    return new Response('Webhook signature verification failed', {
      status: 400,
    })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id

    if (!userId) {
      return new Response('Missing user ID in metadata', { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ plan: 'plus' })
      .eq('id', userId)

    if (error) {
      console.error('❌ Failed to update Supabase profile:', error)
      return new Response('Database update failed', { status: 500 })
    }

    console.log(`✅ User ${userId} plan upgraded to plus`)
    return new Response('Success', { status: 200 })
  }

  return new Response('Unhandled event type', { status: 200 })
}
