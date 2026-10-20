import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '관리자 | 라모르 웨딩박람회',
    robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-cream text-ink">{children}</div>;
}
