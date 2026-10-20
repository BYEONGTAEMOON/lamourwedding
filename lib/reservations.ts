export const RESERVATION_STATUSES = ['new', 'contacted', 'visited', 'cancelled'] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const STATUS_LABELS: Record<ReservationStatus, string> = {
    new: '신규',
    contacted: '연락완료',
    visited: '방문완료',
    cancelled: '취소',
};

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
