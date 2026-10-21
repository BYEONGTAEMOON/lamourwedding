import Link from 'next/link';
import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth';
import { listBlocked } from '@/lib/blocklist';
import { REGIONS } from '@/lib/regions';
import { PAGE_SIZE, RESERVATION_STATUSES, STATUS_LABELS } from '@/lib/reservations';
import { listReservations } from '@/lib/reservations-db';
import { PageHeader } from '../../_components/ui';
import { LoadingCard } from '../loading-card';
import { Blocklist } from './blocklist';
import { ReservationTable } from './reservation-table';

type SearchParams = Promise<{ q?: string; status?: string; region?: string; page?: string }>;

export default function ReservationsPage({ searchParams }: { searchParams: SearchParams }) {
    return (
        <>
            <PageHeader title="신청 명단" description="사전예약 폼으로 접수된 신청 내역입니다. 상태와 메모는 바로 저장됩니다." />
            <Suspense fallback={<LoadingCard />}>
                <Results searchParams={searchParams} />
            </Suspense>
        </>
    );
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
    const { q = '', status = '', region = '', page: pageParam } = await searchParams;

    const page = Math.max(1, Number(pageParam) || 1);
    const from = (page - 1) * PAGE_SIZE;
    // Session check and query run together; nothing renders until requireAdmin() passes.
    const [, { rows, count }, blocked] = await Promise.all([
        requireAdmin(),
        listReservations({ q, status, region }, from, from + PAGE_SIZE - 1),
        listBlocked(),
    ]);
    const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));

    const href = (p: number) => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (status) params.set('status', status);
        if (region) params.set('region', region);
        if (p > 1) params.set('page', String(p));
        const s = params.toString();
        return `/admin/reservations${s ? `?${s}` : ''}`;
    };
    const exportParams = new URLSearchParams({ ...(q && { q }), ...(status && { status }), ...(region && { region }) }).toString();

    return (
        <div className="flex flex-col gap-4">
            <form className="flex flex-wrap items-end gap-2" action="/admin/reservations">
                <input
                    name="q"
                    defaultValue={q}
                    placeholder="이름, 전화번호, 메모 검색"
                    className="min-w-[200px] flex-1 rounded border border-taupe bg-white px-3 py-2 text-[15px] outline-none focus:border-primary"
                />
                <select name="region" defaultValue={region} className="rounded border border-taupe bg-white px-3 py-2 text-[15px]">
                    <option value="">전체 지역</option>
                    {REGIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                            {r.label}
                        </option>
                    ))}
                </select>
                <select name="status" defaultValue={status} className="rounded border border-taupe bg-white px-3 py-2 text-[15px]">
                    <option value="">전체 상태</option>
                    {RESERVATION_STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                        </option>
                    ))}
                </select>
                <button type="submit" className="cursor-pointer rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
                    검색
                </button>
                <a
                    href={`/admin/reservations/export${exportParams ? `?${exportParams}` : ''}`}
                    className="rounded border border-taupe bg-white px-3 py-2 text-sm text-ink hover:bg-sand"
                >
                    엑셀(CSV) 다운로드
                </a>
            </form>

            <p className="m-0 text-sm text-muted">
                총 <b className="text-ink">{count.toLocaleString()}</b>건
                {(q || status || region) && (
                    <>
                        {' '}· <Link href="/admin/reservations" className="underline">필터 해제</Link>
                    </>
                )}
            </p>

            <ReservationTable rows={rows} blocked={blocked.map((b) => b.phone.replace(/\D/g, ''))} />

            {pages > 1 && (
                <nav className="flex items-center justify-center gap-3 text-sm">
                    {page > 1 ? <Link href={href(page - 1)}>← 이전</Link> : <span className="text-muted">← 이전</span>}
                    <span>
                        {page} / {pages}
                    </span>
                    {page < pages ? <Link href={href(page + 1)}>다음 →</Link> : <span className="text-muted">다음 →</span>}
                </nav>
            )}

            <Blocklist list={blocked} />
        </div>
    );
}
