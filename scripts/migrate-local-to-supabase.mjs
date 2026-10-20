// One-off: copies content saved in local storage mode (data/site-content.json,
// data/uploads/) into Supabase. Keys that already exist in Supabase are skipped,
// so edits made on the deployed admin are never overwritten.
//
//   node --env-file=.env.local scripts/migrate-local-to-supabase.mjs          # dry run
//   node --env-file=.env.local scripts/migrate-local-to-supabase.mjs --apply  # write

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const apply = process.argv.includes('--apply');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
    console.error('.env.local에 NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 넣어 주세요.');
    process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const DATA_DIR = path.join(process.cwd(), 'data');
const TYPES = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' };

const local = JSON.parse(await readFile(path.join(DATA_DIR, 'site-content.json'), 'utf8'));

const { data: existing, error } = await supabase.from('site_content').select('key');
if (error) throw new Error(`site_content 조회 실패: ${error.message}`);
const existingKeys = new Set(existing.map((r) => r.key));

// Uploads to the "assets" bucket under the same folder/name and returns the public URL.
const uploaded = new Map();
async function migrateUpload(localUrl) {
    if (uploaded.has(localUrl)) return uploaded.get(localUrl);
    const rel = localUrl.replace(/^\/uploads\//, '');
    const storage = supabase.storage.from('assets');
    if (apply) {
        const file = await readFile(path.join(DATA_DIR, 'uploads', rel));
        const { error } = await storage.upload(rel, file, {
            contentType: TYPES[path.extname(rel).toLowerCase()],
            cacheControl: '31536000',
            upsert: true,
        });
        if (error) throw new Error(`사진 업로드 실패 (${rel}): ${error.message}`);
    }
    const publicUrl = storage.getPublicUrl(rel).data.publicUrl;
    uploaded.set(localUrl, publicUrl);
    return publicUrl;
}

// Rewrites every "/uploads/..." string inside a section value.
async function rewriteUploads(value) {
    if (typeof value === 'string') return value.startsWith('/uploads/') ? migrateUpload(value) : value;
    if (Array.isArray(value)) return Promise.all(value.map(rewriteUploads));
    if (value && typeof value === 'object') {
        const entries = await Promise.all(
            Object.entries(value).map(async ([k, v]) => [k, await rewriteUploads(v)]),
        );
        return Object.fromEntries(entries);
    }
    return value;
}

const rows = [];
for (const [k, value] of Object.entries(local)) {
    if (existingKeys.has(k)) {
        console.log(`건너뜀 (Supabase에 이미 있음): ${k}`);
        continue;
    }
    rows.push({ key: k, value: await rewriteUploads(value), updated_at: new Date().toISOString() });
    console.log(`${apply ? '옮김' : '옮길 예정'}: ${k}`);
}
for (const [from, to] of uploaded) console.log(`  사진 ${from}\n    → ${to}`);

if (!apply) {
    console.log(`\n확인만 했습니다 (${rows.length}개). 실제로 옮기려면 --apply를 붙여 다시 실행하세요.`);
} else if (rows.length) {
    const { error } = await supabase.from('site_content').insert(rows);
    if (error) throw new Error(`site_content 저장 실패: ${error.message}`);
    console.log(`\n완료: ${rows.length}개 항목을 옮겼습니다. 사이트에 반영하려면 Vercel에서 Redeploy 하세요.`);
}
