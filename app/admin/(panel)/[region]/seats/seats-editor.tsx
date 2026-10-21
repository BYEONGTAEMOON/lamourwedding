'use client';

import type { SiteContent } from '@/lib/site-content';
import {
    Card,
    PageHeader,
    SaveBar,
    TextField,
    buttonClass,
    useSectionEditor,
} from '../../../_components/ui';

export function SeatsEditor({
    region,
    initial,
}: {
    region: string;
    initial: SiteContent['seats'];
}) {
    const editor = useSectionEditor(region, 'seats', initial);
    const { total, left } = editor.value;
    const set = (patch: Partial<SiteContent['seats']>) =>
        editor.update({ ...editor.value, ...patch });
    const pct = total > 0 ? Math.round(((total - left) / total) * 100) : 0;

    return (
        <>
            <PageHeader
                title="한정 인원 · 잔여석"
                description="히어로의 진행 바, 혜택 제목(박람회 등록 N팀에게만), 하단 예약 버튼에 표시됩니다."
            />
            <div className="flex flex-col gap-5">
                <Card>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                            label="박람회 한정 인원 (팀)"
                            type="number"
                            value={total}
                            onChange={(v) => set({ total: Number(v) })}
                        />
                        <div className="flex flex-col gap-1.5">
                            <TextField
                                label="잔여석"
                                type="number"
                                value={left}
                                onChange={(v) => set({ left: Number(v) })}
                            />
                            <div className="flex gap-2">
                                {[-5, -1, 1, 5].map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        className={buttonClass.secondary}
                                        onClick={() =>
                                            set({
                                                left: Math.min(
                                                    total,
                                                    Math.max(0, left + d),
                                                ),
                                            })
                                        }
                                    >
                                        {d > 0 ? `+${d}` : d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {left > total && (
                        <p className="mt-3 mb-0 text-sm text-rose">
                            잔여석이 한정 인원보다 많습니다. 저장 시 한정
                            인원으로 맞춰집니다.
                        </p>
                    )}
                </Card>

                <Card title="미리보기">
                    <div className="flex max-w-[520px] flex-col gap-2.5">
                        <div className="flex justify-between text-[13px] text-body">
                            <span>박람회 {total}팀 한정</span>
                            <span>
                                잔여{' '}
                                <strong className="text-rose">{left}석</strong>
                            </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-[2px] bg-line">
                            <div
                                className="h-full bg-primary"
                                style={{
                                    width: `${Math.min(100, Math.max(0, pct))}%`,
                                }}
                            />
                        </div>
                    </div>
                </Card>
            </div>
            <SaveBar {...editor} />
        </>
    );
}
