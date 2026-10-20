'use client';

import type { Review } from '@/lib/site-content';
import { ImagePicker } from '../../../_components/image-picker';
import { Card, Field, PageHeader, SaveBar, TextField, buttonClass, inputClass, move, useSectionEditor } from '../../../_components/ui';

export function ReviewsEditor({ region, initial }: { region: string; initial: Review[] }) {
    const editor = useSectionEditor(region, 'reviews', initial);
    const reviews = editor.value;
    const set = (i: number, patch: Partial<Review>) =>
        editor.update(reviews.map((r, j) => (j === i ? { ...r, ...patch } : r)));

    return (
        <>
            <PageHeader
                title="후기"
                description="후기 섹션 아래 카드 슬라이드입니다. 컴퓨터에서 3개 이상이면 5초마다 자동으로 넘어갑니다. 사진은 선택이며, 없으면 글만 표시됩니다. 실제 고객이 동의한 후기만 올려 주세요."
            />
            <div className="flex flex-col gap-4">
                {reviews.map((r, i) => (
                    <Card
                        key={i}
                        title={`후기 ${i + 1}`}
                        actions={
                            <div className="flex gap-1">
                                <button type="button" aria-label="위로" className={buttonClass.secondary} disabled={i === 0} onClick={() => editor.update(move(reviews, i, i - 1))}>↑</button>
                                <button type="button" aria-label="아래로" className={buttonClass.secondary} disabled={i === reviews.length - 1} onClick={() => editor.update(move(reviews, i, i + 1))}>↓</button>
                                <button type="button" className={buttonClass.danger} onClick={() => editor.update(reviews.filter((_, j) => j !== i))}>삭제</button>
                            </div>
                        }
                    >
                        <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                            <div className="flex flex-col gap-1">
                                <ImagePicker
                                    src={r.image}
                                    alt=""
                                    folder="reviews"
                                    resize={{ maxWidth: 900, maxHeight: 900 }}
                                    onChange={(image) => set(i, { image })}
                                    className="aspect-square w-full rounded"
                                    sizes="160px"
                                    empty={<span className="text-xs text-muted">사진 없음 (선택)</span>}
                                />
                                {r.image && (
                                    <button type="button" className="cursor-pointer text-xs text-muted underline" onClick={() => set(i, { image: '' })}>
                                        사진 빼기
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <Field label="후기 내용">
                                    <textarea
                                        value={r.text}
                                        rows={3}
                                        onChange={(e) => set(i, { text: e.target.value })}
                                        className={`${inputClass} resize-y`}
                                    />
                                </Field>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField label="강조 문구 (굵게, 내용 뒤에 붙음)" value={r.bold} onChange={(bold) => set(i, { bold })} />
                                    <TextField label="작성자 · 날짜" value={r.author} onChange={(author) => set(i, { author })} placeholder="예: 김O은 · 이O호 — 2026년 3월" />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                <button
                    type="button"
                    className={`${buttonClass.secondary} self-start`}
                    onClick={() => editor.update([...reviews, { text: '', bold: '', author: '', image: '' }])}
                >
                    + 후기 추가
                </button>
                <p className="m-0 text-xs text-muted">내용과 강조 문구가 모두 비어 있는 후기는 저장 시 제외됩니다.</p>
            </div>
            <SaveBar {...editor} />
        </>
    );
}
