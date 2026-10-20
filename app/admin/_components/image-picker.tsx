'use client';

import Image from 'next/image';
import { useRef, useState, type ReactNode } from 'react';
import { uploadImage } from '../actions';

export type ResizeOptions = {
    maxWidth: number;
    maxHeight: number;
    // width / height; when set, the image is centre-cropped to this ratio first.
    aspect?: number;
};

const MAX_BYTES = 850_000;

// Crop/downscale to WebP in the browser so uploads stay small and fit the Server Action body limit.
async function resizeImage(file: File, { maxWidth, maxHeight, aspect }: ResizeOptions): Promise<Blob> {
    const bitmap = await createImageBitmap(file);
    let sx = 0, sy = 0, sw = bitmap.width, sh = bitmap.height;
    if (aspect) {
        if (sw / sh > aspect) {
            sw = Math.round(sh * aspect);
            sx = Math.round((bitmap.width - sw) / 2);
        } else {
            sh = Math.round(sw / aspect);
            sy = Math.round((bitmap.height - sh) / 2);
        }
    }
    const scale = Math.min(1, maxWidth / sw, maxHeight / sh);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(sw * scale);
    canvas.height = Math.round(sh * scale);
    canvas.getContext('2d')!.drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    for (const quality of [0.86, 0.75, 0.6]) {
        const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', quality));
        if (!blob) throw new Error('이미지 변환 실패');
        if (blob.size <= MAX_BYTES || quality === 0.6) return blob;
    }
    throw new Error('이미지 변환 실패');
}

// Clickable image slot: picks a file, resizes it, uploads it, and reports the new URL.
export function ImagePicker({
    src,
    alt,
    folder,
    resize,
    onChange,
    className,
    imageClassName = 'object-cover',
    sizes,
    empty,
}: {
    src: string;
    alt: string;
    folder: 'partners' | 'hero' | 'reviews';
    resize: ResizeOptions;
    onChange: (url: string) => void;
    className: string;
    imageClassName?: string;
    sizes: string;
    empty?: ReactNode;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const onFile = async (file: File | undefined) => {
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const data = new FormData();
            data.set('folder', folder);
            data.set('file', new File([await resizeImage(file, resize)], 'image.webp', { type: 'image/webp' }));
            const res = await uploadImage(data);
            if (res.ok && res.data) onChange(res.data);
            else if (!res.ok) setError(res.error);
        } catch (e) {
            setError(e instanceof Error ? e.message : '업로드 실패');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`relative cursor-pointer overflow-hidden border-0 bg-parchment p-0 ${className}`}
                aria-label="이미지 변경"
            >
                {src ? (
                    <Image src={src} alt={alt} fill sizes={sizes} unoptimized className={imageClassName} />
                ) : (
                    (empty ?? <span className="text-xs text-muted">이미지 없음</span>)
                )}
                <span className="absolute inset-x-0 bottom-0 bg-ink/60 py-1 text-[11px] text-white">
                    {uploading ? '업로드 중…' : '클릭해서 이미지 변경'}
                </span>
            </button>
            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={(e) => onFile(e.target.files?.[0])}
            />
            {error && <p className="m-0 text-xs text-rose">{error}</p>}
        </div>
    );
}
