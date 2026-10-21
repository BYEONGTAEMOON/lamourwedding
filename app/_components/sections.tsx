// Building blocks shared by the region landing pages and the "/" overview.
import { BENEFITS, WHY } from '../_content';

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
                    <div className="font-serif text-[26px] leading-[1.45] text-petal-ink">
                        리뉴얼 된
                        <br />
                        라모르 웨딩컨설팅
                    </div>
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
                            className="grid grid-cols-[minmax(150px,220px)_minmax(0,1fr)] items-baseline gap-x-10 gap-y-6 border-b border-line py-8"
                        >
                            <div className="font-serif text-[28px] text-primary">
                                {b.value}
                            </div>
                            <div className="flex flex-col gap-2.5">
                                <div className="font-serif text-xl">
                                    <span className="mr-3 font-display text-sm text-gold">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    {b.title}
                                </div>
                                <div className="text-[15px] leading-[1.7] text-body">
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
                <div className="font-display text-lg tracking-[.18em] text-petal-ink">
                    LAMOUR
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
