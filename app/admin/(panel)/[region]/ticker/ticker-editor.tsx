'use client';

import { useState } from 'react';
import { randomTickerEntries, tickerText, type SiteContent, type TickerEntry } from '@/lib/site-content';
import { Card, PageHeader, SaveBar, buttonClass, inputClass, move, useSectionEditor } from '../../../_components/ui';

export function TickerEditor({ region, initial }: { region: string; initial: SiteContent['ticker'] }) {
    const editor = useSectionEditor(region, 'ticker', initial);
    const { enabled, entries } = editor.value;
    const [count, setCount] = useState(5);

    const setEntries = (next: TickerEntry[]) => editor.update({ ...editor.value, entries: next });
    const setEntry = (i: number, patch: Partial<TickerEntry>) =>
        setEntries(entries.map((e, j) => (j === i ? { ...e, ...patch } : e)));

    return (
        <>
            <PageHeader
                title="상단 신청 알림"
                description="페이지 맨 위 띠에 3.2초마다 한 줄씩 돌아가며 표시됩니다."
            />
            <div className="flex flex-col gap-5">
                <Card>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => editor.update({ ...editor.value, enabled: e.target.checked })}
                            className="size-[18px] accent-primary"
                        />
                        사이트에 신청 알림 띠 표시
                    </label>
                </Card>

                <Card
                    title={`알림 목록 (${entries.length}개)`}
                    description="이름은 가운데 글자를 O로 가린 형태로 입력하세요. 예: 김O민"
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="number"
                                min={1}
                                max={30}
                                value={count}
                                onChange={(e) => setCount(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
                                className={`${inputClass} w-20`}
                                aria-label="생성 개수"
                            />
                            <button type="button" className={buttonClass.secondary} onClick={() => setEntries([...entries, ...randomTickerEntries(count)])}>
                                랜덤 추가
                            </button>
                            <button type="button" className={buttonClass.secondary} onClick={() => setEntries(randomTickerEntries(count))}>
                                랜덤으로 교체
                            </button>
                        </div>
                    }
                >
                    <div className="flex flex-col gap-2">
                        <div className="hidden grid-cols-[1fr_1fr_1fr_auto] gap-2 px-1 text-xs font-semibold text-muted sm:grid">
                            <span>이름</span>
                            <span>휴대폰 끝 4자리</span>
                            <span>시간 표시</span>
                            <span className="w-[164px]" />
                        </div>
                        {entries.map((e, i) => (
                            <div key={i} className="grid grid-cols-2 gap-2 border-b border-line pb-2 sm:grid-cols-[1fr_1fr_1fr_auto] sm:border-0 sm:pb-0">
                                <input value={e.name} onChange={(ev) => setEntry(i, { name: ev.target.value })} className={inputClass} placeholder="김O민" aria-label="이름" />
                                <input value={e.phone4} inputMode="numeric" maxLength={4} onChange={(ev) => setEntry(i, { phone4: ev.target.value.replace(/\D/g, '') })} className={inputClass} placeholder="1234" aria-label="휴대폰 끝 4자리" />
                                <input value={e.ago} onChange={(ev) => setEntry(i, { ago: ev.target.value })} className={inputClass} placeholder="3분 전" aria-label="시간 표시" />
                                <div className="flex gap-1">
                                    <button type="button" aria-label="위로" className={buttonClass.secondary} disabled={i === 0} onClick={() => setEntries(move(entries, i, i - 1))}>↑</button>
                                    <button type="button" aria-label="아래로" className={buttonClass.secondary} disabled={i === entries.length - 1} onClick={() => setEntries(move(entries, i, i + 1))}>↓</button>
                                    <button type="button" className={buttonClass.danger} onClick={() => setEntries(entries.filter((_, j) => j !== i))}>삭제</button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className={`${buttonClass.secondary} self-start`}
                            onClick={() => setEntries([...entries, { name: '', phone4: '', ago: '방금 전' }])}
                        >
                            + 직접 추가
                        </button>
                    </div>
                </Card>

                {entries.length > 0 && (
                    <Card title="미리보기">
                        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                            {entries.slice(0, 8).map((e, i) => (
                                <li key={i} className="rounded bg-petal px-4 py-2 text-[13px] text-petal-ink">
                                    {tickerText({ ...e, phone4: e.phone4.padStart(4, '0') })}
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
            </div>
            <SaveBar {...editor} />
        </>
    );
}
