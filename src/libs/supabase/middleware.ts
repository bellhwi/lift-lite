import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 이 줄은 꼭 유지하세요! (세션 동기화를 위해 필요)
  await supabase.auth.getUser()

  // 🔐 (Optional) Protect certain routes: only allow signed-in users to access private pages
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // const isPublicPath = ['/', '/signin'].some((path) =>
  //   request.nextUrl.pathname.startsWith(path)
  // )

  // if (!user && !isPublicPath) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/signin'
  //   return NextResponse.redirect(url)
  // }

  return supabaseResponse
}
