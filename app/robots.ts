import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// The admin is login-only and also sends noindex; keep crawlers out of it entirely.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/uploads/'] },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
