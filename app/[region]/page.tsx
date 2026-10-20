import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEFAULT_REGION, isRegion, REGIONS, regionInfo } from '@/lib/regions';
import { Landing } from '../_components/landing';

// The whole page depends on the region, so there is no URL-independent shell to
// stream into. Region pages are only reached by direct visits (no client <Link>s),
// so let navigations block instead of wrapping everything in <Suspense>.
export const instant = false;

// Daegu lives at "/" ("/daegu" redirects there in next.config.ts).
export function generateStaticParams() {
    return REGIONS.filter((r) => r.id !== DEFAULT_REGION).map((r) => ({ region: r.id }));
}

export async function generateMetadata({ params }: PageProps<'/[region]'>): Promise<Metadata> {
    const { region } = await params;
    if (!isRegion(region)) return {};
    return { title: `${regionInfo(region).label} 웨딩박람회 | 라모르` };
}

export default async function RegionPage({ params }: PageProps<'/[region]'>) {
    const { region } = await params;
    if (!isRegion(region) || region === DEFAULT_REGION) notFound();
    return <Landing region={region} />;
}
