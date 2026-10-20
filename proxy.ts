import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from './lib/session';

// Optimistic redirect for signed-out visitors. Every admin loader and
// Server Function still calls requireAdmin() itself.
export function proxy(request: NextRequest) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!verifySessionToken(token)) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
}

export const config = {
    matcher: ['/admin', '/admin/((?!login).*)'],
};
