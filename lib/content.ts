import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CONTENT_FILE, readJson, updateJson } from './local-store';
import type { RegionId } from './regions';
import {
    defaultContent,
    SECTION_KEYS,
    sanitize,
    type SectionKey,
    type SiteContent,
} from './site-content';
import { isSupabaseConfigured, supabaseAdmin } from './supabase';

export const CONTENT_TAG = 'site-content';

// Each section is stored under "<region>:<section>", e.g. "busan:location".
const storageKey = (region: RegionId, key: SectionKey) => `${region}:${key}`;

type StoredSections = Record<string, unknown>;

async function readStored(region: RegionId): Promise<StoredSections> {
    if (!isSupabaseConfigured) return readJson<StoredSections>(CONTENT_FILE, {});

    const { data, error } = await supabaseAdmin()
        .from('site_content')
        .select('key, value')
        .like('key', `${region}:%`);
    if (error) {
        console.error('site_content 조회 실패:', error.message);
        return {};
    }
    return Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
}

// Stored sections override the region's defaults one by one; missing or broken ones fall back.
async function readContent(region: RegionId): Promise<SiteContent> {
    const stored = await readStored(region);
    const content = { ...defaultContent(region) };
    for (const key of SECTION_KEYS) {
        const value = stored[storageKey(region, key)];
        if (value !== undefined) Object.assign(content, { [key]: sanitize[key](value) });
    }
    return content;
}

// Public pages: cached in the static shell until an admin save calls updateTag(CONTENT_TAG).
export async function getSiteContent(region: RegionId): Promise<SiteContent> {
    'use cache';
    cacheLife('max');
    cacheTag(CONTENT_TAG);
    return readContent(region);
}

// Admin editors: always read the latest stored values.
export const getSiteContentFresh = readContent;

// When a region's content was last saved from the admin (ISO time), for RSS pubDate and
// sitemap lastmod. Null in local storage mode or before anything was saved.
export async function getContentUpdatedAt(region: RegionId): Promise<string | null> {
    'use cache';
    cacheLife('max');
    cacheTag(CONTENT_TAG);
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabaseAdmin()
        .from('site_content')
        .select('updated_at')
        .like('key', `${region}:%`)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error) {
        console.error('site_content 수정 시각 조회 실패:', error.message);
        return null;
    }
    return data?.updated_at ?? null;
}

export async function saveSection<K extends SectionKey>(
    region: RegionId,
    key: K,
    value: SiteContent[K],
) {
    const id = storageKey(region, key);
    if (!isSupabaseConfigured) {
        await updateJson<StoredSections>(CONTENT_FILE, {}, (data) => ({ ...data, [id]: value }));
        return;
    }
    const { error } = await supabaseAdmin()
        .from('site_content')
        .upsert({ key: id, value, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
}
