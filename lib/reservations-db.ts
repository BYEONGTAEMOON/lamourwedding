import 'server-only';
import { RESERVATIONS_FILE, readJson, updateJson } from './local-store';
import { isRegion } from './regions';
import { RESERVATION_STATUSES, type Reservation, type ReservationStatus } from './reservations';
import { isSupabaseConfigured, supabaseAdmin } from './supabase';

// Reservation storage: Supabase when configured, otherwise data/reservations.json.

export type ReservationFilter = { q?: string; status?: string; region?: string; since?: string };
export type NewReservation = Pick<
    Reservation,
    'region' | 'name' | 'phone' | 'wedding_month' | 'visit_day' | 'agree_marketing' | 'source'
>;
export type ReservationPatch = Partial<Pick<Reservation, 'status' | 'memo'>>;

type LocalStore = { nextId: number; rows: (Reservation & { agree_privacy: boolean })[] };
const EMPTY: LocalStore = { nextId: 1, rows: [] };

const validStatus = (s?: string) =>
    RESERVATION_STATUSES.includes(s as ReservationStatus) ? (s as ReservationStatus) : undefined;

// Search text is reduced to safe characters before it reaches PostgREST.
const cleanQuery = (q?: string) =>
    (q ?? '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().slice(0, 30);

// Phone numbers are stored with hyphens; let "01012345678" match "010-1234-5678".
const phonePattern = (q: string) => {
    const digits = q.replace(/\D/g, '');
    return /^[\d\s-]+$/.test(q) && digits ? digits.split('').join('-?') : null;
};

function supabaseQuery(filter: ReservationFilter) {
    let query = supabaseAdmin()
        .from('reservations')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    const status = validStatus(filter.status);
    if (status) query = query.eq('status', status);
    if (isRegion(filter.region)) query = query.eq('region', filter.region);
    if (filter.since) query = query.gte('created_at', filter.since);

    const q = cleanQuery(filter.q);
    if (q) {
        const pattern = phonePattern(q);
        query = pattern
            ? query.filter('phone', 'imatch', pattern)
            : query.or(`name.ilike.%${q}%,memo.ilike.%${q}%`);
    }
    return query;
}

async function localFiltered(filter: ReservationFilter): Promise<Reservation[]> {
    const { rows } = await readJson(RESERVATIONS_FILE, EMPTY);
    const status = validStatus(filter.status);
    const q = cleanQuery(filter.q);
    const pattern = q ? phonePattern(q) : null;
    const phoneRe = pattern ? new RegExp(pattern) : null;

    return rows
        .filter((r) => !status || r.status === status)
        .filter((r) => !isRegion(filter.region) || (r.region ?? 'daegu') === filter.region)
        .filter((r) => !filter.since || r.created_at >= filter.since)
        .filter((r) => {
            if (!q) return true;
            if (phoneRe) return phoneRe.test(r.phone);
            return r.name.includes(q) || r.memo.includes(q);
        })
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function listReservations(filter: ReservationFilter, from: number, to: number) {
    if (!isSupabaseConfigured) {
        const all = await localFiltered(filter);
        return { rows: all.slice(from, to + 1), count: all.length };
    }
    const { data, count, error } = await supabaseQuery(filter).range(from, to);
    if (error) throw new Error(error.message);
    return { rows: (data ?? []) as Reservation[], count: count ?? 0 };
}

export async function countReservations(filter: ReservationFilter) {
    return (await listReservations(filter, 0, 0)).count;
}

export async function allReservations(filter: ReservationFilter) {
    if (!isSupabaseConfigured) return localFiltered(filter);
    const rows: Reservation[] = [];
    for (let from = 0; ; from += 1000) {
        const { data, error } = await supabaseQuery(filter).range(from, from + 999);
        if (error) throw new Error(error.message);
        rows.push(...((data ?? []) as Reservation[]));
        if (!data || data.length < 1000) return rows;
    }
}

export async function hasRecentReservation(phone: string, region: string, since: string) {
    if (!isSupabaseConfigured) {
        const { rows } = await readJson(RESERVATIONS_FILE, EMPTY);
        return rows.some((r) => r.phone === phone && (r.region ?? 'daegu') === region && r.created_at >= since);
    }
    const { count, error } = await supabaseAdmin()
        .from('reservations')
        .select('id', { count: 'exact', head: true })
        .eq('phone', phone)
        .eq('region', region)
        .gte('created_at', since);
    if (error) throw new Error(error.message);
    return (count ?? 0) > 0;
}

export async function insertReservation(input: NewReservation) {
    if (!isSupabaseConfigured) {
        await updateJson(RESERVATIONS_FILE, EMPTY, ({ nextId, rows }) => ({
            nextId: nextId + 1,
            rows: [
                ...rows,
                {
                    ...input,
                    id: nextId,
                    created_at: new Date().toISOString(),
                    agree_privacy: true,
                    status: 'new' as const,
                    memo: '',
                },
            ],
        }));
        return;
    }
    const { error } = await supabaseAdmin()
        .from('reservations')
        .insert({ ...input, agree_privacy: true });
    // PGRST204: the "source" column hasn't been added yet (supabase/schema.sql). Keep
    // taking reservations without it rather than failing.
    if (error?.code === 'PGRST204' && input.source) {
        const withoutSource = { ...input, agree_privacy: true };
        delete withoutSource.source;
        const retry = await supabaseAdmin().from('reservations').insert(withoutSource);
        if (retry.error) throw new Error(retry.error.message);
        console.error('reservations.source 칸이 없어 광고 출처 없이 저장했습니다. supabase/schema.sql을 실행하세요.');
        return;
    }
    if (error) throw new Error(error.message);
}

export async function updateReservationRow(id: number, patch: ReservationPatch) {
    if (!isSupabaseConfigured) {
        await updateJson(RESERVATIONS_FILE, EMPTY, (store) => ({
            ...store,
            rows: store.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        }));
        return;
    }
    const { error } = await supabaseAdmin().from('reservations').update(patch).eq('id', id);
    if (error) throw new Error(error.message);
}

export async function deleteReservationRow(id: number) {
    if (!isSupabaseConfigured) {
        await updateJson(RESERVATIONS_FILE, EMPTY, (store) => ({
            ...store,
            rows: store.rows.filter((r) => r.id !== id),
        }));
        return;
    }
    const { error } = await supabaseAdmin().from('reservations').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
