// Landing page regions. Daegu is served at "/", the others at "/<id>".
export const REGIONS = [
    { id: 'daegu', label: '대구', en: 'DAEGU' },
    { id: 'gimhae', label: '김해', en: 'GIMHAE' },
    { id: 'busan', label: '부산', en: 'BUSAN' },
    { id: 'pohang', label: '포항', en: 'POHANG' },
] as const;

export type RegionId = (typeof REGIONS)[number]['id'];
export const DEFAULT_REGION: RegionId = 'daegu';

export const isRegion = (v: unknown): v is RegionId => REGIONS.some((r) => r.id === v);

export const regionInfo = (id: RegionId) => REGIONS.find((r) => r.id === id)!;

export const regionPath = (id: RegionId) => (id === DEFAULT_REGION ? '/' : `/${id}`);
