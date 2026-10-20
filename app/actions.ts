'use server';

import { getSiteContent } from '@/lib/content';
import { isRegion } from '@/lib/regions';
import { insertReservation } from '@/lib/reservations-db';

export type ReservationInput = {
    region: string;
    name: string;
    phone: string;
    weddingMonth: string;
    visitDay: string;
    agreePrivacy: boolean;
    agreeMarketing: boolean;
    website?: string; // honeypot: real visitors never fill this hidden field
};

export async function createReservation(
    input: ReservationInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
    if (input.website) return { ok: true };

    const name = String(input.name ?? '').trim().slice(0, 40);
    const digits = String(input.phone ?? '').replace(/\D/g, '');
    if (!isRegion(input.region)) return { ok: false, error: '잘못된 요청입니다.' };
    const { form } = await getSiteContent(input.region);

    if (!name) return { ok: false, error: '이름을 입력해 주세요.' };
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
        await insertReservation({
            region: input.region,
            name,
            phone,
            wedding_month: input.weddingMonth,
            visit_day: input.visitDay,
            agree_marketing: input.agreeMarketing === true,
        });
    } catch (e) {
        console.error('예약 저장 실패:', e instanceof Error ? e.message : e);
        return { ok: false, error: '예약 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
    }
    return { ok: true };
}
