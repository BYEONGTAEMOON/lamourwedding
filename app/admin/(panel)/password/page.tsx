import { Suspense } from 'react';
import { MIN_PASSWORD_LENGTH } from '@/lib/admin-password';
import { requireAdmin } from '@/lib/auth';
import { PageHeader } from '../../_components/ui';
import { LoadingCard } from '../loading-card';
import { PasswordForm } from './password-form';

export default function PasswordPage() {
    return (
        <>
            <PageHeader
                title="비밀번호 변경"
                description="변경하면 다른 기기에서 로그인된 관리자 세션은 모두 로그아웃됩니다."
            />
            <Suspense fallback={<LoadingCard />}>
                <Guarded />
            </Suspense>
        </>
    );
}

async function Guarded() {
    await requireAdmin();
    return <PasswordForm minLength={MIN_PASSWORD_LENGTH} />;
}
