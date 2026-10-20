import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { passwordChangedAt } from './admin-password';
import { SESSION_COOKIE, sessionIssuedAt, verifySessionToken } from './session';

export async function isAdmin() {
    // The expiry check reads the clock, so it must run per request, never while prerendering.
    await connection();
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token || !verifySessionToken(token)) return false;
    // Changing the password signs out every session issued before it.
    return sessionIssuedAt(token) >= (await passwordChangedAt());
}

// Call at the top of every admin page loader and admin Server Function.
export async function requireAdmin() {
    if (!(await isAdmin())) redirect('/admin/login');
}
