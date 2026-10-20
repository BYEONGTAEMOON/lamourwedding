import { notFound } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth';
import { getSiteContentFresh } from '@/lib/content';
import { isRegion, regionInfo, regionPath, type RegionId } from '@/lib/regions';
import type { SiteContent } from '@/lib/site-content';
import { LoadingCard } from './loading-card';

type Render = (content: SiteContent, region: RegionId) => ReactNode;

async function Loader({ params, render }: { params: Promise<{ region: string }>; render: Render }) {
    const { region } = await params;
    if (!isRegion(region)) notFound();
    // The session check and the content read each take a DB round trip; run them together.
    // Nothing renders until requireAdmin() passes.
    const [, content] = await Promise.all([requireAdmin(), getSiteContentFresh(region)]);
    const { label } = regionInfo(region);
    return (
        <>
            <div className="mb-3 inline-flex rounded-full bg-petal/30 px-3 py-1 text-xs font-semibold text-primary-dark">
                {label} 페이지 ({regionPath(region)}) 편집 중
            </div>
            {render(content, region)}
        </>
    );
}

// Admin pages read cookies and fresh DB data at request time, so they stream inside Suspense.
export function SectionPage({ params, render }: { params: Promise<{ region: string }>; render: Render }) {
    return (
        <Suspense fallback={<LoadingCard />}>
            <Loader params={params} render={render} />
        </Suspense>
    );
}
