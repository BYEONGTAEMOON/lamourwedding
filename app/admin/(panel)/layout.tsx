import { Suspense } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { logout } from '../actions';
import { Sidebar } from './sidebar';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Sidebar reads the URL (current region/section), so it streams in after the static shell. */}
            <Suspense fallback={<aside className="flex-none border-b border-line bg-paper md:h-screen md:w-56 md:border-r md:border-b-0" />}>
                <Sidebar logout={logout} />
            </Suspense>
            <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
                {!isSupabaseConfigured && (
                    <div className="mb-6 rounded border border-taupe bg-sand px-4 py-3 text-[13px] text-body">
                        로컬 저장 모드: 내용은 <code>data/</code> 폴더, 사진은 <code>data/uploads/</code>에 저장됩니다.
                        Vercel에서는 저장되지 않으니 배포 전에 Supabase를 설정하세요.
                    </div>
                )}
                <div className="mx-auto max-w-[960px]">{children}</div>
            </main>
        </div>
    );
}
