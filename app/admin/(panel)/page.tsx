import Link from 'next/link';
import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth';
import { getSiteContentFresh } from '@/lib/content';
import { isRegion, REGIONS, regionInfo, regionPath } from '@/lib/regions';
import { formatKst, STATUS_LABELS } from '@/lib/reservations';
import { countReservations, listReservations } from '@/lib/reservations-db';
import { PageHeader } from '../_components/ui';
import { LoadingCard } from './loading-card';

export default function DashboardPage() {
    return (
        <>
            <PageHeader title="대시보드" />
            <Suspense fallback={<LoadingCard />}>
                <Dashboard />
            </Suspense>
        </>
    );
}

// Start of today in Korea, as an ISO timestamp.
function kstTodayStart() {
    const kst = new Date(Date.now() + 9 * 3600_000);
    kst.setUTCHours(0, 0, 0, 0);
    return new Date(kst.getTime() - 9 * 3600_000).toISOString();
}

function Stat({ label, value, href }: { label: string; value: string; href: string }) {
    return (
        <Link href={href} className="flex flex-col gap-1 rounded-md border border-line bg-paper p-5 text-ink hover:border-taupe hover:text-ink">
            <span className="text-[13px] text-muted">{label}</span>
            <span className="font-serif text-3xl">{value}</span>
        </Link>
    );
}

async function Dashboard() {
    await requireAdmin();
    const since = kstTodayStart();
    const [total, fresh, today, { rows: recent }, regions] = await Promise.all([
        countReservations({}),
        countReservations({ status: 'new' }),
        countReservations({ since }),
        listReservations({}, 0, 4),
        Promise.all(
            REGIONS.map(async (r) => ({
                ...r,
                seats: (await getSiteContentFresh(r.id)).seats,
                today: await countReservations({ region: r.id, since }),
                total: await countReservations({ region: r.id }),
            })),
        ),
    ]);

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-3">
                <Stat label="오늘 신청 (전 지역)" value={today.toLocaleString()} href="/admin/reservations" />
                <Stat label="미처리 (신규)" value={fresh.toLocaleString()} href="/admin/reservations?status=new" />
                <Stat label="전체 신청" value={total.toLocaleString()} href="/admin/reservations" />
            </div>

            <section className="overflow-x-auto rounded-md border border-line bg-paper">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-line bg-sand text-left text-xs text-muted">
                            {['지역', '페이지', '오늘 신청', '전체 신청', '잔여석 / 한정', ''].map((h, i) => (
                                <th key={i} className="px-4 py-2.5 font-semibold whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {regions.map((r) => (
                            <tr key={r.id} className="border-b border-line last:border-0">
                                <td className="px-4 py-3 font-semibold">{r.label}</td>
                                <td className="px-4 py-3">
                                    <a href={regionPath(r.id)} target="_blank" rel="noopener noreferrer" className="underline">{regionPath(r.id)}</a>
                                </td>
                                <td className="px-4 py-3">
                                    <Link href={`/admin/reservations?region=${r.id}`} className="text-ink">{r.today.toLocaleString()}</Link>
                                </td>
                                <td className="px-4 py-3">
                                    <Link href={`/admin/reservations?region=${r.id}`} className="text-ink">{r.total.toLocaleString()}</Link>
                                </td>
                                <td className="px-4 py-3">{r.seats.left} / {r.seats.total}</td>
                                <td className="px-4 py-3 text-right">
                                    <Link href={`/admin/${r.id}/event`} className="text-sm underline">편집</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="rounded-md border border-line bg-paper p-5">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="m-0 text-base font-semibold">최근 신청</h2>
                    <Link href="/admin/reservations" className="text-sm underline">전체 보기</Link>
                </div>
                {recent.length ? (
                    <ul className="m-0 flex list-none flex-col p-0 text-sm">
                        {recent.map((r) => (
                            <li key={r.id} className="flex flex-wrap gap-x-4 gap-y-1 border-b border-line py-2.5 last:border-0">
                                <span className="text-muted">{formatKst(r.created_at)}</span>
                                <span className="text-muted">{isRegion(r.region) ? regionInfo(r.region).label : '대구'}</span>
                                <b>{r.name}</b>
                                <span>{r.phone}</span>
                                <span className="text-muted">{r.visit_day} 방문</span>
                                <span className="ml-auto text-xs text-muted">{STATUS_LABELS[r.status]}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="m-0 text-sm text-muted">아직 신청이 없습니다.</p>
                )}
            </section>
        </div>
    );
}
