import { NextResponse, type NextRequest } from 'next/server';
import { isRegion } from './lib/regions';
import { SESSION_COOKIE, verifySessionToken } from './lib/session';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Optimistic redirect for signed-out visitors. Every admin loader and
    // Server Function still calls requireAdmin() itself.
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        if (pathname === '/admin/login') return;
        const token = request.cookies.get(SESSION_COOKIE)?.value;
        if (!verifySessionToken(token)) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        return;
    }

    // "/[region]" streams its page, so notFound() there would keep a 200 status.
    // Unknown slugs are rejected here, before rendering starts. Files ("/favicon.ico")
    // and framework paths ("/_next", "/__nextjs…") pass through.
    const slug = pathname.slice(1);
    if (!isRegion(slug) && !slug.includes('.') && !slug.startsWith('_')) {
        return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 });
    }
}

export const config = {
    matcher: ['/admin', '/admin/:path*', '/:slug'],
};
