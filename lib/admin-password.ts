import 'server-only';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { promisify } from 'node:util';
import { readJson, updateJson } from './local-store';
import { checkEnvPassword } from './session';
import { isSupabaseConfigured, supabaseAdmin } from './supabase';

// A password changed from the admin replaces ADMIN_PASSWORD. Delete the stored value
// (data/admin-auth.json, or the "admin:password" row in Supabase) to fall back to the env var.

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

const AUTH_FILE = path.join(process.cwd(), 'data', 'admin-auth.json');
const STORAGE_KEY = 'admin:password';

export const MIN_PASSWORD_LENGTH = 8;

// hash format: "scrypt$<salt>$<key>" (base64url)
type StoredPassword = { hash: string; changedAt: number };

async function readStored(): Promise<StoredPassword | null> {
    if (!isSupabaseConfigured) return readJson<StoredPassword | null>(AUTH_FILE, null);

    const { data, error } = await supabaseAdmin()
        .from('site_content')
        .select('value')
        .eq('key', STORAGE_KEY)
        .maybeSingle();
    if (error) throw new Error(error.message);
    return (data?.value as StoredPassword | undefined) ?? null;
}

async function writeStored(value: StoredPassword) {
    if (!isSupabaseConfigured) {
        await updateJson<StoredPassword | null>(AUTH_FILE, null, () => value);
        return;
    }
    const { error } = await supabaseAdmin()
        .from('site_content')
        .upsert({ key: STORAGE_KEY, value, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
}

async function hashPassword(password: string) {
    const salt = randomBytes(16);
    const key = await scryptAsync(password, salt, 64);
    return `scrypt$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

async function matchesHash(password: string, hash: string) {
    const [scheme, salt, key] = hash.split('$');
    if (scheme !== 'scrypt' || !salt || !key) return false;
    const expected = Buffer.from(key, 'base64url');
    const actual = await scryptAsync(password, Buffer.from(salt, 'base64url'), expected.length);
    return timingSafeEqual(actual, expected);
}

export async function checkAdminPassword(input: string) {
    const stored = await readStored();
    return stored ? matchesHash(input, stored.hash) : checkEnvPassword(input);
}

export async function setAdminPassword(password: string) {
    await writeStored({ hash: await hashPassword(password), changedAt: Date.now() });
}

// Sessions issued before this time were created with an old password.
export async function passwordChangedAt() {
    return (await readStored())?.changedAt ?? 0;
}
