import 'server-only';
import { isRegion, regionInfo } from './regions';
import { formatKst } from './reservations';
import type { NewReservation } from './reservations-db';

// Emails the operator about each new reservation through Resend (https://resend.com).
// Set RESEND_API_KEY and NOTIFY_EMAIL (comma-separated for several people); without
// them notifications are skipped. Until a domain is verified in Resend, mail can only
// go to the address the Resend account was created with.

const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function notifyNewReservation(r: NewReservation) {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.NOTIFY_EMAIL?.split(',').map((s) => s.trim()).filter(Boolean);
    if (!apiKey || !to?.length) return;

    const region = isRegion(r.region) ? regionInfo(r.region).label : r.region;
    // Vercel sets this to the production domain when system environment variables are exposed.
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    const rows: [string, string][] = [
        ['지역', region],
        ['이름', r.name],
        ['연락처', r.phone],
        ['결혼 예정', r.wedding_month],
        ['방문 희망일', r.visit_day],
        ['마케팅 동의', r.agree_marketing ? '동의' : '미동의'],
        ['신청 시각', formatKst(new Date().toISOString())],
    ];

    const html = `
<div style="font-family:sans-serif;font-size:15px;color:#2b2326">
  <h2 style="margin:0 0 16px;font-size:18px">${escapeHtml(region)} 웨딩박람회 새 사전예약</h2>
  <table style="border-collapse:collapse">
    ${rows
        .map(
            ([k, v]) =>
                `<tr><td style="padding:6px 16px 6px 0;color:#8a7b7e">${k}</td><td style="padding:6px 0"><b>${escapeHtml(v)}</b></td></tr>`,
        )
        .join('')}
  </table>
  ${host ? `<p style="margin-top:20px"><a href="https://${host}/admin/reservations">관리자에서 신청 명단 보기</a></p>` : ''}
</div>`;

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: process.env.NOTIFY_FROM || '라모르 웨딩박람회 <onboarding@resend.dev>',
                to,
                subject: `[라모르] ${region} 새 사전예약 · ${r.name} (${r.visit_day})`,
                html,
                text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
            }),
        });
        if (!res.ok) console.error('신청 알림 메일 실패:', res.status, await res.text());
    } catch (e) {
        console.error('신청 알림 메일 실패:', e instanceof Error ? e.message : e);
    }
}
