import type { MetadataRoute } from 'next';
import { getContentUpdatedAt } from '@/lib/content';
import { REGIONS, regionPath } from '@/lib/regions';
import { SITE_PUBLISHED, SITE_URL } from '@/lib/seo';

// The overview plus one page per region; adding a region to lib/regions.ts adds it here.
// lastmod is the region's last admin save (the overview shows every region, so it takes the latest).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const regions = await Promise.all(
        REGIONS.map(async (r) => ({
            url: `${SITE_URL}${regionPath(r.id)}`,
            lastModified: (await getContentUpdatedAt(r.id)) ?? SITE_PUBLISHED,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })),
    );
    const latest = regions.map((r) => r.lastModified).sort().at(-1)!;
    return [{ url: SITE_URL, lastModified: latest, changeFrequency: 'weekly', priority: 1 }, ...regions];
}
