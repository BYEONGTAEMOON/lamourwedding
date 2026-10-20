'use client';

import { useActionState } from 'react';
import { login } from '../actions';
import { buttonClass, inputClass } from '../_components/ui';

export function LoginForm() {
    const [error, action, pending] = useActionState(login, null);
    return (
        <form action={action} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-body">비밀번호</span>
                <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    autoFocus
                    className={inputClass}
                />
            </label>
            {error && (
                <p role="alert" className="m-0 text-sm text-rose">
                    {error}
                </p>
            )}
            <button type="submit" disabled={pending} className={`${buttonClass.primary} py-3`}>
                {pending ? '확인 중…' : '로그인'}
            </button>
        </form>
    );
}
