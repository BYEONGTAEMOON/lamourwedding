'use client';

import type { SiteContent } from '@/lib/site-content';
import { Card, PageHeader, SaveBar, StringListEditor, useSectionEditor } from '../../../_components/ui';

export function FormEditor({ region, initial }: { region: string; initial: SiteContent['form'] }) {
    const editor = useSectionEditor(region, 'form', initial);
    const form = editor.value;

    return (
        <>
            <PageHeader
                title="신청폼 옵션"
                description="사전예약 폼의 선택지를 바꿉니다. 이미 접수된 신청 내역은 바뀌지 않습니다."
            />
            <div className="grid gap-5 lg:grid-cols-2">
                <Card title="결혼 예정월" description="2열로 표시됩니다.">
                    <StringListEditor
                        items={form.weddingMonths}
                        onChange={(weddingMonths) => editor.update({ ...form, weddingMonths })}
                        placeholder="예: 2027년 상반기"
                    />
                </Card>
                <Card title="방문 희망일" description="4열로 표시됩니다. 박람회 일정이 바뀌면 함께 수정하세요.">
                    <StringListEditor
                        items={form.visitDays}
                        onChange={(visitDays) => editor.update({ ...form, visitDays })}
                        placeholder="예: 10/24(토)"
                    />
                </Card>
            </div>
            <SaveBar {...editor} />
        </>
    );
}
