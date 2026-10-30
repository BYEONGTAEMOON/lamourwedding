export const RESERVATION_STATUSES = ['new', 'contacted', 'visited', 'cancelled'] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const STATUS_LABELS: Record<ReservationStatus, string> = {
    new: '신규',
    contacted: '연락완료',
    visited: '방문완료',
    cancelled: '취소',
};

// Where a visitor came from: UTM tags and ad click IDs from the landing URL, plus the
// page they landed on. Captured in the browser, stored with the reservation.
export const SOURCE_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'fbclid',
    'gclid',
    'landing',
] as const;
export type ReservationSource = Partial<Record<(typeof SOURCE_KEYS)[number], string>>;

export function sanitizeSource(v: unknown): ReservationSource {
    if (!v || typeof v !== 'object') return {};
    const out: ReservationSource = {};
    for (const k of SOURCE_KEYS) {
        const x = (v as Record<string, unknown>)[k];
        if (typeof x === 'string' && x.trim()) out[k] = x.trim().slice(0, 300);
    }
    return out;
}

// Short label for the admin list: "facebook · daegu_1024", "메타 광고", "구글 광고" or "".
export function sourceLabel(s: ReservationSource | null | undefined) {
    if (!s) return '';
    const tag = [s.utm_source, s.utm_campaign].filter(Boolean).join(' · ');
    if (tag) return tag;
    if (s.fbclid) return '메타 광고';
    if (s.gclid) return '구글 광고';
    return '';
}

export type Reservation = {
    id: number;
    created_at: string;
    region: string;
    name: string;
    phone: string;
    wedding_month: string;
    visit_day: string;
    agree_marketing: boolean;
    status: ReservationStatus;
    memo: string;
    // Missing on rows saved before the column existed.
    source?: ReservationSource | null;
};

export const PAGE_SIZE = 50;

export const formatKst = (iso: string) =>
    new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(new Date(iso));
