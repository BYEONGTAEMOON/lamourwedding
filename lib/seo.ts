// Shared SEO settings: the canonical domain, page metadata, and Schema.org JSON-LD
// built from the same content the pages render.
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { FAQS } from '@/app/_content';
import { regionInfo, regionPath, type RegionId } from './regions';
import type { SiteContent } from './site-content';

// Canonical origin. lamourwedding.app and lamourwedding.vercel.app redirect here.
export const SITE_URL = 'https://www.lamourwedding.app';
export const SITE_NAME = '라모르 웨딩박람회';

// Brand card used as the share image on every page.
export const DEFAULT_OG_IMAGE = {
    url: '/og/lamour-wedding.jpg',
    width: 1200,
    height: 630,
    alt: "L'AMOUR WEDDING 라모르 웨딩박람회",
};

// Business details as printed in the site footer.
const ORGANIZATION = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: '라모르웨딩',
    legalName: '(주)라모르웨딩 주식회사',
    url: SITE_URL,
    address: {
        '@type': 'PostalAddress',
        streetAddress: '법원로8번길 10',
        addressLocality: '연제구',
        addressRegion: '부산광역시',
        addressCountry: 'KR',
    },
};

type PageSeo = {
    title: string;
    description: string;
    path: string;
    ogTitle?: string;
    ogDescription?: string;
    // Absolute URL of a page-specific share image; falls back to DEFAULT_OG_IMAGE.
    image?: string;
};

// Page metadata with canonical URL, Open Graph and Twitter card filled in consistently.
export function pageMetadata({ title, description, path, ogTitle, ogDescription, image }: PageSeo): Metadata {
    const images = image ? [{ url: image, alt: ogTitle ?? title }] : [DEFAULT_OG_IMAGE];
    return {
        title: { absolute: title },
        description,
        alternates: { canonical: path },
        openGraph: {
            type: 'website',
            locale: 'ko_KR',
            siteName: SITE_NAME,
            url: path,
            title: ogTitle ?? title,
            description: ogDescription ?? description,
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle ?? title,
            description: ogDescription ?? description,
            images: images.map((i) => i.url),
        },
    };
}

// Placeholder copy new regions start with ("일정 추후 안내", "… (추후 안내)").
const isPlaceholder = (s: string) => !s || s.includes('추후');

export function regionDescription(region: RegionId, { event, location }: SiteContent) {
    const { label } = regionInfo(region);
    const when = isPlaceholder(event.dateMain) ? '' : ` ${event.dateMain}`;
    const where = isPlaceholder(location.placeName) ? '' : `, ${location.placeName}`;
    return `${label} 웨딩박람회${when}${where}. 웨딩홀·스드메·허니문·예물 등 결혼 준비 상담과 사전예약 혜택을 라모르 웨딩박람회에서 확인하세요.`;
}

// Photo for a region's Event markup: the hero uploaded from the admin, if any.
export const regionImage = ({ hero }: SiteContent) =>
    hero.image.startsWith('https://') ? hero.image : undefined;

/* ---------- JSON-LD ---------- */

export function homeJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            ORGANIZATION,
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                name: SITE_NAME,
                url: SITE_URL,
                inLanguage: 'ko-KR',
                publisher: { '@id': `${SITE_URL}/#organization` },
            },
            {
                '@type': 'FAQPage',
                mainEntity: FAQS.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
            },
        ],
    };
}

// Today's year and month in Korea. Cached for a day so static pages can read the clock.
export async function kstToday() {
    'use cache';
    cacheLife('days');
    const now = new Date(Date.now() + 9 * 3600_000);
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}

const pad = (n: number) => String(n).padStart(2, '0');

// "10.24 (토) – 10.25 (일)" → ISO dates. The text carries no year, so a date more than
// three months before `today` is taken to be next year's. Returns null when undated.
export function fairDates(dateMain: string, today: { year: number; month: number }) {
    const days = [...dateMain.matchAll(/(\d{1,2})\.(\d{1,2})/g)].map((m) => [Number(m[1]), Number(m[2])]);
    if (!days.length) return null;
    const [[sm, sd], [em, ed] = days[0]] = days;
    const startYear = sm < today.month - 3 ? today.year + 1 : today.year;
    const endYear = em < sm ? startYear + 1 : startYear;
    return {
        startDate: `${startYear}-${pad(sm)}-${pad(sd)}`,
        endDate: `${endYear}-${pad(em)}-${pad(ed)}`,
    };
}

export function regionJsonLd(
    region: RegionId,
    content: SiteContent,
    today: { year: number; month: number },
) {
    const { label } = regionInfo(region);
    const url = `${SITE_URL}${regionPath(region)}`;
    const graph: object[] = [
        {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: `${label} 웨딩박람회`, item: url },
            ],
        },
    ];

    // Only fairs with a real date and venue get Event markup.
    const dates = fairDates(content.event.dateMain, today);
    const { location } = content;
    if (dates && !isPlaceholder(location.placeName)) {
        graph.push({
            '@type': 'Event',
            name: `${label} 웨딩박람회`,
            description: regionDescription(region, content),
            url,
            ...dates,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            isAccessibleForFree: true,
            location: {
                '@type': 'Place',
                name: location.placeName,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: [location.address1, location.address2].filter(Boolean).join(' '),
                    addressCountry: 'KR',
                },
            },
            image: [regionImage(content) ?? `${SITE_URL}${DEFAULT_OG_IMAGE.url}`],
            organizer: ORGANIZATION,
            // The page advertises free entry ("입장료 무료").
            offers: {
                '@type': 'Offer',
                price: 0,
                priceCurrency: 'KRW',
                availability: 'https://schema.org/InStock',
                url,
            },
        });
    }
    return { '@context': 'https://schema.org', '@graph': graph };
}
