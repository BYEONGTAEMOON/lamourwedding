'use client';

import { useDeferredValue } from 'react';
import { googleMapEmbedUrl, naverMapUrl, type SiteContent } from '@/lib/site-content';
import { Card, PageHeader, SaveBar, TextField, useSectionEditor } from '../../../_components/ui';

type Location = SiteContent['location'];

export function LocationEditor({ region, initial }: { region: string; initial: Location }) {
    const editor = useSectionEditor(region, 'location', initial);
    const loc = editor.value;
    const set = (key: keyof Location) => (v: string) => editor.update({ ...loc, [key]: v });
    const mapQuery = useDeferredValue(loc.mapQuery);

    return (
        <>
            <PageHeader title="오시는 길 · 지도" description="상단 장소 정보와 하단 '오시는 길' 섹션에 표시됩니다." />
            <div className="flex flex-col gap-5">
                <Card title="상단 장소 (히어로 PLACE)">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField label="장소명" value={loc.placeName} onChange={set('placeName')} />
                        <TextField label="장소 주소" value={loc.placeAddress} onChange={set('placeAddress')} />
                    </div>
                </Card>

                <Card title="주소 · 문의">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField label="주소 1줄" value={loc.address1} onChange={set('address1')} />
                        <TextField label="주소 2줄 (상세)" value={loc.address2} onChange={set('address2')} />
                        <TextField label="주소 아래 안내 (주차 등)" value={loc.addressNote} onChange={set('addressNote')} />
                        <TextField label="문의 전화" value={loc.phone} onChange={set('phone')} />
                        <TextField label="영업시간" value={loc.hours} onChange={set('hours')} />
                        <TextField label="강조 안내 문구 (빨간 글씨)" value={loc.notice} onChange={set('notice')} />
                    </div>
                </Card>

                <Card title="지도" description="지도 검색어를 바꾸면 아래 미리보기와 사이트 지도가 함께 바뀝니다.">
                    <div className="flex flex-col gap-4">
                        <TextField
                            label="지도 검색어 (주소 또는 장소명)"
                            value={loc.mapQuery}
                            onChange={set('mapQuery')}
                            placeholder="예: 대구 동구 동부로 149 신세계백화점"
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField
                                label="네이버 지도 링크"
                                hint="비워두면 지도 검색어로 자동 검색합니다."
                                value={loc.naverUrl}
                                onChange={set('naverUrl')}
                                placeholder="https://naver.me/…"
                            />
                            <TextField
                                label="TMAP 링크"
                                hint="비워두면 TMAP 버튼을 숨깁니다."
                                value={loc.tmapUrl}
                                onChange={set('tmapUrl')}
                                placeholder="https://tmap.life/…"
                            />
                        </div>
                        <a href={naverMapUrl(loc)} target="_blank" rel="noopener noreferrer" className="self-start text-sm underline">
                            네이버 지도 링크 확인 ↗
                        </a>
                        <div className="h-[320px] overflow-hidden rounded border border-line bg-parchment">
                            <iframe
                                title="지도 미리보기"
                                src={googleMapEmbedUrl(mapQuery)}
                                loading="lazy"
                                className="block size-full border-0"
                            />
                        </div>
                    </div>
                </Card>
            </div>
            <SaveBar {...editor} />
        </>
    );
}
