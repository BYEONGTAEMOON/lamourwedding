import { isAdmin } from '@/lib/auth';
import { isRegion, regionInfo } from '@/lib/regions';
import { formatKst, STATUS_LABELS, type Reservation } from '@/lib/reservations';
import { allReservations } from '@/lib/reservations-db';

const csvCell = (v: string) => {
    // Prefix formula-like values so spreadsheet apps don't execute them.
    const s = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
    return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
    if (!(await isAdmin())) return new Response('Unauthorized', { status: 401 });

    const params = new URL(request.url).searchParams;
    const filter = {
        q: params.get('q') ?? '',
        status: params.get('status') ?? '',
        region: params.get('region') ?? '',
    };

    let rows: Reservation[];
    try {
        rows = await allReservations(filter);
    } catch (e) {
        return new Response(e instanceof Error ? e.message : 'Error', { status: 500 });
    }

    const header = ['신청일시', '지역', '이름', '연락처', '결혼 예정', '방문 희망일', '마케팅 동의', '상태', '메모'];
    const lines = rows.map((r) =>
        [
            formatKst(r.created_at),
            isRegion(r.region) ? regionInfo(r.region).label : '대구',
            r.name,
            r.phone,
            r.wedding_month,
            r.visit_day,
            r.agree_marketing ? '동의' : '',
            STATUS_LABELS[r.status] ?? r.status,
            r.memo,
        ]
            .map(csvCell)
            .join(','),
    );
    // BOM so Excel opens the Korean text as UTF-8.
    const csv = '\uFEFF' + [header.map(csvCell).join(','), ...lines].join('\r\n');
    const date = new Date().toISOString().slice(0, 10);

    return new Response(csv, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="reservations-${date}.csv"`,
            'Cache-Control': 'no-store',
        },
    });
}
