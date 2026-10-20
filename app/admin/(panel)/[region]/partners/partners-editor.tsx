'use client';

import type { PartnerCategory, PartnerItem } from '@/lib/site-content';
import { ImagePicker } from '../../../_components/image-picker';
import { Card, PageHeader, SaveBar, TextField, buttonClass, inputClass, move, useSectionEditor } from '../../../_components/ui';

function ItemCard({
    item,
    onChange,
    onRemove,
    onMove,
    isFirst,
    isLast,
}: {
    item: PartnerItem;
    onChange: (item: PartnerItem) => void;
    onRemove: () => void;
    onMove: (dir: -1 | 1) => void;
    isFirst: boolean;
    isLast: boolean;
}) {
    return (
        <div className="flex flex-col gap-2 rounded border border-line bg-white p-2">
            <ImagePicker
                src={item.image}
                alt={item.name}
                folder="partners"
                resize={{ maxWidth: 900, maxHeight: 900 }}
                onChange={(image) => onChange({ ...item, image })}
                className="aspect-[3/4] w-full rounded-[2px]"
                imageClassName="object-cover object-top"
                sizes="180px"
            />
            <input
                value={item.name}
                onChange={(e) => onChange({ ...item, name: e.target.value })}
                placeholder="업체명"
                aria-label="업체명"
                className={`${inputClass} px-2 py-1.5 text-sm`}
            />
            <div className="flex gap-1">
                <button type="button" aria-label="앞으로" className={`${buttonClass.secondary} flex-1 px-0 py-1`} disabled={isFirst} onClick={() => onMove(-1)}>←</button>
                <button type="button" aria-label="뒤로" className={`${buttonClass.secondary} flex-1 px-0 py-1`} disabled={isLast} onClick={() => onMove(1)}>→</button>
                <button type="button" className={`${buttonClass.danger} flex-1 px-0 py-1`} onClick={onRemove}>삭제</button>
            </div>
        </div>
    );
}

export function PartnersEditor({ region, initial }: { region: string; initial: PartnerCategory[] }) {
    const editor = useSectionEditor(region, 'partners', initial);
    const categories = editor.value;
    const setCategory = (i: number, patch: Partial<PartnerCategory>) =>
        editor.update(categories.map((c, j) => (j === i ? { ...c, ...patch } : c)));

    return (
        <>
            <PageHeader
                title="제휴업체 목록"
                description="각 줄이 사이트에서 옆으로 흘러가는 업체 목록입니다. 이미지를 클릭하면 새 사진으로 바꿀 수 있습니다."
            />
            <div className="flex flex-col gap-5">
                {categories.map((c, i) => (
                    <Card
                        key={c.id}
                        title={c.label || '(이름 없음)'}
                        actions={
                            <div className="flex gap-1">
                                <button type="button" aria-label="카테고리 위로" className={buttonClass.secondary} disabled={i === 0} onClick={() => editor.update(move(categories, i, i - 1))}>↑</button>
                                <button type="button" aria-label="카테고리 아래로" className={buttonClass.secondary} disabled={i === categories.length - 1} onClick={() => editor.update(move(categories, i, i + 1))}>↓</button>
                                <button type="button" className={buttonClass.danger} onClick={() => editor.update(categories.filter((_, j) => j !== i))}>카테고리 삭제</button>
                            </div>
                        }
                    >
                        <div className="mb-4 grid gap-4 sm:grid-cols-2">
                            <TextField label="카테고리 이름" value={c.label} onChange={(label) => setCategory(i, { label })} />
                            <TextField label="업체 수 표시" value={c.count} onChange={(count) => setCategory(i, { count })} placeholder="예: 453+" />
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
                            {c.items.map((item, j) => (
                                <ItemCard
                                    key={j}
                                    item={item}
                                    isFirst={j === 0}
                                    isLast={j === c.items.length - 1}
                                    onChange={(next) => setCategory(i, { items: c.items.map((x, k) => (k === j ? next : x)) })}
                                    onRemove={() => setCategory(i, { items: c.items.filter((_, k) => k !== j) })}
                                    onMove={(dir) => setCategory(i, { items: move(c.items, j, j + dir) })}
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => setCategory(i, { items: [...c.items, { name: '', image: '' }] })}
                                className="flex aspect-[3/4] cursor-pointer items-center justify-center rounded border border-dashed border-taupe bg-transparent text-sm text-muted hover:bg-sand"
                            >
                                + 업체 추가
                            </button>
                        </div>
                        <p className="mt-3 mb-0 text-xs text-muted">업체명이 비어 있는 항목은 저장 시 제외됩니다.</p>
                    </Card>
                ))}
                <button
                    type="button"
                    className={`${buttonClass.secondary} self-start`}
                    onClick={() =>
                        editor.update([
                            ...categories,
                            { id: `cat-${Date.now().toString(36)}`, label: '새 카테고리', count: '', items: [] },
                        ])
                    }
                >
                    + 카테고리 추가
                </button>
            </div>
            <SaveBar {...editor} />
        </>
    );
}
