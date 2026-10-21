import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Faq } from './_components/faq';
import { BenefitsSection, Eyebrow, JsonLd, SectionTitle, SiteFooter, SiteHeader, WhySection } from './_components/sections';
// Static imports carry a content hash, so replacing the file always shows the new image.
import heroImage from '@/public/assets/hero.png';
import coupleImage from '@/public/assets/review-main.png';
import { getSiteContent } from '@/lib/content';
import { REGIONS, regionPath } from '@/lib/regions';
import { homeJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    title: '라모르 웨딩박람회 | 대구·부산·포항·김해',
    description:
        '대구·부산·포항·김해 웨딩박람회 일정과 혜택을 확인하세요. 웨딩홀, 스드메, 허니문, 예물 등 결혼 준비 상담과 다양한 웨딩 혜택을 라모르 웨딩박람회에서 만나보세요.',
    path: '/',
    ogDescription: '대구·부산·포항·김해 웨딩박람회 일정, 참가 신청 및 결혼 준비 혜택을 확인하세요.',
});

const NAV = [
    { href: '#regions', label: '지역별 일정' },
    { href: '#benefits', label: '혜택' },
    { href: '#faq', label: '자주 묻는 질문' },
];

// Start date from "10.24 (토) – 10.25 (일)", or null while the date is "일정 추후 안내".
const startDate = (dateMain: string) => dateMain.match(/(\d{1,2})\.(\d{1,2})/);

// Fairs sort by start date (10.24 → 1024); undated ones go last.
const dateKey = (dateMain: string) => {
    const m = startDate(dateMain);
    return m ? Number(m[1]) * 100 + Number(m[2]) : Infinity;
};

async function loadFairs() {
    const fairs = await Promise.all(
        REGIONS.map(async (r) => ({ ...r, ...(await getSiteContent(r.id)) })),
    );
    return fairs.sort((a, b) => dateKey(a.event.dateMain) - dateKey(b.event.dateMain));
}

