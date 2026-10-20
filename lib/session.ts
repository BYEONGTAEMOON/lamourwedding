// Session token signing/verification. No Next.js request APIs here so proxy.ts can import it.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'admin_session';
const SESSION_DAYS = 7;

function secret() {
    const s = process.env.ADMIN_SESSION_SECRET;
    if (!s || s.length < 16) {
        throw new Error('ADMIN_SESSION_SECRET 환경변수를 16자 이상으로 설정하세요.');
    }
    return s;
}

const sign = (payload: string) =>
    createHmac('sha256', secret()).update(payload).digest('base64url');

const safeEqual = (a: string, b: string) => {
    const ha = createHash('sha256').update(a).digest();
    const hb = createHash('sha256').update(b).digest();
    return timingSafeEqual(ha, hb);
};

// Fallback used until a password is changed from the admin (see lib/admin-password.ts).
export function checkEnvPassword(input: string) {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error('ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.');
    return safeEqual(input, expected);
}

// Token format: "<expiry ms>.<hmac>"
export function createSessionToken() {
    const expires = String(Date.now() + SESSION_DAYS * 86400_000);
    return { token: `${expires}.${sign(expires)}`, maxAge: SESSION_DAYS * 86400 };
}

// Tokens always last SESSION_DAYS, so the issue time follows from the expiry.
export const sessionIssuedAt = (token: string) =>
    Number(token.split('.')[0]) - SESSION_DAYS * 86400_000;

export function verifySessionToken(token: string | undefined) {
    if (!token) return false;
    const [expires, mac] = token.split('.');
    if (!expires || !mac || Number(expires) < Date.now()) return false;
    return safeEqual(mac, sign(expires));
}
