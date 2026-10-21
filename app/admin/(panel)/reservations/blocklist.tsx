'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { BlockedPhone } from '@/lib/blocklist';
import { formatKst } from '@/lib/reservations';
import { setPhoneBlocked } from '../../actions';
import { buttonClass, Card, inputClass } from '../../_components/ui';

// Blocked numbers can still submit the form and see the success screen, but nothing is saved.
export function Blocklist({ list }: { list: BlockedPhone[] }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const run = (target: string, blocked: boolean, after?: () => void) =>
        startTransition(async () => {
            const res = await setPhoneBlocked(target, blocked);
            if (!res.ok) return setError(res.error);
            setError('');
            after?.();
            router.refresh();
        });

    return (
        <Card
            title={`차단 목록 (${list.length})`}
            description="차단한 번호로 신청하면 신청자에게는 접수 완료로 보이지만 명단에 저장되지 않습니다."
        >
            <form
                className="mb-4 flex flex-wrap gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    run(phone, true, () => setPhone(''));
                }}
            >
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="numeric"
                    placeholder="010-1234-5678"
                    aria-label="차단할 번호"
                    className={`${inputClass} max-w-[220px]`}
                />
                <button type="submit" disabled={pending || !phone.trim()} className={buttonClass.secondary}>
                    번호 차단
                </button>
            </form>
            {error && <p className="m-0 mb-3 text-sm text-rose">{error}</p>}
            {list.length ? (
                <ul className={`m-0 flex list-none flex-col p-0 text-sm ${pending ? 'opacity-60' : ''}`}>
                    {list.map((b) => (
                        <li key={b.phone} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line py-2.5 last:border-0">
                            <b>{b.phone}</b>
                            <span className="text-xs text-muted">{formatKst(b.blockedAt)} 차단</span>
                            <button
                                type="button"
                                className="ml-auto cursor-pointer text-xs text-muted underline"
                                onClick={() => run(b.phone, false)}
                            >
                                차단 해제
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="m-0 text-sm text-muted">차단한 번호가 없습니다.</p>
            )}
        </Card>
    );
}
