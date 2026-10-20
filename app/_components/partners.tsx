import Image from 'next/image';
import type { PartnerCategory } from '@/lib/site-content';

// Each row's item list is repeated so one half of the track is always wider than the viewport,
// then the whole track is doubled and slid by -50% for a seamless loop.
const REPEAT = 2;

export function Partners({ categories }: { categories: PartnerCategory[] }) {
    return (
        <div className="flex flex-col gap-6">
            {categories.filter((c) => c.items.length).map((c, row) => {
                const items = Array.from({ length: REPEAT }, () => c.items).flat();
                return (
                    <div
                        key={c.id}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"
                    >
                        <div className="flex flex-none items-baseline gap-2 sm:w-[112px] sm:flex-col sm:items-center sm:gap-1 sm:rounded sm:border sm:border-line sm:bg-paper sm:py-6">
                            <span className="text-[15px] font-semibold text-primary">
                                {c.label}
                            </span>
                            <span className="font-serif text-[13px] text-muted">
                                {c.count}
                            </span>
                        </div>
                        <div className="group min-w-0 flex-1 overflow-hidden mask-x-from-90% mask-x-to-100% motion-reduce:overflow-x-auto">
                            <div
                                className={`flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none ${
                                    row % 2 ? '[animation-direction:reverse]' : ''
                                }`}
                                // Same scroll speed on every row: 8s per item (the 40s default suits 5 items).
                                style={{ animationDuration: `${c.items.length * 8}s` }}
                            >
                                {[0, 1].map((half) =>
                                    items.map((item, i) => {
                                        const hidden = half > 0 || i >= c.items.length;
                                        return (
                                            <figure
                                                key={`${half}-${i}`}
                                                aria-hidden={hidden || undefined}
                                                className="m-0 flex w-[150px] flex-none flex-col gap-2 pr-4 sm:w-[176px]"
                                            >
                                                <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] bg-parchment">
                                                    {item.image && (
                                                        <Image
                                                            src={item.image}
                                                            alt={hidden ? '' : item.name}
                                                            fill
                                                            sizes="160px"
                                                            className="object-cover object-top"
                                                        />
                                                    )}
                                                </div>
                                                <figcaption className="truncate text-center text-[13px] text-ink/80">
                                                    {item.name}
                                                </figcaption>
                                            </figure>
                                        );
                                    }),
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
