import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/dashboard',
  '/evenements',
  '/participants',
  '/budget',
  '/notifications',
  '/rapports',
  '/settings',
];

const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot', '/'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // For now, allow all routes to pass through
  // Auth will be handled on the client side and in API routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
