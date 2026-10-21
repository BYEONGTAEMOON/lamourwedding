import Image from 'next/image';
import { Faq } from './faq';
import { Partners } from './partners';
import { ReservationProvider } from './reservation-context';
import { ReviewSlider } from './review-slider';
import { RsvpForm } from './rsvp-form';
import { BenefitsSection, Eyebrow, SectionTitle, SiteFooter, WhySection } from './sections';
import { StickyCta } from './sticky-cta';
import { Ticker } from './ticker';
import { GIFTS, NAV } from '../_content';
// Static import: the URL carries a content hash, so replacing the file always shows the new image.
// Used unless an image was uploaded from the admin (hero.image).
import heroImage from '@/public/assets/hero.png';
import reviewMainImage from '@/public/assets/review-main.png';
import { getSiteContent } from '@/lib/content';
import type { RegionId } from '@/lib/regions';
import { googleMapEmbedUrl, naverMapUrl, tickerText } from '@/lib/site-content';

function Stars({ className }: { className: string }) {
    return (
        <div className={`text-rose ${className}`} aria-label="별점 5점">
            ★★★★★
        </div>
    );
}

// The whole landing page for one region, served at "/[region]".
export async function Landing({ region }: { region: RegionId }) {
    const { event, hero, reviews, seats, location, form, ticker, partners } =
        await getSiteContent(region);
    const seatsPct = `${Math.round(((seats.total - seats.left) / seats.total) * 100)}%`;

    return (
        <ReservationProvider>
            <div className="min-h-screen bg-cream">
                {ticker.enabled && (
                    <Ticker items={ticker.entries.map(tickerText)} />
                )}

                <header className="sticky top-0 z-20 border-b border-line bg-cream/90 backdrop-blur-[10px]">
                    <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-3.5">
                        <a
                            href="#top"
                            className="flex items-baseline gap-2.5 text-ink"
                        >
                            <span className="font-display text-xl font-semibold tracking-[.18em] text-primary">
                                {event.brand}
                            </span>
                            <span className="font-serif text-[13px] text-muted">
                                웨딩박람회
                            </span>
                        </a>
                        <nav className="flex flex-wrap gap-[22px] text-sm">
                            {NAV.map((n) => (
                                <a
                                    key={n.href}
                                    href={n.href}
                                    className="text-body"
                                >
                                    {n.label}
                                </a>
                            ))}
                        </nav>
                        <a
                            href="#rsvp"
                            className="rounded-full bg-primary px-[18px] py-2.5 text-sm font-semibold text-white hover:bg-primary-dark hover:text-white"
                        >
                            사전예약
                        </a>
                    </div>
                </header>

                {/* Hero */}
                <section
                    id="top"
                    className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-14 px-6 pt-14 pb-[72px]"
                >
                    <div className="flex flex-col gap-7">
                        <div className="font-display text-[13px] tracking-[.32em] text-mauve">
                            {event.eyebrow}
                        </div>
                        <h1 className="m-0 font-serif text-[clamp(40px,5.6vw,60px)] leading-[1.18] font-normal tracking-[-.02em] text-balance">
                            {event.titleLine1}
                            <br />
                            <span className="font-medium text-primary">
                                {event.titleAccent}
                            </span>{' '}
                            {event.titleRest}
                        </h1>
                        <p className="m-0 max-w-[440px] text-[17px] leading-[1.75] whitespace-pre-line text-body text-pretty">
                            {event.subtitle}
                        </p>

                        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-5 rounded border border-line bg-paper p-6">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xs font-semibold tracking-[.12em] text-gold">
                                    DATE
                                </div>
                                <div className="font-serif text-lg">
                                    {event.dateMain}
                                </div>
                                {event.dateSub && (
                                    <div className="text-[13px] text-muted">
                                        {event.dateSub}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xs font-semibold tracking-[.12em] text-gold">
                                    PLACE
                                </div>
                                <div className="font-serif text-lg">
                                    {location.placeName}
                                </div>
                                <div className="text-[13px] text-muted">
                                    {location.placeAddress}
                                </div>
                            </div>
                        </div>

                        <div className="flex max-w-[520px] flex-col gap-2.5">
                            <div className="flex justify-between text-[13px] text-body">
                                <span>행사 주 {seats.total}팀 한정</span>
                                <span>
                                    잔여{' '}
                                    <strong className="text-rose">
                                        {seats.left}석
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

                        <div className="flex flex-wrap gap-3">
                            <a
                                href="#rsvp"
                                className="rounded bg-primary px-8 py-[17px] text-base font-semibold text-white shadow-[0_10px_24px_-12px_rgba(127,58,65,.6)] hover:bg-primary-dark hover:text-white"
                            >
                                무료 사전예약하기
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
                            src={hero.image || heroImage}
                            alt={hero.alt}
                            fill
                            preload
                            sizes="(max-width: 1000px) 100vw, 560px"
                            className="rounded-[200px_200px_4px_4px] object-cover"
                        />
                    </div>
                </section>

                <WhySection />

                <BenefitsSection title={`박람회 등록 ${seats.total}팀에게만`} />

                {/* RSVP */}
                <section id="rsvp" className="bg-primary">
                    <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-14 px-6 py-24">
                        <div className="flex flex-col gap-5 text-white/90">
                            <div className="font-display text-[30px] text-champagne italic">
                                You are invited
                            </div>
                            <h2 className="m-0 font-serif text-[clamp(32px,4vw,48px)] leading-[1.3] font-normal text-white">
                                박람회 방문을
                                <br />
                                예약하세요
                            </h2>
                            <p className="m-0 max-w-[400px] text-base leading-[1.75] text-white/80">
                                사전예약 고객에게만 이번 주 한정 혜택과 방문
                                사은품이 적용됩니다. 예약 후 담당 플래너가 확인
                                연락을 드립니다.
                            </p>
                            <ul className="m-0 mt-2 flex list-none flex-col gap-2.5 p-0 text-[15px] text-white/90">
                                {[
                                    '입장료 무료',
                                    '방문사은픔 증정',
                                    '개인정보 안전 보호',
                                ].map((item) => (
                                    <li key={item} className="flex gap-2.5">
                                        <span className="text-champagne">
                                            ✓
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded bg-paper p-[clamp(24px,4vw,40px)] shadow-[0_30px_60px_-30px_rgba(0,0,0,.5)]">
                            <RsvpForm
                                region={region}
                                weddingMonths={form.weddingMonths}
                                visitDays={form.visitDays}
                            />
                        </div>
                    </div>
                </section>

                {/* Partners */}
                <section
                    id="partners"
                    className="mx-auto max-w-[1200px] px-6 py-24"
                >
                    <div className="mb-10 flex flex-col items-center gap-3.5 text-center">
                        <Eyebrow>OUR PARTNERS</Eyebrow>
                        <SectionTitle>
                            100개 이상의 제휴업체를 한자리에서
                        </SectionTitle>
                        <p className="m-0 text-[15px] text-muted">
                            웨딩홀·스튜디오·드레스·혼수까지 직접 비교하세요.
                        </p>
                    </div>
                    <Partners categories={partners} />
                </section>

                {/* Reviews */}
                <section id="reviews" className="bg-sand">
                    <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 py-24">
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-12">
                            <div className="relative aspect-[4/5] max-h-[600px] w-full">
                                <Image
                                    src={reviewMainImage}
                                    alt="후기 커플"
                                    fill
                                    sizes="(max-width: 900px) 100vw, 560px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-6">
                                <Eyebrow>REVIEWS · 100% 실제 방문 고객</Eyebrow>
                                <Stars className="tracking-[4px]" />
                                <blockquote className="m-0 font-serif text-[clamp(22px,2.4vw,30px)] leading-[1.6] font-normal text-pretty">
                                    “스드메를 직접 알아본 것과 비교해{' '}
                                    <span className="font-medium text-primary">
                                        120만 원
                                    </span>
                                    을 아꼈어요. 원하는 기준대로 고를 수 있어
                                    좋았습니다.”
                                </blockquote>
                                <div className="text-sm text-muted">
                                    김지은 · 이준호 — 2025년 11월 결혼
                                </div>
                            </div>
                        </div>
                        <ReviewSlider reviews={reviews} />
                    </div>
                </section>

                {/* Gifts */}
                <section
                    id="gifts"
                    className="mx-auto max-w-[1200px] px-6 py-24"
                >
                    <div className="mb-12 flex flex-col items-center gap-3.5 text-center">
                        <Eyebrow>VISIT GIFTS</Eyebrow>
                        <SectionTitle>저희가 준비한 열 가지 선물</SectionTitle>
                        <p className="m-0 text-[15px] text-muted">
                            방문 및 계약 고객 100% 증정
                        </p>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-4">
                        {GIFTS.map((g, i) => (
                            <div
                                key={g.title}
                                className="flex flex-col border border-line bg-paper"
                            >
                                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-parchment">
                                    {g.image ? (
                                        <Image
                                            src={g.image}
                                            alt=""
                                            fill
                                            sizes="(max-width: 640px) 100vw, 240px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="font-display text-5xl text-gold/60 italic">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 p-5">
                                    <div className="font-display text-xs tracking-[.2em] text-gold">
                                        GIFT {String(i + 1).padStart(2, '0')}
                                    </div>
                                    <div className="font-serif text-lg leading-[1.4]">
                                        {g.title}
                                    </div>
                                    <div className="text-sm leading-[1.6] text-muted">
                                        {g.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

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

                {/* Location */}
                <section id="location" className="bg-sand">
                    <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-10 px-6 py-24">
                        <div className="flex flex-col gap-7">
                            <div className="flex flex-col gap-3.5">
                                <Eyebrow>LOCATION</Eyebrow>
                                <SectionTitle className="leading-normal">
                                    오시는 길
                                </SectionTitle>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-[13px] font-semibold tracking-widest text-mauve">
                                    ADDRESS
                                </div>
                                <div className="text-[17px] leading-[1.6]">
                                    {location.address1}
                                    {location.address2 && (
                                        <>
                                            <br />
                                            {location.address2}
                                        </>
                                    )}
                                </div>
                                {location.addressNote && (
                                    <div className="text-sm leading-[1.7] text-muted">
                                        {location.addressNote}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 border-t border-taupe pt-6">
                                <div className="text-[13px] font-semibold tracking-widest text-mauve">
                                    Customer Service Center
                                </div>
                                {location.phone && (
                                    <div className="text-[15px] leading-[1.7]">
                                        <b>문의</b> · {location.phone}
                                    </div>
                                )}
                                {location.hours && (
                                    <div className="text-[15px] leading-[1.7]">
                                        <b>영업시간</b> · {location.hours}
                                    </div>
                                )}
                                {location.notice && (
                                    <div className="text-sm leading-[1.7] text-rose">
                                        {location.notice}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                <a
                                    href={naverMapUrl(location)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded border border-taupe bg-paper px-5 py-[13px] text-sm font-semibold text-ink"
                                >
                                    네이버 지도
                                </a>
                                {location.tmapUrl && (
                                    <a
                                        href={location.tmapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded border border-taupe bg-paper px-5 py-[13px] text-sm font-semibold text-ink"
                                    >
                                        TMAP
                                    </a>
                                )}
                                <a
                                    href="#rsvp"
                                    className="rounded bg-primary px-5 py-[13px] text-sm font-semibold text-white hover:text-white"
                                >
                                    사전 예약하기
                                </a>
                            </div>
                        </div>
                        <div className="min-h-[420px] overflow-hidden rounded bg-parchment">
                            <iframe
                                title="박람회 위치 지도"
                                src={googleMapEmbedUrl(location.mapQuery)}
                                loading="lazy"
                                className="block size-full min-h-[420px] border-0 [filter:grayscale(.4)_sepia(.15)]"
                            />
                        </div>
                    </div>
                </section>

                <SiteFooter />

                <StickyCta seatsLeft={seats.left} />
            </div>
        </ReservationProvider>
    );
}
