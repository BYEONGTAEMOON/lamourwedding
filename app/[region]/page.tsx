import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteContent } from '@/lib/content';
import { isRegion, REGIONS, regionInfo, regionPath } from '@/lib/regions';
import { pageMetadata, regionDescription, SITE_NAME } from '@/lib/seo';
import { Landing } from '../_components/landing';

// The whole page depends on the region, so there is no URL-independent shell to
// stream into. Every region page is prerendered, so letting navigations from "/"
// block costs little; that beats wrapping the whole page in <Suspense>.
export const instant = false;

export function generateStaticParams() {
    return REGIONS.map((r) => ({ region: r.id }));
}

export async function generateMetadata({ params }: PageProps<'/[region]'>): Promise<Metadata> {
    const { region } = await params;
    if (!isRegion(region)) return {};
    // The description follows the fair's admin-edited date and venue.
    const content = await getSiteContent(region);
    return pageMetadata({
        title: `${regionInfo(region).label} 웨딩박람회 | ${SITE_NAME}`,
        description: regionDescription(region, content),
        path: regionPath(region),
    });
}

export default async function RegionPage({ params }: PageProps<'/[region]'>) {
    const { region } = await params;
    if (!isRegion(region)) notFound();
    return <Landing region={region} />;
}
