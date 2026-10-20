import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const ASSET_BUCKET = 'assets';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && serviceKey);

let client: SupabaseClient | null = null;

// Service-role client: bypasses RLS, so it must only ever run on the server.
export function supabaseAdmin(): SupabaseClient {
    if (!url || !serviceKey) {
        throw new Error(
            'Supabase가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 확인하세요.',
        );
    }
    client ??= createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    return client;
}
