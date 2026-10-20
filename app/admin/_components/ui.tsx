'use client';

import { useState, useTransition, type ReactNode } from 'react';
import type { SectionKey, SiteContent } from '@/lib/site-content';
import { saveContent } from '../actions';

export const inputClass =
    'w-full rounded border border-taupe bg-white px-3 py-2 text-[15px] text-ink outline-none focus:border-primary';

export const buttonClass = {
    primary:
        'cursor-pointer rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60',
    secondary:
        'cursor-pointer rounded border border-taupe bg-white px-3 py-2 text-sm text-ink hover:bg-sand disabled:opacity-40',
    danger:
        'cursor-pointer rounded border border-rose/40 bg-white px-3 py-2 text-sm text-rose hover:bg-rose/5 disabled:opacity-40',
};

export function PageHeader({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-6 flex flex-col gap-1">
            <h1 className="m-0 font-serif text-2xl font-normal">{title}</h1>
            {description && <p className="m-0 text-sm text-muted">{description}</p>}
        </div>
    );
}

export function Card({
    title,
    description,
    actions,
    children,
}: {
    title?: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="rounded-md border border-line bg-paper p-5">
            {(title || actions) && (
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        {title && <h2 className="m-0 text-base font-semibold">{title}</h2>}
                        {description && <p className="m-0 text-[13px] text-muted">{description}</p>}
                    </div>
                    {actions}
                </div>
            )}
            {children}
        </section>
    );
}

export function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-body">{label}</span>
            {children}
            {hint && <span className="text-xs text-muted">{hint}</span>}
        </label>
    );
}

export function TextField({
    label,
    hint,
    value,
    onChange,
    placeholder,
    type = 'text',
}: {
    label: string;
    hint?: string;
    value: string | number;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
}) {
    return (
        <Field label={label} hint={hint}>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={inputClass}
            />
        </Field>
    );
}

export function move<T>(list: T[], from: number, to: number): T[] {
    if (to < 0 || to >= list.length) return list;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
}

// Editable list of short strings with reorder / delete / add.
export function StringListEditor({
    items,
    onChange,
    placeholder,
}: {
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                    <input
                        value={item}
                        placeholder={placeholder}
                        onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
                        className={inputClass}
                    />
                    <button type="button" aria-label="위로" className={buttonClass.secondary} disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))}>↑</button>
                    <button type="button" aria-label="아래로" className={buttonClass.secondary} disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))}>↓</button>
                    <button type="button" className={buttonClass.danger} onClick={() => onChange(items.filter((_, j) => j !== i))}>삭제</button>
                </div>
            ))}
            <button type="button" className={`${buttonClass.secondary} self-start`} onClick={() => onChange([...items, ''])}>
                + 항목 추가
            </button>
        </div>
    );
}

// Holds a section's draft value and saves it through the saveContent Server Action.
export function useSectionEditor<K extends SectionKey>(region: string, key: K, initial: SiteContent[K]) {
    const [value, setValue] = useState(initial);
    const [saved, setSaved] = useState(initial);
    const [pending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

    const save = () =>
        startTransition(async () => {
            const res = await saveContent(region, key, value);
            if (res.ok && res.data) {
                setValue(res.data);
                setSaved(res.data);
                setMessage({ ok: true, text: '저장했습니다. 사이트에 바로 반영됩니다.' });
            } else if (!res.ok) {
                setMessage({ ok: false, text: res.error });
            }
        });

    const update = (next: SiteContent[K]) => {
        setValue(next);
        setMessage(null);
    };

    const dirty = JSON.stringify(value) !== JSON.stringify(saved);
    const reset = () => update(saved);

    return { value, update, save, reset, pending, message, dirty };
}

export function SaveBar({
    save,
    reset,
    pending,
    message,
    dirty,
}: {
    save: () => void;
    reset: () => void;
    pending: boolean;
    message: { ok: boolean; text: string } | null;
    dirty: boolean;
}) {
    return (
        <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
            {message ? (
                <span role="status" className={`mr-auto text-sm ${message.ok ? 'text-[#3c7a4a]' : 'text-rose'}`}>
                    {message.text}
                </span>
            ) : (
                dirty && <span className="mr-auto text-sm text-muted">저장하지 않은 변경 사항이 있습니다.</span>
            )}
            <button type="button" className={buttonClass.secondary} disabled={!dirty || pending} onClick={reset}>
                되돌리기
            </button>
            <button type="button" className={buttonClass.primary} disabled={!dirty || pending} onClick={save}>
                {pending ? '저장 중…' : '저장'}
            </button>
        </div>
    );
}
