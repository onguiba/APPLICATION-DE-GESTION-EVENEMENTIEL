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
  '/actualites',
  '/provider',
  '/participant',
];

const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot',
  '/',
  '/events',
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Toujours laisser passer les routes publiques
  const isPublic = publicRoutes.some(r => pathname === r || pathname.startsWith(r + '/'));
  if (isPublic) return NextResponse.next();

  // Vérifier si c'est une route protégée
  const isProtected = protectedRoutes.some(r => pathname === r || pathname.startsWith(r + '/'));
  if (!isProtected) return NextResponse.next();

  // Vérifier le cookie de session NextAuth
  const sessionToken =
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;

  if (!sessionToken) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
