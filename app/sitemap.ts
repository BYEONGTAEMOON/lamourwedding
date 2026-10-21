import type { MetadataRoute } from 'next';
import { REGIONS, regionPath } from '@/lib/regions';
import { SITE_URL } from '@/lib/seo';

// The overview plus one page per region; adding a region to lib/regions.ts adds it here.
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
        ...REGIONS.map((r) => ({
            url: `${SITE_URL}${regionPath(r.id)}`,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })),
    ];
}
