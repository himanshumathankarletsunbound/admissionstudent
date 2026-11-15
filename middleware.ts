import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) }
  })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user && request.nextUrl.pathname.startsWith('/admin/dashboard')) return NextResponse.redirect(new URL('/admin/login', request.url))
  if (user && request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    const { data: approved } = await supabase.rpc('is_approved_admin')
    if (!approved) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/admin/login?error=not-approved', request.url))
    }
  }
  return response
}

export const config = { matcher: ['/admin/dashboard/:path*'] }
export const runtime = 'nodejs'
