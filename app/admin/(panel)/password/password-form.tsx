'use client';

import { useActionState } from 'react';
import { changePassword } from '../../actions';
import { buttonClass, Card, Field, inputClass } from '../../_components/ui';

export function PasswordForm({ minLength }: { minLength: number }) {
    const [result, action, pending] = useActionState(changePassword, null);
    return (
        <Card>
            {/* key resets the inputs after a successful change */}
            <form key={result?.ok ? 'done' : 'edit'} action={action} className="flex max-w-sm flex-col gap-4">
                <Field label="현재 비밀번호">
                    <input type="password" name="current" autoComplete="current-password" required className={inputClass} />
                </Field>
                <Field label="새 비밀번호" hint={`${minLength}자 이상`}>
                    <input
                        type="password"
                        name="next"
                        autoComplete="new-password"
                        minLength={minLength}
                        required
                        className={inputClass}
                    />
                </Field>
                <Field label="새 비밀번호 확인">
                    <input
                        type="password"
                        name="confirm"
                        autoComplete="new-password"
                        minLength={minLength}
                        required
                        className={inputClass}
                    />
                </Field>
                {result && (
                    <p role="status" className={`m-0 text-sm ${result.ok ? 'text-[#3c7a4a]' : 'text-rose'}`}>
                        {result.ok ? '비밀번호를 변경했습니다. 다음 로그인부터 새 비밀번호를 사용하세요.' : result.error}
                    </p>
                )}
                <button type="submit" disabled={pending} className={`${buttonClass.primary} self-start`}>
                    {pending ? '변경 중…' : '비밀번호 변경'}
                </button>
            </form>
        </Card>
    );
}
