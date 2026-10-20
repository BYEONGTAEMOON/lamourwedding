'use server';

import { randomUUID } from 'node:crypto';
import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { CONTENT_TAG, saveSection } from '@/lib/content';
import { checkAdminPassword, MIN_PASSWORD_LENGTH, setAdminPassword } from '@/lib/admin-password';
import { createSessionToken, SESSION_COOKIE } from '@/lib/session';
import { isRegion } from '@/lib/regions';
import { sanitize, SECTION_KEYS, type SectionKey, type SiteContent } from '@/lib/site-content';
import { RESERVATION_STATUSES, type ReservationStatus } from '@/lib/reservations';
import { saveUpload } from '@/lib/local-store';
import { deleteReservationRow, updateReservationRow, type ReservationPatch } from '@/lib/reservations-db';
import { ASSET_BUCKET, isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export type ActionResult<T = undefined> =
    | { ok: true; data?: T }
    | { ok: false; error: string };

const fail = (e: unknown): { ok: false; error: string } => ({
    ok: false,
    error: e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.',
});

/* ---------- Session ---------- */

async function startSession() {
    const { token, maxAge } = createSessionToken();
    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge,
    });
}

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
    const password = String(formData.get('password') ?? '');
    try {
        if (!(await checkAdminPassword(password))) return '비밀번호가 올바르지 않습니다.';
    } catch (e) {
        return fail(e).error;
    }
    await startSession();
    redirect('/admin');
}

export async function logout() {
    (await cookies()).delete(SESSION_COOKIE);
    redirect('/admin/login');
}

export async function changePassword(
    _prev: ActionResult | null,
    formData: FormData,
): Promise<ActionResult> {
    await requireAdmin();
    const current = String(formData.get('current') ?? '');
    const next = String(formData.get('next') ?? '');
    const confirm = String(formData.get('confirm') ?? '');

    if (next.length < MIN_PASSWORD_LENGTH) {
        return { ok: false, error: `새 비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.` };
    }
    if (next.length > 200) return { ok: false, error: '새 비밀번호가 너무 깁니다.' };
    if (next !== confirm) return { ok: false, error: '새 비밀번호 확인이 일치하지 않습니다.' };
    if (next === current) return { ok: false, error: '현재 비밀번호와 다른 비밀번호를 입력하세요.' };

    try {
        if (!(await checkAdminPassword(current))) return { ok: false, error: '현재 비밀번호가 올바르지 않습니다.' };
        await setAdminPassword(next);
    } catch (e) {
        return fail(e);
    }
    // Older sessions are now invalid; keep this browser signed in with a fresh one.
    await startSession();
    return { ok: true };
}

/* ---------- Site content ---------- */

export async function saveContent<K extends SectionKey>(
    region: string,
    key: K,
    value: SiteContent[K],
): Promise<ActionResult<SiteContent[K]>> {
    await requireAdmin();
    if (!isRegion(region) || !SECTION_KEYS.includes(key)) return { ok: false, error: '잘못된 항목입니다.' };
    try {
        const clean = sanitize[key](value) as SiteContent[K];
        await saveSection(region, key, clean);
        updateTag(CONTENT_TAG);
        return { ok: true, data: clean };
    } catch (e) {
        return fail(e);
    }
}

const IMAGE_TYPES: Record<string, string> = {
    'image/webp': 'webp',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const UPLOAD_FOLDERS = ['partners', 'hero', 'reviews'];

// The browser resizes images before upload, so files stay well under the 1MB action limit.
export async function uploadImage(formData: FormData): Promise<ActionResult<string>> {
    await requireAdmin();
    const folder = String(formData.get('folder') ?? 'partners');
    if (!UPLOAD_FOLDERS.includes(folder)) return { ok: false, error: '잘못된 업로드 위치입니다.' };
    const file = formData.get('file');
    if (!(file instanceof File)) return { ok: false, error: '파일이 없습니다.' };
    const ext = IMAGE_TYPES[file.type];
    if (!ext) return { ok: false, error: 'JPG, PNG, WebP 이미지만 올릴 수 있습니다.' };
    if (file.size > 900_000) return { ok: false, error: '이미지가 너무 큽니다.' };

    try {
        if (!isSupabaseConfigured) return { ok: true, data: await saveUpload(folder, file, ext) };

        const path = `${folder}/${randomUUID()}.${ext}`;
        const storage = supabaseAdmin().storage.from(ASSET_BUCKET);
        const { error } = await storage.upload(path, file, {
            contentType: file.type,
            cacheControl: '31536000',
        });
        if (error) throw new Error(error.message);
        return { ok: true, data: storage.getPublicUrl(path).data.publicUrl };
    } catch (e) {
        return fail(e);
    }
}

/* ---------- Reservations ---------- */

export async function updateReservation(
    id: number,
    patch: { status?: ReservationStatus; memo?: string },
): Promise<ActionResult> {
    await requireAdmin();
    const update: ReservationPatch = {};
    if (patch.status && RESERVATION_STATUSES.includes(patch.status)) update.status = patch.status;
    if (typeof patch.memo === 'string') update.memo = patch.memo.slice(0, 1000);
    if (!Object.keys(update).length) return { ok: true };
    try {
        await updateReservationRow(id, update);
        return { ok: true };
    } catch (e) {
        return fail(e);
    }
}

export async function deleteReservation(id: number): Promise<ActionResult> {
    await requireAdmin();
    try {
        await deleteReservationRow(id);
        return { ok: true };
    } catch (e) {
        return fail(e);
    }
}
