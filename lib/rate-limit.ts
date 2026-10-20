import 'server-only';
import { headers } from 'next/headers';
import { RATE_LIMIT_FILE, readJson, updateJson } from './local-store';
import { isSupabaseConfigured, supabaseAdmin } from './supabase';

// Sliding-window attempt counters per client, one JSON document per bucket:
// "ratelimit:<bucket>" in site_content, or data/rate-limits.json locally.
// Concurrent writes can drop an attempt now and then; that's fine for slowing
// down password guessing and form spam.

export type Rule = { limit: number; windowMs: number };
type Attempts = Record<string, number[]>; // client key -> attempt times (ms)
type LocalFile = Record<string, Attempts>;

const storageKey = (bucket: string) => `ratelimit:${bucket}`;

async function read(bucket: string): Promise<Attempts> {
    if (!isSupabaseConfigured) return (await readJson<LocalFile>(RATE_LIMIT_FILE, {}))[bucket] ?? {};
    const { data, error } = await supabaseAdmin()
        .from('site_content')
        .select('value')
        .eq('key', storageKey(bucket))
        .maybeSingle();
    if (error) throw new Error(error.message);
    return (data?.value as Attempts | undefined) ?? {};
}

async function write(bucket: string, attempts: Attempts) {
    if (!isSupabaseConfigured) {
        await updateJson<LocalFile>(RATE_LIMIT_FILE, {}, (all) => ({ ...all, [bucket]: attempts }));
        return;
    }
    const { error } = await supabaseAdmin()
        .from('site_content')
        .upsert({ key: storageKey(bucket), value: attempts, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
}

// Drops attempts older than the window so the document stays small.
const prune = (attempts: Attempts, windowMs: number) => {
    const since = Date.now() - windowMs;
    return Object.fromEntries(
        Object.entries(attempts)
            .map(([k, times]) => [k, times.filter((t) => t > since)] as const)
            .filter(([, times]) => times.length),
    );
};

export async function isLimited(bucket: string, client: string, { limit, windowMs }: Rule) {
    return (prune(await read(bucket), windowMs)[client]?.length ?? 0) >= limit;
}

export async function recordAttempt(bucket: string, client: string, { windowMs }: Rule) {
    const attempts = prune(await read(bucket), windowMs);
    await write(bucket, { ...attempts, [client]: [...(attempts[client] ?? []), Date.now()] });
}

export async function clearAttempts(bucket: string, client: string) {
    const attempts = await read(bucket);
    if (!(client in attempts)) return;
    delete attempts[client];
    await write(bucket, attempts);
}

// Vercel sets x-forwarded-for itself, so the first entry is the visitor's address.
export async function clientIp() {
    const h = await headers();
    return h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
}
