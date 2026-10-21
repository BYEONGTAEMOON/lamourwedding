import 'server-only';
import { BLOCKLIST_FILE, readJson, updateJson } from './local-store';
import { isSupabaseConfigured, supabaseAdmin } from './supabase';

// Phone numbers the admin blocked from the reservation form. Stored as one JSON
// document: "admin:blocklist" in site_content, or data/blocklist.json locally.

export type BlockedPhone = { phone: string; blockedAt: string };

const STORAGE_KEY = 'admin:blocklist';

const digits = (phone: string) => phone.replace(/\D/g, '');

// "01012345678" → "010-1234-5678", matching how reservations store phones.
export const formatPhone = (phone: string) => {
    const d = digits(phone);
    return d.length === 11
        ? `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
        : `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
};

export const isValidPhone = (phone: string) => /^\d{10,11}$/.test(digits(phone));

export async function listBlocked(): Promise<BlockedPhone[]> {
    if (!isSupabaseConfigured) return readJson<BlockedPhone[]>(BLOCKLIST_FILE, []);
    const { data, error } = await supabaseAdmin()
        .from('site_content')
        .select('value')
        .eq('key', STORAGE_KEY)
        .maybeSingle();
    if (error) throw new Error(error.message);
    return (data?.value as BlockedPhone[] | undefined) ?? [];
}

async function save(list: BlockedPhone[]) {
    if (!isSupabaseConfigured) {
        await updateJson<BlockedPhone[]>(BLOCKLIST_FILE, [], () => list);
        return;
    }
    const { error } = await supabaseAdmin()
        .from('site_content')
        .upsert({ key: STORAGE_KEY, value: list, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
}

export async function isBlocked(phone: string) {
    const d = digits(phone);
    return (await listBlocked()).some((b) => digits(b.phone) === d);
}

export async function blockPhone(phone: string) {
    const list = await listBlocked();
    if (list.some((b) => digits(b.phone) === digits(phone))) return;
    await save([{ phone: formatPhone(phone), blockedAt: new Date().toISOString() }, ...list]);
}

export async function unblockPhone(phone: string) {
    const list = await listBlocked();
    await save(list.filter((b) => digits(b.phone) !== digits(phone)));
}
