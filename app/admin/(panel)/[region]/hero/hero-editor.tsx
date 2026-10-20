'use client';

import type { SiteContent } from '@/lib/site-content';
import { ImagePicker } from '../../../_components/image-picker';
import { Card, PageHeader, SaveBar, TextField, buttonClass, useSectionEditor } from '../../../_components/ui';

export function HeroEditor({ region, initial, defaultSrc }: { region: string; initial: SiteContent['hero']; defaultSrc: string }) {
    const editor = useSectionEditor(region, 'hero', initial);
    const hero = editor.value;

    return (
        <>
            <PageHeader
                title="메인 이미지"
                description="페이지 맨 위 아치 모양 사진입니다. 올린 사진은 가운데를 기준으로 4:5 비율로 잘라 저장됩니다."
            />
            <div className="grid gap-5 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
                <Card title="사진">
                    <ImagePicker
                        src={hero.image || defaultSrc}
                        alt={hero.alt}
                        folder="hero"
                        resize={{ maxWidth: 1120, maxHeight: 1400, aspect: 4 / 5 }}
                        onChange={(image) => editor.update({ ...hero, image })}
                        className="aspect-[4/5] w-full rounded-[160px_160px_4px_4px]"
                        sizes="320px"
                    />
                </Card>
                <Card title="설명">
                    <div className="flex flex-col gap-4">
                        <TextField
                            label="사진 설명 (대체 텍스트)"
                            hint="화면 낭독기와 검색엔진이 읽는 문구입니다. 사진 내용을 짧게 적어 주세요."
                            value={hero.alt}
                            onChange={(alt) => editor.update({ ...hero, alt })}
                            placeholder="예: 대구 신세계백화점 야경"
                        />
                        <p className="m-0 text-[13px] text-muted">
                            {hero.image ? '관리자에서 올린 사진을 사용 중입니다.' : '기본 사진(public/assets/hero.png)을 사용 중입니다.'}
                        </p>
                        {hero.image && (
                            <button
                                type="button"
                                className={`${buttonClass.secondary} self-start`}
                                onClick={() => editor.update({ ...hero, image: '' })}
                            >
                                기본 사진으로 되돌리기
                            </button>
                        )}
                    </div>
                </Card>
            </div>
            <SaveBar {...editor} />
        </>
    );
}
