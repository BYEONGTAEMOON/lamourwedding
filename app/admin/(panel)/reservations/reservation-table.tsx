'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { formatKst, RESERVATION_STATUSES, STATUS_LABELS, type Reservation, type ReservationStatus } from '@/lib/reservations';
import { isRegion, regionInfo } from '@/lib/regions';
import { deleteReservation, setPhoneBlocked, updateReservation } from '../../actions';

const STATUS_STYLES: Record<ReservationStatus, string> = {
    new: 'bg-petal/30 text-primary-dark',
    contacted: 'bg-[#e8eefb] text-[#2f4f8a]',
    visited: 'bg-[#e4f2e7] text-[#2f6b3c]',
    cancelled: 'bg-line text-muted',
};

function Row({ r, blocked }: { r: Reservation; blocked: boolean }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [status, setStatus] = useState(r.status);
    const [memo, setMemo] = useState(r.memo);
    const [confirming, setConfirming] = useState<'delete' | 'block' | null>(null);
    const [error, setError] = useState('');

    const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
        startTransition(async () => {
            const res = await fn();
            if (!res.ok) setError(res.error ?? '저장 실패');
            else {
                setError('');
                router.refresh();
            }
        });

    return (
        <tr className={`border-b border-line align-top ${pending ? 'opacity-60' : ''}`}>
            <td className="px-3 py-2.5 whitespace-nowrap text-muted">{formatKst(r.created_at)}</td>
            <td className="px-3 py-2.5 whitespace-nowrap">{isRegion(r.region) ? regionInfo(r.region).label : '대구'}</td>
            <td className="px-3 py-2.5 font-semibold whitespace-nowrap">{r.name}</td>
            <td className="px-3 py-2.5 whitespace-nowrap">
                <a href={`tel:${r.phone.replace(/\D/g, '')}`} className="text-ink">{r.phone}</a>
                {blocked && <span className="ml-1.5 rounded bg-ink px-1.5 py-0.5 text-[11px] font-semibold text-white">차단됨</span>}
            </td>
            <td className="px-3 py-2.5 whitespace-nowrap">{r.wedding_month}</td>
            <td className="px-3 py-2.5 whitespace-nowrap">{r.visit_day}</td>
            <td className="px-3 py-2.5 text-center">{r.agree_marketing ? '동의' : '-'}</td>
            <td className="px-3 py-2.5">
                <select
                    value={status}
                    aria-label="상태"
                    onChange={(e) => {
                        const next = e.target.value as ReservationStatus;
                        setStatus(next);
                        run(() => updateReservation(r.id, { status: next }));
                    }}
                    className={`rounded border-0 px-2 py-1 text-[13px] font-semibold ${STATUS_STYLES[status]}`}
                >
                    {RESERVATION_STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                        </option>
                    ))}
                </select>
            </td>
            <td className="min-w-[180px] px-3 py-2.5">
                <input
                    value={memo}
                    aria-label="메모"
                    placeholder="메모"
                    onChange={(e) => setMemo(e.target.value)}
                    onBlur={() => memo !== r.memo && run(() => updateReservation(r.id, { memo }))}
                    className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-[13px] outline-none hover:border-taupe focus:border-primary focus:bg-white"
                />
                {error && <p className="m-0 mt-1 text-xs text-rose">{error}</p>}
            </td>
            <td className="px-3 py-2.5 whitespace-nowrap">
                {confirming ? (
                    <span className="flex items-center gap-1">
                        <span className="text-xs text-muted">{confirming === 'delete' ? '삭제할까요?' : '이 번호를 차단할까요?'}</span>
                        <button
                            type="button"
                            className="cursor-pointer rounded bg-rose px-2 py-1 text-xs text-white"
                            onClick={() => {
                                setConfirming(null);
                                run(() => (confirming === 'delete' ? deleteReservation(r.id) : setPhoneBlocked(r.phone, true)));
                            }}
                        >
                            {confirming === 'delete' ? '삭제' : '차단'}
                        </button>
                        <button type="button" className="cursor-pointer rounded border border-taupe bg-white px-2 py-1 text-xs" onClick={() => setConfirming(null)}>
                            취소
                        </button>
                    </span>
                ) : (
                    <span className="flex gap-3">
                        {blocked ? (
                            <button type="button" className="cursor-pointer text-xs text-muted underline" onClick={() => run(() => setPhoneBlocked(r.phone, false))}>
                                차단 해제
                            </button>
                        ) : (
                            <button type="button" className="cursor-pointer text-xs text-muted underline" onClick={() => setConfirming('block')}>
                                차단
                            </button>
                        )}
                        <button type="button" className="cursor-pointer text-xs text-muted underline" onClick={() => setConfirming('delete')}>
                            삭제
                        </button>
                    </span>
                )}
            </td>
        </tr>
    );
}

// `blocked` holds the blocked phone numbers as digits only.
export function ReservationTable({ rows, blocked }: { rows: Reservation[]; blocked: string[] }) {
    if (!rows.length) {
        return <p className="rounded-md border border-line bg-paper p-8 text-center text-sm text-muted">신청 내역이 없습니다.</p>;
    }
    return (
        <div className="overflow-x-auto rounded-md border border-line bg-paper">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-line bg-sand text-left text-xs text-muted">
                        {['신청일시', '지역', '이름', '연락처', '결혼 예정', '방문 희망일', '마케팅', '상태', '메모', ''].map((h, i) => (
                            <th key={i} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <Row key={r.id} r={r} blocked={blocked.includes(r.phone.replace(/\D/g, ''))} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
