import type { Metadata } from 'next';
import { Noto_Serif_KR, Playfair_Display } from 'next/font/google';
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

export const metadata: Metadata = {
    title: '라모르 웨딩박람회',
    description:
        '1,100여 개 제휴업체를 한자리에서 비교하세요. 사전예약 시 이번 주 한정 혜택과 방문 사은품을 드립니다.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html
            lang="ko"
            className={`${notoSerifKr.variable} ${playfair.variable}`}
        >
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
