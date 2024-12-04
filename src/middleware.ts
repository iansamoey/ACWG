import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isAdminPage = request.nextUrl.pathname.startsWith('/dashboard/admin-dashboard')

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check for authentication on protected routes
  if (!token && !isAuthPage) {
    return NextResponse.redirect(
      new URL('/auth/login?callbackUrl=' + encodeURIComponent(request.url), request.url)
    )
  }

  // Check for admin access
  if (isAdminPage && !token?.isAdmin) {
    return NextResponse.redirect(new URL('/dashboard/userDashboard', request.url))
  }

  return NextResponse.next()
}

// Configure protected routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*'
  ]
}

