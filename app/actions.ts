'use server';

import { cookies, headers } from 'next/headers';
import { after } from 'next/server';
import { getSiteContent } from '@/lib/content';
import { isBlocked } from '@/lib/blocklist';
import { sendMetaLead } from '@/lib/meta-capi';
import { notifyNewReservation } from '@/lib/notify';
import { clientIp, isLimited, recordAttempt } from '@/lib/rate-limit';
import { isRegion } from '@/lib/regions';
import { sanitizeSource, type ReservationSource } from '@/lib/reservations';
import { hasRecentReservation, insertReservation } from '@/lib/reservations-db';
import { SITE_URL } from '@/lib/seo';

export type ReservationInput = {
    region: string;
    name: string;
    phone: string;
    weddingMonth: string;
    visitDay: string;
    agreePrivacy: boolean;
    agreeMarketing: boolean;
    website?: string; // honeypot: real visitors never fill this hidden field
    elapsedMs?: number; // time between the form appearing and submit
    eventId?: string; // shared with the browser Pixel Lead for deduplication
    source?: ReservationSource; // UTM tags / ad click IDs from the landing URL
    pageUrl?: string;
};

// Bots post the form instantly; people need a few seconds to fill it in.
const MIN_FILL_MS = 2000;
// Per IP. Generous because mobile carriers put many visitors behind one address.
const RESERVATION_RULE = { limit: 10, windowMs: 10 * 60_000 };
const DUPLICATE_WINDOW_MS = 24 * 60 * 60_000;

export async function createReservation(
    input: ReservationInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
    // Pretend success so bots don't learn what tripped them.
    if (input.website || !(Number(input.elapsedMs) >= MIN_FILL_MS)) return { ok: true };

    const name = String(input.name ?? '').trim();
    const digits = String(input.phone ?? '').replace(/\D/g, '');
    if (!isRegion(input.region)) return { ok: false, error: '잘못된 요청입니다.' };
    const { form } = await getSiteContent(input.region);

    if (!name) return { ok: false, error: '이름을 입력해 주세요.' };
    if (!/^[가-힣]{2,5}$/.test(name)) return { ok: false, error: '이름은 한글 2~5자로 입력해 주세요.' };
    if (digits.length < 10 || digits.length > 11)
        return { ok: false, error: '휴대폰 번호를 정확히 입력해 주세요.' };
    if (!form.weddingMonths.includes(input.weddingMonth))
        return { ok: false, error: '결혼 예정월을 선택해 주세요.' };
    if (!form.visitDays.includes(input.visitDay))
        return { ok: false, error: '방문 희망일을 선택해 주세요.' };
    if (input.agreePrivacy !== true)
        return { ok: false, error: '개인정보 수집·이용에 동의해 주세요.' };

    const phone =
        digits.length === 11
            ? `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
            : `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;

    try {
        // Blocked numbers get the normal success screen but nothing is saved.
        if (await isBlocked(phone)) return { ok: true };
        const ip = await clientIp();
        if (await isLimited('reservation', ip, RESERVATION_RULE)) {
            return { ok: false, error: '신청이 너무 많이 접수되었습니다. 잠시 후 다시 시도해 주세요.' };
        }
        const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
        if (await hasRecentReservation(phone, input.region, since)) {
            return {
                ok: false,
                error: '이미 사전예약이 접수된 번호입니다. 일정 변경은 담당 플래너가 연락드릴 때 말씀해 주세요.',
            };
        }
        await recordAttempt('reservation', ip, RESERVATION_RULE);
        const source = sanitizeSource(input.source);
        const reservation = {
            region: input.region,
            name,
            phone,
            wedding_month: input.weddingMonth,
            visit_day: input.visitDay,
            agree_marketing: input.agreeMarketing === true,
            source: Object.keys(source).length ? source : null,
        };
        await insertReservation(reservation);

        // Request details for the Conversions API, read while the request is still open.
        const [h, jar] = await Promise.all([headers(), cookies()]);
        const fbclid = source.fbclid;
        const fbc = jar.get('_fbc')?.value ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);
        const pageUrl = String(input.pageUrl ?? '');
        const sourceUrl = pageUrl.startsWith(SITE_URL) ? pageUrl.slice(0, 500) : `${SITE_URL}/${input.region}`;
        const eventId = String(input.eventId ?? '').slice(0, 100);

        // Email and the server-side Meta Lead go out after the visitor sees the success screen.
        after(() =>
            Promise.all([
                notifyNewReservation(reservation),
                eventId &&
                    sendMetaLead({
                        eventId,
                        region: input.region,
                        name,
                        phone,
                        sourceUrl,
                        ip,
                        userAgent: h.get('user-agent') ?? '',
                        fbc,
                        fbp: jar.get('_fbp')?.value,
                    }),
            ]),
        );
    } catch (e) {
        console.error('예약 저장 실패:', e instanceof Error ? e.message : e);
        return { ok: false, error: '예약 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
    }
    return { ok: true };
}
