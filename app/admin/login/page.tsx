import { LoginForm } from './login-form';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-md border border-line bg-paper p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,.3)]">
                <div className="mb-6 flex flex-col gap-1 text-center">
                    <div className="font-display text-lg font-semibold tracking-[.18em] text-primary">
                        LAMOUR
                    </div>
                    <h1 className="m-0 text-base font-semibold">관리자 로그인</h1>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}
