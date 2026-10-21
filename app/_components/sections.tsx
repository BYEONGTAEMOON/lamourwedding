// Building blocks shared by the region landing pages and the "/" overview.
import Link from 'next/link';
import { REGIONS, regionPath } from '@/lib/regions';
import { BENEFITS, WHY } from '../_content';

// Schema.org data for search engines; `<` is escaped so content can't close the tag.
export function JsonLd({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
    );
}

// Sticky top bar. On phones the section links scroll sideways on a second row
// so the bar stays two rows tall instead of wrapping into three.
export function SiteHeader({
    brand,
    nav,
    ctaHref,
}: {
    brand: string;
    nav: { href: string; label: string }[];
    ctaHref: string;
}) {
    return (
        <header className="sticky top-0 z-20 border-b border-line bg-cream/90 backdrop-blur-[10px]">
            <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-3.5">
                <a href="#top" className="order-1 flex items-baseline gap-2.5 text-ink">
                    <span className="font-display text-[17px] font-semibold tracking-[.14em] text-primary sm:text-xl sm:tracking-[.18em]">
                        {brand}
                    </span>
                    <span className="hidden font-serif text-[13px] text-muted sm:inline">
                        웨딩박람회
                    </span>
                </a>
                <nav
                    aria-label="페이지 내 이동"
                    className="order-3 flex w-full gap-[22px] overflow-x-auto text-sm whitespace-nowrap [scrollbar-width:none] md:order-2 md:w-auto"
                >
                    {nav.map((n) => (
                        <a key={n.href} href={n.href} className="py-1 text-body">
                            {n.label}
                        </a>
                    ))}
                </nav>
                <a
                    href={ctaHref}
                    className="order-2 rounded-full bg-primary px-[18px] py-2.5 text-sm font-semibold text-white hover:bg-primary-dark hover:text-white md:order-3"
                >
                    사전예약
                </a>
            </div>
        </header>
    );
}

export function Eyebrow({
    children,
    className = 'text-gold',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`font-display text-[13px] tracking-[.3em] ${className}`}
        >
            {children}
        </div>
    );
}

export function SectionTitle({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h2
            className={`m-0 font-serif text-[clamp(30px,3.6vw,42px)] leading-[1.3] font-normal ${className}`}
        >
            {children}
        </h2>
    );
}

export function WhySection() {
    return (
        <section className="bg-petal text-petal-ink">
            <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-10 px-6 py-[72px]">
                <div className="flex flex-col gap-3">
                    <Eyebrow className="text-petal-body">WHY LAMOUR</Eyebrow>
                    <h2 className="m-0 font-serif text-[26px] leading-[1.45] font-normal text-petal-ink">
                        리뉴얼 된
                        <br />
                        라모르 웨딩컨설팅
                    </h2>
                </div>
                {WHY.map((w) => (
                    <div
                        key={w.title}
                        className="flex flex-col gap-2.5 border-t border-petal-ink/20 pt-5"
                    >
                        <div className="font-serif text-4xl text-petal-ink">
                            {w.highlight ? (
                                <>
                                    {w.stat.replace(w.highlight, '')}
                                    <span className="text-white">
                                        {w.highlight}
                                    </span>
                                </>
                            ) : (
                                w.stat
                            )}
                        </div>
                        <div className="font-semibold text-petal-ink">
                            {w.title}
                        </div>
                        <div className="text-sm leading-[1.7] text-petal-body">
                            {w.desc}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function BenefitsSection({ title }: { title: React.ReactNode }) {
    return (
        <section id="benefits" className="border-b border-line bg-paper">
            <div className="mx-auto max-w-[1100px] px-6 py-24">
                <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                    <div className="flex flex-col gap-3.5">
                        <Eyebrow>THIS WEEK ONLY</Eyebrow>
                        <SectionTitle>{title}</SectionTitle>
                    </div>
                    <p className="m-0 max-w-[340px] text-[15px] leading-[1.7] text-muted">
                        사전등록만으로 아래 다섯 가지 혜택이 모두 적용됩니다.
                    </p>
                </div>

                <div className="flex flex-col border-t border-ink">
                    {BENEFITS.map((b, i) => (
                        <div
                            key={b.title}
                            className="grid grid-cols-1 gap-y-3 border-b border-line py-7 sm:grid-cols-[minmax(150px,220px)_minmax(0,1fr)] sm:items-baseline sm:gap-x-10 sm:gap-y-6 sm:py-8"
                        >
                            <div className="font-serif text-[28px] text-primary">
                                {b.value}
                            </div>
                            <div className="flex flex-col gap-2.5">
                                <h3 className="m-0 font-serif text-xl font-normal">
                                    <span className="mr-3 font-display text-sm text-gold">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    {b.title}
                                </h3>
                                <div className="text-[15px] leading-[1.7] break-keep text-body">
                                    {b.details.map(([label, bold], j) => (
                                        <span key={label}>
                                            {j > 0 && ' · '}
                                            {label}
                                            {bold && (
                                                <>
                                                    {' '}
                                                    <b className="text-ink">
                                                        {bold}
                                                    </b>
                                                </>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function SiteFooter() {
    return (
        <footer className="bg-petal text-[13px] leading-[1.8] text-petal-body">
            <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-6 px-6 pt-12 pb-[120px]">
                <div className="flex flex-col gap-3">
                    <div className="font-display text-lg tracking-[.18em] text-petal-ink">
                        LAMOUR
                    </div>
                    {/* Every fair page links to the others and to the overview. */}
                    <nav aria-label="지역별 웨딩박람회">
                        <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
                            <li>
                                <Link href="/" className="text-petal-ink hover:text-petal-ink">
                                    전체 박람회 일정
                                </Link>
                            </li>
                            {REGIONS.map((r) => (
                                <li key={r.id}>
                                    <Link href={regionPath(r.id)} className="text-petal-ink hover:text-petal-ink">
                                        {r.label} 웨딩박람회
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div>
                    (주)라모르웨딩 주식회사 · 사업자등록번호 112-86-03487 ·
                    부산광역시 연제구 법원로8번길 10
                    <br />
                    <a
                        href="#top"
                        className="text-petal-ink underline hover:text-petal-ink"
                    >
                        개인정보처리방침
                    </a>{' '}
                    · © 2026 Lamour Wedding Convention.
                    <div>designed by {'dfill'}</div>
                </div>
            </div>
        </footer>
    );
}