export default async function Home() {
    const fairs = await loadFairs();

    return (
        <div className="min-h-screen bg-cream">
            <SiteHeader brand="LAMOUR" nav={NAV} ctaHref="#regions" />
            <JsonLd data={homeJsonLd()} />

            <main>

            {/* Hero */}
            <section
                id="top"
                className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-14 px-6 pt-14 pb-[72px]"
            >
                <div className="flex flex-col gap-7">
                    <div className="font-display text-[13px] tracking-[.32em] text-mauve">
                        LAMOUR WEDDING CONVENTION · VOL.2026
                    </div>
                    <h1 className="m-0 font-serif text-[clamp(40px,5.6vw,60px)] leading-[1.18] font-normal tracking-[-.02em] text-balance">
                        대구·부산·포항·김해
                        <br />
                        <span className="font-medium text-primary">웨딩박람회</span>
                    </h1>
                    <p className="m-0 max-w-[440px] text-[17px] leading-[1.75] text-body text-pretty">
                        결혼준비의 시작, 라모르 웨딩박람회. 가까운 지역을 골라
                        무료로 사전예약하세요.
                    </p>

                    {/* One row per fair, linking straight to its page. */}
                    <ul className="m-0 flex list-none flex-col rounded border border-line bg-paper p-0">
                        {fairs.map((f) => (
                            <li key={f.id} className="border-b border-line last:border-0">
                                <Link
                                    href={regionPath(f.id)}
                                    className="group flex items-center gap-4 px-5 py-4 text-ink hover:bg-sand hover:text-ink"
                                >
                                    <span className="w-[72px] flex-none font-display text-xs font-semibold tracking-[.16em] text-gold">
                                        {f.en}
                                    </span>
                                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                        <span className="font-serif text-lg">
                                            {f.label} 웨딩박람회
                                        </span>
                                        <span className="truncate text-[13px] text-muted">
                                            {f.event.dateMain} · {f.location.placeName}
                                        </span>
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="flex-none text-primary transition-transform group-hover:translate-x-1"
                                    >
                                        →
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-wrap gap-3">
                        <a
                            href="#regions"
                            className="rounded bg-primary px-8 py-[17px] text-base font-semibold text-white shadow-[0_10px_24px_-12px_rgba(127,58,65,.6)] hover:bg-primary-dark hover:text-white"
                        >
                            지역별 일정 보기
                        </a>
                        <a
                            href="#benefits"
                            className="rounded border border-taupe px-7 py-4 text-base font-semibold text-primary hover:bg-paper"
                        >
                            혜택 먼저 보기
                        </a>
                    </div>
                </div>

                <div className="relative aspect-[4/5] max-h-[720px] w-full justify-self-center">
                    <Image
                        src={coupleImage}
                        alt="라모르 웨딩박람회"
                        fill
                        preload
                        sizes="(max-width: 1000px) 100vw, 560px"
                        className="rounded-[200px_200px_4px_4px] object-cover"
                    />
                </div>
            </section>

            {/* Fairs by region */}
            <section id="regions" className="bg-sand">
                <div className="mx-auto max-w-[1200px] px-6 py-24">
                    <div className="mb-12 flex flex-col items-center gap-3.5 text-center">
                        <Eyebrow>SCHEDULE</Eyebrow>
                        <SectionTitle>지역별 박람회 일정</SectionTitle>
                        <p className="m-0 text-[15px] text-muted">
                            방문하실 지역을 선택하면 일정 확인과 사전예약을 할 수
                            있어요.
                        </p>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-5">
                        {fairs.map((f) => {
                            const seatsPct = `${Math.round(((f.seats.total - f.seats.left) / f.seats.total) * 100)}%`;
                            return (
                                <article
                                    key={f.id}
                                    className="flex flex-col overflow-hidden rounded border border-line bg-paper"
                                >
                                    <div className="relative aspect-[4/3] bg-parchment">
                                        <Image
                                            src={f.hero.image || heroImage}
                                            alt={f.hero.alt}
                                            fill
                                            sizes="(max-width: 640px) 100vw, 300px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col gap-5 p-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="font-display text-xs tracking-[.2em] text-gold">
                                                {f.en}
                                            </div>
                                            <h3 className="m-0 font-serif text-2xl font-normal">
                                                {f.label} 웨딩박람회
                                            </h3>
                                        </div>
                                        <dl className="m-0 flex flex-col gap-3 border-t border-line pt-4">
                                            <div className="flex flex-col gap-0.5">
                                                <dt className="text-xs font-semibold tracking-[.12em] text-gold">
                                                    DATE
                                                </dt>
                                                <dd className="m-0 font-serif text-[17px]">
                                                    {f.event.dateMain}
                                                </dd>
                                                {f.event.dateSub && (
                                                    <dd className="m-0 text-[13px] text-muted">
                                                        {f.event.dateSub}
                                                    </dd>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <dt className="text-xs font-semibold tracking-[.12em] text-gold">
                                                    PLACE
                                                </dt>
                                                <dd className="m-0 font-serif text-[17px]">
                                                    {f.location.placeName}
                                                </dd>
                                                {f.location.placeAddress && (
                                                    <dd className="m-0 text-[13px] text-muted">
                                                        {f.location.placeAddress}
                                                    </dd>
                                                )}
                                            </div>
                                        </dl>
                                        <div className="mt-auto flex flex-col gap-2">
                                            <div className="flex justify-between text-[13px] text-body">
                                                <span>{f.seats.total}팀 한정</span>
                                                <span>
                                                    잔여{' '}
                                                    <strong className="text-rose">
                                                        {f.seats.left}석
                                                    </strong>
                                                </span>
                                            </div>
                                            <div className="h-1 overflow-hidden rounded-[2px] bg-line">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: seatsPct }}
                                                />
                                            </div>
                                        </div>
                                        <Link
                                            href={regionPath(f.id)}
                                            className="rounded bg-primary px-5 py-3.5 text-center text-[15px] font-semibold text-white hover:bg-primary-dark hover:text-white"
                                        >
                                            {f.label} 사전예약하기
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <WhySection />

            <BenefitsSection title="사전등록 고객에게만" />

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-[900px] px-6 py-24">
                <div className="mb-10 flex flex-col items-center gap-3.5 text-center">
                    <Eyebrow>FAQ</Eyebrow>
                    <SectionTitle className="leading-normal">
                        자주 묻는 질문
                    </SectionTitle>
                </div>
                <Faq />
            </section>

            {/* Closing call to action */}
            <section className="bg-primary">
                <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-6 py-24 text-center">
                    <div className="font-display text-[30px] text-champagne italic">
                        You are invited
                    </div>
                    <h2 className="m-0 font-serif text-[clamp(32px,4vw,48px)] leading-[1.3] font-normal text-white">
                        가까운 박람회를
                        <br />
                        예약하세요
                    </h2>
                    <p className="m-0 max-w-[440px] text-base leading-[1.75] text-white/80">
                        사전예약 고객에게만 박람회 한정 혜택과 방문 사은품이
                        적용됩니다.
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-3">
                        {fairs.map((f) => (
                            <Link
                                key={f.id}
                                href={regionPath(f.id)}
                                className="rounded border border-champagne/60 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-white/10 hover:text-white"
                            >
                                {f.label}
                                {startDate(f.event.dateMain) && ` · ${startDate(f.event.dateMain)![0]}`}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            </main>

            <SiteFooter />
        </div>
    );
}
