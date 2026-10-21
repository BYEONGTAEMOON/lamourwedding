import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Noto_Serif_KR, Playfair_Display } from 'next/font/google';
import { Suspense } from 'react';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';
import { Tracking } from './_components/tracking';
import './globals.css';

const notoSerifKr = Noto_Serif_KR({
    variable: '--font-noto-serif-kr',
    weight: ['300', '400', '500', '600'],
    subsets: ['latin'],
});

const playfair = Playfair_Display({
    variable: '--font-playfair',
    weight: ['400', '500', '600'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
});

// Defaults for every page; "/" and each region page override title, description,
// canonical URL and share image through pageMetadata() in lib/seo.ts.
export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: SITE_NAME,
    description:
        '1,100여 개 제휴업체를 한자리에서 비교하세요. 사전예약 시 박람회 한정 혜택과 방문 사은품을 드립니다.',
    openGraph: { type: 'website', locale: 'ko_KR', siteName: SITE_NAME, images: [DEFAULT_OG_IMAGE] },
    twitter: { card: 'summary_large_image', images: [DEFAULT_OG_IMAGE.url] },
    verification: {
        other: {
            'naver-site-verification': 'de2c1ca39ab7134de43918804473a3cc964aa4c0',
            'facebook-domain-verification': 'rm209f2v0nab67d7oq379mejtduxdt',
        },
    },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html
            lang="ko"
            className={`${notoSerifKr.variable} ${playfair.variable}`}
        >
            <head>
                <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
                {/* Dynamic subset: the browser downloads only the Hangul ranges a page uses
                    instead of a ~750KB file per weight. */}
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
                />
            </head>
            <body>
                {/* Tracking reads the URL (to skip /admin), so it streams in after the static shell. */}
                <Suspense fallback={null}>
                    <Tracking />
                </Suspense>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
