'use client';

import { useState, useTransition } from 'react';
import { sendTestNotification } from '../../actions';
import { buttonClass, Card } from '../../_components/ui';

export function NotifyTest() {
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

    return (
        <Card
            title="신청 알림 메일"
            description="새 신청이 들어오면 NOTIFY_EMAIL로 알림을 보냅니다. 버튼을 누르면 시험 메일을 보내고 결과를 보여줍니다."
        >
            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    disabled={pending}
                    className={buttonClass.secondary}
                    onClick={() =>
                        startTransition(async () => {
                            const res = await sendTestNotification();
                            setResult(
                                res.ok
                                    ? { ok: true, text: `${res.data}(으)로 보냈습니다. 받은편지함과 스팸함을 확인하세요.` }
                                    : { ok: false, text: res.error },
                            );
                        })
                    }
                >
                    {pending ? '보내는 중…' : '시험 메일 보내기'}
                </button>
                {result && (
                    <p role="status" className={`m-0 text-sm break-all ${result.ok ? 'text-[#3c7a4a]' : 'text-rose'}`}>
                        {result.text}
                    </p>
                )}
            </div>
        </Card>
    );
}
