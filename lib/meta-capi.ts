import 'server-only';
import { createHash } from 'node:crypto';
import { matchingFields } from './meta-matching';
import { META_PIXEL_ID } from './tracking-ids';

// Meta Conversions API: the server reports each reservation as a "Lead" too, so it still
// counts when the browser Pixel is blocked (iOS tracking limits, ad blockers). It shares
// event_id with the browser Lead, so Meta keeps one of the two.
// Needs META_CAPI_TOKEN (Events Manager → 설정 → 전환 API → 액세스 토큰 생성); without it
// the step is skipped. META_TEST_EVENT_CODE routes events to 이벤트 테스트 while checking.

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || 'v26.0';

const sha256 = (s: string) => createHash('sha256').update(s.trim().toLowerCase()).digest('hex');

export type CapiLead = {
    eventId: string;
    region: string;
    name: string;
    phone: string; // "010-1234-5678"
    sourceUrl: string;
    ip: string;
    userAgent: string;
    fbc?: string; // _fbc cookie, or built from fbclid
    fbp?: string; // _fbp cookie
};

export async function sendMetaLead(lead: CapiLead) {
    const token = process.env.META_CAPI_TOKEN;
    if (!token) return;

    const m = matchingFields(lead.name, lead.phone);
    const userData: Record<string, unknown> = {
        ph: [sha256(m.ph)],
        ln: [sha256(m.ln)],
        fn: [sha256(m.fn)],
        country: [sha256(m.country)],
        client_user_agent: lead.userAgent,
    };
    if (lead.ip && lead.ip !== 'unknown') userData.client_ip_address = lead.ip;
    if (lead.fbc) userData.fbc = lead.fbc;
    if (lead.fbp) userData.fbp = lead.fbp;

    const body = {
        data: [
            {
                event_name: 'Lead',
                event_time: Math.floor(Date.now() / 1000),
                event_id: lead.eventId,
                action_source: 'website',
                event_source_url: lead.sourceUrl,
                user_data: userData,
                custom_data: { content_name: lead.region },
            },
        ],
        ...(process.env.META_TEST_EVENT_CODE && { test_event_code: process.env.META_TEST_EVENT_CODE }),
    };

    try {
        const res = await fetch(
            `https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
        );
        if (!res.ok) console.error('메타 전환 API 실패:', res.status, await res.text());
    } catch (e) {
        console.error('메타 전환 API 실패:', e instanceof Error ? e.message : e);
    }
}
