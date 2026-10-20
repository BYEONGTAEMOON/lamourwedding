'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Review } from '@/lib/site-content';

const INTERVAL = 5000;
const GAP = 20;

function Stars() {
    return (
        <div className="text-[13px] tracking-[3px] text-rose" aria-label="별점 5점">
            ★★★★★
        </div>
    );
}

// Text-only card; a photo is shown only if one was uploaded in the admin.
function ReviewCard({ review }: { review: Review }) {
    const body = (
        <div className="flex flex-col justify-center gap-3.5 p-7">
            <Stars />
            <p className="m-0 text-[15px] leading-[1.7] text-ink/80">
                {review.text}
                {review.text && review.bold && ' '}
                {review.bold && <b>{review.bold}</b>}
            </p>
            <div className="text-[13px] text-muted">{review.author}</div>
        </div>
    );
    if (!review.image) return <article className="flex h-full min-h-[200px] bg-paper">{body}</article>;
    return (
        <article className="grid h-full grid-cols-[minmax(0,2fr)_minmax(0,3fr)] bg-paper">
            <div className="relative min-h-[220px] bg-parchment">
                <Image src={review.image} alt="" fill sizes="(max-width: 760px) 40vw, 230px" className="object-cover" />
            </div>
            {body}
        </article>
    );
}

// Scroll-snap carousel: swipeable, auto-advances every 5s, pauses on hover/focus and for reduced motion.
export function ReviewSlider({ reviews }: { reviews: Review[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [perView, setPerView] = useState(1);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const pages = Math.max(1, reviews.length - perView + 1);
    const sliding = reviews.length > perView;

    const step = () => {
        const card = trackRef.current?.firstElementChild as HTMLElement | null;
        return card ? card.offsetWidth + GAP : 1;
    };

    const measure = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setPerView(Math.max(1, Math.round((el.clientWidth + GAP) / step())));
        setIndex(Math.round(el.scrollLeft / step()));
    }, []);

    const goTo = useCallback((i: number) => {
        const el = trackRef.current;
        if (!el) return;
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollTo({ left: i * step(), behavior: smooth ? 'smooth' : 'auto' });
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [measure]);

    useEffect(() => {
        if (!sliding || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const timer = setInterval(() => goTo(index + 1 >= pages ? 0 : index + 1), INTERVAL);
        return () => clearInterval(timer);
    }, [sliding, paused, index, pages, goTo]);

    if (!reviews.length) return null;

    return (
        <div
            className="flex flex-col gap-5"
            role="region"
            aria-roledescription="carousel"
            aria-label="고객 후기"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
        >
            <div
                ref={trackRef}
                onScroll={measure}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {reviews.map((r, i) => (
                    <div
                        key={i}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} / ${reviews.length}`}
                        className="w-full flex-none snap-start md:w-[calc((100%-20px)/2)]"
                    >
                        <ReviewCard review={r} />
                    </div>
                ))}
            </div>

            {sliding && (
                <div className="flex items-center justify-center gap-4">
                    <button
                        type="button"
                        aria-label="이전 후기"
                        onClick={() => goTo(index <= 0 ? pages - 1 : index - 1)}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-taupe bg-paper text-primary hover:bg-white"
                    >
                        ←
                    </button>
                    <div className="flex gap-2">
                        {Array.from({ length: pages }, (_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`${i + 1}번째 후기로 이동`}
                                aria-current={i === index || undefined}
                                onClick={() => goTo(i)}
                                className={`h-2 cursor-pointer rounded-full border-0 p-0 transition-all ${
                                    i === index ? 'w-6 bg-primary' : 'w-2 bg-taupe'
                                }`}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        aria-label="다음 후기"
                        onClick={() => goTo(index + 1 >= pages ? 0 : index + 1)}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-taupe bg-paper text-primary hover:bg-white"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}
