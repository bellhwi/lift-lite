import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/libs/supabase/admin'

export const config = { runtime: 'nodejs' }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

async function buffer(readable: ReadableStream<Uint8Array>) {
  const reader = readable.getReader()
  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  return Buffer.concat(chunks)
}

// --- helpers to avoid TS errors on fields not declared in your types ---
function unwrap<T>(resp: Stripe.Response<T> | T): T {
  return resp as T
}
const toDate = (unixOrNull?: number | null) =>
  typeof unixOrNull === 'number' ? new Date(unixOrNull * 1000) : null

type SubLoose = Stripe.Subscription & {
  current_period_end?: number | null
  cancel_at?: number | null
  ended_at?: number | null
  canceled_at?: number | null
  cancel_at_period_end?: boolean | null
}
function readLoose<T extends keyof Required<SubLoose>>(
  sub: Stripe.Subscription,
  key: T
): Required<SubLoose>[T] | null {
  const v = (sub as any)?.[key]
  return v ?? null
}
// ----------------------------------------------------------------------

async function getUserIdByCustomerId(customerId: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data?.id ?? null
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') || ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET!

  let rawBody: Buffer
  try {
    rawBody = await buffer(req.body as ReadableStream<Uint8Array>)
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

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const customerId = session.customer as string | null
        const subscriptionRef = session.subscription // string | Subscription | null
        const userIdFromMeta = session.metadata?.user_id || null

        let userId = userIdFromMeta
        if (!userId && customerId)
          userId = await getUserIdByCustomerId(customerId)
        if (!userId) return new Response('ok')

        let subObj: Stripe.Subscription | null = null
        if (subscriptionRef && typeof subscriptionRef !== 'string') {
          subObj = subscriptionRef as Stripe.Subscription
        } else if (typeof subscriptionRef === 'string') {
          const subResp = await stripe.subscriptions.retrieve(subscriptionRef)
          subObj = unwrap(subResp)
        }

        const status = subObj?.status ?? 'active'
        const subscriptionId =
          subObj?.id ??
          (typeof subscriptionRef === 'string' ? subscriptionRef : null)

        // read fields via loose helper to avoid TS errors
        const current_period_end = subObj
          ? toDate(readLoose(subObj, 'current_period_end') as number | null)
          : null
        const cancel_at = subObj
          ? toDate(readLoose(subObj, 'cancel_at') as number | null)
          : null
        const cancel_at_period_end = subObj
          ? !!readLoose(subObj, 'cancel_at_period_end')
          : false

        const { error } = await supabaseAdmin
          .from('profiles')
          .update({
            plan: 'plus',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: status,
            current_period_end,
            cancel_at,
            cancel_at_period_end,
            ended_at: null,
            canceled_at: null,
          })
          .eq('id', userId)

        if (error) throw error
        break
      }

      case 'customer.subscription.updated': {
        const sub = unwrap(
          event.data.object as Stripe.Response<Stripe.Subscription>
        )
        const customerId = sub.customer as string

        const userId = await getUserIdByCustomerId(customerId)
        if (!userId) return new Response('ok')

        const status = sub.status
        const current_period_end = toDate(
          readLoose(sub, 'current_period_end') as number | null
        )
        const cancel_at = toDate(readLoose(sub, 'cancel_at') as number | null)
        const cancel_at_period_end = !!readLoose(sub, 'cancel_at_period_end')

        const update: Record<string, any> = {
          stripe_subscription_id: sub.id,
          subscription_status: status,
          current_period_end,
          cancel_at,
          cancel_at_period_end,
        }
        if (status === 'active' || status === 'trialing') update.plan = 'plus'
        if (status === 'canceled') update.plan = 'free'

        const { error } = await supabaseAdmin
          .from('profiles')
          .update(update)
          .eq('stripe_customer_id', customerId)

        if (error) throw error
        break
      }

      case 'customer.subscription.deleted': {
        const sub = unwrap(
          event.data.object as Stripe.Response<Stripe.Subscription>
        )
        const customerId = sub.customer as string

        const userId = await getUserIdByCustomerId(customerId)
        if (!userId) return new Response('ok')

        const canceled_at =
          toDate(readLoose(sub, 'canceled_at') as number | null) ?? new Date()
        const ended_at =
          toDate(readLoose(sub, 'ended_at') as number | null) ?? new Date()

        const { error } = await supabaseAdmin
          .from('profiles')
          .update({
            plan: 'free',
            subscription_status: 'canceled',
            stripe_subscription_id: null,
            cancel_at: null,
            cancel_at_period_end: false,
            current_period_end: null,
            canceled_at,
            ended_at,
          })
          .eq('stripe_customer_id', customerId)

        if (error) throw error
        break
      }

      default:
        break
    }

    return new Response('ok', { status: 200 })
  } catch (err) {
    console.error('❌ Webhook handler error:', err)
    return new Response('Server error', { status: 500 })
  }
}
