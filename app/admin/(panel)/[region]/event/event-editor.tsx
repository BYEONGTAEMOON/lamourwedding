'use client';

import type { SiteContent } from '@/lib/site-content';
import { Card, Field, PageHeader, SaveBar, TextField, inputClass, useSectionEditor } from '../../../_components/ui';

type Event = SiteContent['event'];

export function EventEditor({ region, initial }: { region: string; initial: Event }) {
    const editor = useSectionEditor(region, 'event', initial);
    const ev = editor.value;
    const set = (key: keyof Event) => (v: string) => editor.update({ ...ev, [key]: v });

    return (
        <>
            <PageHeader
                title="박람회 정보"
                description="상단 로고 글자, 첫 화면 제목·소개 문구, 박람회 날짜입니다. 장소는 '오시는 길 · 지도'에서 바꿉니다."
            />
            <div className="flex flex-col gap-5">
                <Card title="첫 화면 제목">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField label="상단 로고 글자" value={ev.brand} onChange={set('brand')} placeholder="예: BUSAN LAMOUR" />
                        <TextField label="제목 위 작은 영문" value={ev.eyebrow} onChange={set('eyebrow')} />
                        <TextField label="제목 1줄" value={ev.titleLine1} onChange={set('titleLine1')} placeholder="예: 부산 롯데백화점" />
                        <div className="grid grid-cols-2 gap-3">
                            <TextField label="제목 2줄 (강조색)" value={ev.titleAccent} onChange={set('titleAccent')} />
                            <TextField label="제목 2줄 (나머지)" value={ev.titleRest} onChange={set('titleRest')} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Field label="소개 문구" hint="줄바꿈한 그대로 표시됩니다.">
                            <textarea value={ev.subtitle} rows={2} onChange={(e) => set('subtitle')(e.target.value)} className={`${inputClass} resize-y`} />
                        </Field>
                    </div>
                </Card>

                <Card title="날짜">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField label="박람회 날짜" value={ev.dateMain} onChange={set('dateMain')} placeholder="예: 10.24 (토) – 10.25 (일)" />
                        <TextField label="운영 시간" value={ev.dateSub} onChange={set('dateSub')} placeholder="예: 주말 10:00 – 20:00" />
                    </div>
                    <p className="mt-3 mb-0 text-xs text-muted">신청폼의 방문 희망일 선택지는 &apos;신청폼 옵션&apos;에서 함께 바꿔 주세요.</p>
                </Card>

                <Card title="미리보기">
                    <div className="flex flex-col gap-2">
                        <div className="font-display text-sm font-semibold tracking-[.18em] text-primary">{ev.brand}</div>
                        <div className="font-display text-[11px] tracking-[.32em] text-mauve">{ev.eyebrow}</div>
                        <div className="font-serif text-3xl leading-[1.2]">
                            {ev.titleLine1}
                            <br />
                            <span className="font-medium text-primary">{ev.titleAccent}</span> {ev.titleRest}
                        </div>
                        <p className="m-0 text-sm whitespace-pre-line text-body">{ev.subtitle}</p>
                        <p className="m-0 text-sm">
                            <b>{ev.dateMain}</b> {ev.dateSub && <span className="text-muted">· {ev.dateSub}</span>}
                        </p>
                    </div>
                </Card>
            </div>
            <SaveBar {...editor} />
        </>
    );
}
