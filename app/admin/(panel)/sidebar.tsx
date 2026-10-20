'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { DEFAULT_REGION, isRegion, REGIONS, regionPath, type RegionId } from '@/lib/regions';

const SECTIONS = [
    { slug: 'event', label: '박람회 정보' },
    { slug: 'seats', label: '한정 인원 · 잔여석' },
    { slug: 'hero', label: '메인 이미지' },
    { slug: 'reviews', label: '후기' },
    { slug: 'partners', label: '제휴업체 목록' },
    { slug: 'location', label: '오시는 길 · 지도' },
    { slug: 'form', label: '신청폼 옵션' },
    { slug: 'ticker', label: '상단 신청 알림' },
];

const linkClass = (active: boolean) =>
    `rounded px-3 py-2 text-sm whitespace-nowrap hover:bg-sand hover:text-ink ${
        active ? 'bg-sand font-semibold text-ink' : 'text-body'
    }`;

// Content menus live under /admin/<region>/<section>; the selector swaps the region and keeps the section.
export function Sidebar({ logout }: { logout: () => Promise<void> }) {
    const pathname = usePathname();
    const router = useRouter();
    const [, , first, second] = pathname.split('/');
    const region: RegionId = isRegion(first) ? first : DEFAULT_REGION;
    const section = isRegion(first) ? second : undefined;

    return (
        <aside className="flex flex-none flex-col gap-4 border-b border-line bg-paper px-4 py-4 md:sticky md:top-0 md:h-screen md:w-56 md:overflow-y-auto md:border-r md:border-b-0 md:py-6">
            <div className="flex items-center justify-between md:flex-col md:items-start md:gap-1">
                <Link href="/admin" className="font-display text-base font-semibold tracking-[.18em] text-primary">
                    LAMOUR ADMIN
                </Link>
                <a href={regionPath(region)} target="_blank" rel="noopener noreferrer" className="text-xs text-muted underline">
                    {REGIONS.find((r) => r.id === region)!.label} 페이지 보기 ↗
                </a>
            </div>

            <nav className="flex gap-1 overflow-x-auto md:flex-col">
                <Link href="/admin" className={linkClass(pathname === '/admin')}>대시보드</Link>
                <Link href="/admin/reservations" className={linkClass(pathname.startsWith('/admin/reservations'))}>
                    신청 명단 (DB)
                </Link>
            </nav>

            <div className="flex flex-col gap-2">
                <label className="flex flex-col gap-1 text-xs font-semibold text-muted">
                    지역별 페이지 관리
                    <select
                        value={region}
                        onChange={(e) => router.push(`/admin/${e.target.value}/${section ?? 'event'}`)}
                        className="rounded border border-taupe bg-white px-2 py-2 text-sm font-semibold text-ink"
                    >
                        {REGIONS.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.label} ({regionPath(r.id)})
                            </option>
                        ))}
                    </select>
                </label>
                <nav className="flex gap-1 overflow-x-auto md:flex-col">
                    {SECTIONS.map((s) => (
                        <Link key={s.slug} href={`/admin/${region}/${s.slug}`} className={linkClass(section === s.slug)}>
                            {s.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-3 md:mt-auto">
                <Link href="/admin/password" className="text-xs text-muted underline">
                    비밀번호 변경
                </Link>
                <form action={logout}>
                    <button type="submit" className="cursor-pointer text-xs text-muted underline">
                        로그아웃
                    </button>
                </form>
            </div>
        </aside>
    );
}
