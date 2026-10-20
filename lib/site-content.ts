// Admin-editable site content: shape, defaults, and input sanitizing.
// Shared by the public page, the admin editors, and the server actions.
// Every section is stored per region (see lib/regions.ts).

import { DEFAULT_REGION, regionInfo, type RegionId } from './regions';

export type PartnerItem = { name: string; image: string };
export type PartnerCategory = {
    id: string;
    label: string;
    count: string;
    items: PartnerItem[];
};

export type TickerEntry = { name: string; phone4: string; ago: string };

// `bold` follows `text` in bold, e.g. "…웨딩홀에서만" + "150만 원 정도 아꼈습니다."
export type Review = { text: string; bold: string; author: string; image: string };

export type SiteContent = {
    // Header brand and hero copy. `subtitle` may contain line breaks.
    event: {
        brand: string;
        eyebrow: string;
        titleLine1: string;
        titleAccent: string;
        titleRest: string;
        subtitle: string;
        dateMain: string;
        dateSub: string;
    };
    // image '' means the bundled public/assets/hero.png.
    hero: { image: string; alt: string };
    reviews: Review[];
    seats: { total: number; left: number };
    location: {
        placeName: string;
        placeAddress: string;
        address1: string;
        address2: string;
        addressNote: string;
        phone: string;
        hours: string;
        notice: string;
        mapQuery: string;
        naverUrl: string;
        tmapUrl: string;
    };
    form: {
        weddingMonths: string[];
        visitDays: string[];
    };
    ticker: { enabled: boolean; entries: TickerEntry[] };
    partners: PartnerCategory[];
};

export type SectionKey = keyof SiteContent;
export const SECTION_KEYS: SectionKey[] = [
    'event',
    'hero',
    'reviews',
    'seats',
    'location',
    'form',
    'ticker',
    'partners',
];

export const DEFAULT_CONTENT: SiteContent = {
    event: {
        brand: 'DAEGU LAMOUR',
        eyebrow: 'SHINSEGAE WEDDING CONVENTION · VOL.2026',
        titleLine1: '대구 신세계백화점',
        titleAccent: '결혼준비',
        titleRest: '웨딩박람회',
        subtitle: '준비 비용과 시간을 실제로 줄여드리는 결혼준비.\n라모르가 함께 합니다.',
        dateMain: '10.24 (토) – 10.25 (일)',
        dateSub: '주말 10:00 – 20:00',
    },
    hero: { image: '', alt: '대구 신세계백화점' },
    reviews: [
        {
            text: '여러 웨딩홀을 직접 알아볼 필요 없이 한자리에서 비교할 수 있어서 좋았어요.',
            bold: '예산에 맞춰 꼼꼼하게 상담해 주셔서 웨딩홀 비용도 약 150만 원 절약했어요!',
            author: '김서연 · 박준호 — 2026년 9월',
            image: '',
        },
        {
            text: '혼자 방문해서 조금 걱정했는데 플래너님이 처음부터 끝까지 친절하게 안내해 주셨어요.',
            bold: '막막했던 결혼 준비가 한결 수월해졌습니다.',
            author: '이지은 · 최현우 — 2026년 8월',
            image: '',
        },
        {
            text: '스드메 견적이 생각보다 비싸서 고민이 많았는데 박람회에서 다양한 패키지를 비교할 수 있었어요.',
            bold: '원하는 구성으로 선택하면서 예산도 많이 줄였습니다.',
            author: '박소영 · 김민재 — 2026년 7월',
            image: '',
        },
        {
            text: '결혼 준비를 어디서부터 시작해야 할지 몰랐는데 하나하나 설명해 주셔서 정말 좋았어요.',
            bold: '웨딩홀부터 혼수까지 하루 만에 전체적인 계획을 세웠습니다.',
            author: '정유진 · 이동현 — 2026년 6월',
            image: '',
        },
        {
            text: '계약을 강요하지 않고 저희 상황에 맞는 상품을 추천해 주셔서 편하게 상담받았어요.',
            bold: '여러 업체를 비교하고 결정할 수 있다는 점이 가장 만족스러웠습니다.',
            author: '최다은 · 이승현 — 2026년 5월',
            image: '',
        },
        {
            text: '웨딩홀을 여러 군데 알아보고 있었는데 식대부터 대관료까지 비교해 주셔서 편했어요.',
            bold: '덕분에 마음에 드는 웨딩홀을 예산 안에서 찾을 수 있었습니다.',
            author: '한지민 · 김도윤 — 2026년 4월',
            image: '',
        },
        {
            text: '처음에는 결혼 비용이 너무 부담스러웠는데 예산에 맞는 선택지를 다양하게 알려주셨어요.',
            bold: '불필요한 항목을 줄이니 생각보다 합리적인 비용으로 준비할 수 있겠더라고요.',
            author: '오하늘 · 박지훈 — 2026년 3월',
            image: '',
        },
        {
            text: '둘 다 직장인이라 웨딩홀과 스드메를 알아볼 시간이 부족했는데 박람회 한 번 방문으로 많은 정보를 얻었어요.',
            bold: '시간도 아끼고 견적 비교까지 할 수 있어 만족했습니다.',
            author: '서예린 · 정민수 — 2026년 2월',
            image: '',
        },
        {
            text: '웨딩홀 상담만 생각하고 갔는데 신혼여행이랑 혼수까지 알아볼 수 있어서 좋았어요.',
            bold: '여러 업체의 혜택을 비교해 보니 박람회에 오길 잘했다는 생각이 들었습니다.',
            author: '강수빈 · 이재훈 — 2026년 1월',
            image: '',
        },
        {
            text: '처음에는 구경만 하려고 방문했는데 예상보다 상담이 정말 알찼어요. 궁금했던 부분도 꼼꼼하게 설명해 주시고 저희에게 맞는 혜택까지 안내해 주셔서',
            bold: '주변 예비부부에게도 추천하고 싶어요!',
            author: '윤채원 · 김태민 — 2025년 12월',
            image: '',
        },
    ],
    seats: { total: 100, left: 23 },
    location: {
        placeName: '대구 신세계백화점 엘지',
        placeAddress: '대구 동구 동부로 149 신세계백화점 6F',
        address1: '대구 동구 동부로 149',
        address2: '신세계백화점 6F LG베스트샵',
        addressNote: '대구 신세계백화점 주차장',
        phone: '010.9799.0729',
        hours: '오전 11:00 ~ 오후 8:00',
        notice: '주말에는 주차가 혼잡하니 대중교통 이용을 권장합니다.',
        mapQuery: '대구 동구 동부로 149 신세계백화점',
        naverUrl: '',
        tmapUrl: 'https://tmap.life',
    },
    form: {
        weddingMonths: ['2026년 하반기', '2027년 상반기', '2027년 하반기', '미정'],
        visitDays: ['10/3(토)', '10/4(일)', '10/10(토)', '10/11(일)'],
    },
    ticker: {
        enabled: true,
        entries: [
            { name: '정O연', phone4: '2582', ago: '19분 전' },
            { name: '김O훈', phone4: '7710', ago: '7분 전' },
            { name: '이O서', phone4: '0943', ago: '3분 전' },
            { name: '박O민', phone4: '3318', ago: '방금 전' },
        ],
    },
    partners: [
        {
            id: 'hall',
            label: '웨딩홀',
            count: '453+',
            items: [
            { name: 'MH컨벤션', image: '/assets/halls/hall-01.webp' },
            { name: 'M스타하우스웨딩', image: '/assets/halls/hall-02.webp' },
            { name: '노비아갈라동촌점', image: '/assets/halls/hall-03.webp' },
            { name: '퀸벨호텔', image: '/assets/halls/hall-04.webp' },
            { name: '메리어트', image: '/assets/halls/hall-05.webp' },
            { name: '엑스코 인터불고', image: '/assets/halls/hall-06.webp' },
            { name: '노비아갈라전자관점', image: '/assets/halls/hall-07.webp' },
            { name: '엘파소하우스웨딩', image: '/assets/halls/hall-08.webp' },
            { name: '중앙컨벤션', image: '/assets/halls/hall-09.webp' },
            { name: '웨딩 메르디앙', image: '/assets/halls/hall-10.webp' },
            { name: 'AW호텔', image: '/assets/halls/hall-11.webp' },
            { name: '라온웨딩', image: '/assets/halls/hall-12.webp' },
            { name: '웨딩비엔나', image: '/assets/halls/hall-13.webp' },
            { name: '라테라스', image: '/assets/halls/hall-14.webp' },
            { name: '파라다이스', image: '/assets/halls/hall-15.webp' },
            { name: '아리아나호텔', image: '/assets/halls/hall-16.webp' },
            { name: '웨딩아테네', image: '/assets/halls/hall-17.webp' },
            { name: '수성스퀘어', image: '/assets/halls/hall-18.webp' },
            { name: '호텔인터불고만촌점', image: '/assets/halls/hall-19.webp' },
            { name: '라온제나호텔', image: '/assets/halls/hall-20.webp' },
            { name: '더아트라움', image: '/assets/halls/hall-21.webp' },
            { name: '스타디움컨벤션웨딩', image: '/assets/halls/hall-22.webp' },
            { name: '마리드메이', image: '/assets/halls/hall-23.webp' },
            { name: '뉴욕뉴욕', image: '/assets/halls/hall-24.webp' },
            { name: '로터스101', image: '/assets/halls/hall-25.webp' },
            { name: '어반폴', image: '/assets/halls/hall-26.webp' },
            { name: '칼라디움', image: '/assets/halls/hall-27.webp' },
            { name: '스카이나인스', image: '/assets/halls/hall-28.webp' },
            { name: '륜', image: '/assets/halls/hall-29.webp' },
            { name: '아현정', image: '/assets/halls/hall-30.webp' },
            { name: '보스코', image: '/assets/halls/hall-31.webp' },
            { name: '프리아', image: '/assets/halls/hall-32.webp' },
            { name: 'J컨벤션웨딩', image: '/assets/halls/hall-33.webp' },
            { name: 'bw웨딩', image: '/assets/halls/hall-34.webp' },
            { name: '토미스퀘어가든', image: '/assets/halls/hall-35.webp' },
            { name: '라뷰웨딩', image: '/assets/halls/hall-36.webp' },
            { name: '금오산호텔', image: '/assets/halls/hall-37.webp' },
            ],
        },
        {
            id: 'studio',
            label: '스튜디오',
            count: '81+',
            items: [
            { name: '그가사랑하는순간', image: '/assets/studios/studio-01.webp' },
            { name: '온느', image: '/assets/studios/studio-02.webp' },
            { name: '플랜노트', image: '/assets/studios/studio-03.webp' },
            { name: '비마이', image: '/assets/studios/studio-04.webp' },
            { name: '세미앙', image: '/assets/studios/studio-05.webp' },
            { name: '일라이', image: '/assets/studios/studio-06.webp' },
            { name: '아우라', image: '/assets/studios/studio-07.webp' },
            { name: '고', image: '/assets/studios/studio-08.webp' },
            { name: '소나르', image: '/assets/studios/studio-09.webp' },
            { name: '바로오늘이그날', image: '/assets/studios/studio-10.webp' },
            { name: '피아', image: '/assets/studios/studio-11.webp' },
            { name: '러브이치아덜', image: '/assets/studios/studio-12.webp' },
            { name: '헤이즐리', image: '/assets/studios/studio-13.webp' },
            { name: '보메가든', image: '/assets/studios/studio-14.webp' },
            { name: '럽조이', image: '/assets/studios/studio-15.webp' },
            { name: '보어하우스', image: '/assets/studios/studio-16.webp' },
            { name: '비비엔다', image: '/assets/studios/studio-17.webp' },
            { name: '에밀리', image: '/assets/studios/studio-18.webp' },
            { name: '루브하우스', image: '/assets/studios/studio-19.webp' },
            { name: '노우드', image: '/assets/studios/studio-20.webp' },
            { name: '아이브하우스', image: '/assets/studios/studio-21.webp' },
            { name: '아오베하임', image: '/assets/studios/studio-22.webp' },
            { name: '노이', image: '/assets/studios/studio-23.webp' },
            { name: '모던마인드', image: '/assets/studios/studio-24.webp' },
            { name: '니즈', image: '/assets/studios/studio-25.webp' },
            { name: '어반', image: '/assets/studios/studio-26.webp' },
            { name: '메이든', image: '/assets/studios/studio-27.webp' },
            { name: '모네', image: '/assets/studios/studio-28.webp' },
            { name: '라앤디', image: '/assets/studios/studio-29.webp' },
            { name: '르안', image: '/assets/studios/studio-30.webp' },
            { name: '아뜰리에엘스', image: '/assets/studios/studio-31.webp' },
            { name: '알마', image: '/assets/studios/studio-32.webp' },
            { name: '베누아', image: '/assets/studios/studio-33.webp' },
            { name: '오데뜨', image: '/assets/studios/studio-34.webp' },
            { name: '루이246', image: '/assets/studios/studio-35.webp' },
            { name: '루나', image: '/assets/studios/studio-36.webp' },
            { name: '베네사', image: '/assets/studios/studio-37.webp' },
            { name: '벨리바이고', image: '/assets/studios/studio-38.webp' },
            { name: '그루비오블랙', image: '/assets/studios/studio-39.webp' },
            ],
        },
        {
            id: 'dress',
            label: '드레스',
            count: '84+',
            items: [
            { name: '더청담엘브라이드', image: '/assets/dresses/dress-01.webp' },
            { name: '라비앙로즈', image: '/assets/dresses/dress-02.webp' },
            { name: '로얄드웨딩', image: '/assets/dresses/dress-03.webp' },
            { name: '리아웨딩', image: '/assets/dresses/dress-04.webp' },
            { name: '마리스포사', image: '/assets/dresses/dress-05.webp' },
            { name: '메종드벨라', image: '/assets/dresses/dress-06.webp' },
            { name: '석미송', image: '/assets/dresses/dress-07.webp' },
            { name: '소유드블랑', image: '/assets/dresses/dress-08.webp' },
            { name: '아델', image: '/assets/dresses/dress-09.webp' },
            { name: '아뜰리에레이나', image: '/assets/dresses/dress-10.webp' },
            { name: '아이테오', image: '/assets/dresses/dress-11.webp' },
            { name: '프리체', image: '/assets/dresses/dress-12.webp' },
            { name: '효제브라이덜', image: '/assets/dresses/dress-13.webp' },
            ],
        },
        {
            id: 'makeup',
            label: '혼수',
            count: '41+',
            items: [
            { name: '오브그나', image: '/assets/honsu/honsu-01.webp' },
            { name: '디바인핸즈', image: '/assets/honsu/honsu-02.webp' },
            { name: '라포르', image: '/assets/honsu/honsu-03.webp' },
            { name: '로얄테일러', image: '/assets/honsu/honsu-04.webp' },
            { name: '빈센트 콜레오네', image: '/assets/honsu/honsu-05.webp' },
            { name: '아틀레', image: '/assets/honsu/honsu-06.webp' },
            { name: '라의재', image: '/assets/honsu/honsu-07.webp' },
            { name: '설레인한복', image: '/assets/honsu/honsu-08.webp' },
            { name: '블리스스냅', image: '/assets/honsu/honsu-09.webp' },
            { name: '유나필름', image: '/assets/honsu/honsu-10.webp' },
            { name: '혜음스냅', image: '/assets/honsu/honsu-11.webp' },
            { name: '너와만나스냅', image: '/assets/honsu/honsu-12.webp' },
            { name: 'LG', image: '/assets/honsu/honsu-13.webp' },
            ],
        },
    ],
};

// Busan and Gimhae share the same studio partners.
const GYEONGNAM_STUDIOS: PartnerItem[] = [
    { name: '비마이', image: '/assets/studios/busan/studio-01.webp' },
    { name: '인하우스', image: '/assets/studios/busan/studio-02.webp' },
    { name: '고', image: '/assets/studios/busan/studio-03.webp' },
    { name: '온느', image: '/assets/studios/busan/studio-04.webp' },
    { name: '러브이치아덜', image: '/assets/studios/busan/studio-05.webp' },
    { name: '모네', image: '/assets/studios/busan/studio-06.webp' },
    { name: '럽조이', image: '/assets/studios/busan/studio-07.webp' },
    { name: '보메가든', image: '/assets/studios/busan/studio-08.webp' },
    { name: '노이', image: '/assets/studios/busan/studio-09.webp' },
    { name: '노우드', image: '/assets/studios/busan/studio-10.webp' },
    { name: '루브하우스', image: '/assets/studios/busan/studio-11.webp' },
    { name: '모던마인드', image: '/assets/studios/busan/studio-12.webp' },
    { name: '베네사', image: '/assets/studios/busan/studio-13.webp' },
    { name: '알마', image: '/assets/studios/busan/studio-14.webp' },
    { name: '그루비오블랙', image: '/assets/studios/busan/studio-15.webp' },
    { name: '오데뜨', image: '/assets/studios/busan/studio-16.webp' },
    { name: '벨리바이고', image: '/assets/studios/busan/studio-17.webp' },
    { name: '고운스튜디오', image: '/assets/studios/busan/studio-18.webp' },
    { name: '앤스틸스튜디오', image: '/assets/studios/busan/studio-19.webp' },
    { name: '헤이즐리', image: '/assets/studios/busan/studio-20.webp' },
    { name: '바로오늘이그날', image: '/assets/studios/busan/studio-21.webp' },
    { name: '소나르', image: '/assets/studios/busan/studio-22.webp' },
    { name: '아이브하우스', image: '/assets/studios/busan/studio-23.webp' },
    { name: '아우라', image: '/assets/studios/busan/studio-24.webp' },
    { name: '플랜노트', image: '/assets/studios/busan/studio-25.webp' },
];

// Per-region partner lists by category id; categories not listed here share the Daegu list.
const REGION_PARTNERS: Partial<Record<RegionId, Record<string, PartnerItem[]>>> = {
    busan: {
        hall: [
        { name: '롯데호텔', image: '/assets/halls/busan/hall-01.webp' },
        { name: '힐튼', image: '/assets/halls/busan/hall-02.webp' },
        { name: '파라다이스', image: '/assets/halls/busan/hall-03.webp' },
        { name: '파크하얏트', image: '/assets/halls/busan/hall-04.webp' },
        { name: '웨스틴 조선', image: '/assets/halls/busan/hall-05.webp' },
        { name: '그랜드 조선', image: '/assets/halls/busan/hall-06.webp' },
        { name: '농심호텔', image: '/assets/halls/busan/hall-07.webp' },
        { name: '윈덤 그랜드', image: '/assets/halls/busan/hall-08.webp' },
        { name: '코모도', image: '/assets/halls/busan/hall-09.webp' },
        { name: '헤리움웨딩홀', image: '/assets/halls/busan/hall-10.webp' },
        { name: '그랜드모먼트', image: '/assets/halls/busan/hall-11.webp' },
        { name: '파라곤호텔', image: '/assets/halls/busan/hall-12.webp' },
        { name: '아바니호텔', image: '/assets/halls/busan/hall-13.webp' },
        { name: '그랜드블랑', image: '/assets/halls/busan/hall-14.webp' },
        { name: '다비다웨딩홀', image: '/assets/halls/busan/hall-15.webp' },
        { name: '프리미어', image: '/assets/halls/busan/hall-16.webp' },
        { name: '디엘', image: '/assets/halls/busan/hall-17.webp' },
        { name: '센텀 호텔', image: '/assets/halls/busan/hall-18.webp' },
        { name: '아시아드', image: '/assets/halls/busan/hall-19.webp' },
        { name: '라온웨딩', image: '/assets/halls/busan/hall-20.webp' },
        { name: '부산호텔', image: '/assets/halls/busan/hall-21.webp' },
        { name: '라발스호텔', image: '/assets/halls/busan/hall-22.webp' },
        { name: '한화리조트', image: '/assets/halls/busan/hall-23.webp' },
        { name: '롯데갤러리움', image: '/assets/halls/busan/hall-24.webp' },
        { name: '호메르스호텔', image: '/assets/halls/busan/hall-25.webp' },
        { name: '사학연금', image: '/assets/halls/busan/hall-26.webp' },
        { name: '해암', image: '/assets/halls/busan/hall-27.webp' },
        { name: '이리스', image: '/assets/halls/busan/hall-28.webp' },
        { name: '골든웨딩홀', image: '/assets/halls/busan/hall-29.webp' },
        ],
        studio: GYEONGNAM_STUDIOS,
    },
    gimhae: {
        hall: [
        { name: '메르시앙 가든홀', image: '/assets/halls/gimhae/hall-01.webp' },
        { name: '메르시앙 글로리홀', image: '/assets/halls/gimhae/hall-02.webp' },
        { name: '아이스퀘어 그랜드볼룸', image: '/assets/halls/gimhae/hall-03.webp' },
        { name: '아이스퀘어 콘서트홀', image: '/assets/halls/gimhae/hall-04.webp' },
        { name: '아이스퀘어 클래식홀', image: '/assets/halls/gimhae/hall-05.webp' },
        { name: 'JW 일루미아홀', image: '/assets/halls/gimhae/hall-06.webp' },
        { name: 'JW 그랜드볼룸', image: '/assets/halls/gimhae/hall-07.webp' },
        { name: '비즈컨벤션', image: '/assets/halls/gimhae/hall-08.webp' },
        { name: '산정', image: '/assets/halls/gimhae/hall-09.webp' },
        { name: '더파티 벨리스홀', image: '/assets/halls/gimhae/hall-10.webp' },
        { name: '더파티 아모르홀', image: '/assets/halls/gimhae/hall-11.webp' },
        { name: '파라곤호텔', image: '/assets/halls/gimhae/hall-12.webp' },
        { name: '그랜드모먼트', image: '/assets/halls/gimhae/hall-13.webp' },
        { name: '헤리움웨딩홀', image: '/assets/halls/gimhae/hall-14.webp' },
        { name: '아바니호텔', image: '/assets/halls/gimhae/hall-15.webp' },
        { name: '롯데호텔', image: '/assets/halls/gimhae/hall-16.webp' },
        { name: '그랜드블랑', image: '/assets/halls/gimhae/hall-17.webp' },
        { name: '다비다웨딩홀', image: '/assets/halls/gimhae/hall-18.webp' },
        { name: '프리미어', image: '/assets/halls/gimhae/hall-19.webp' },
        { name: '디엘', image: '/assets/halls/gimhae/hall-20.webp' },
        { name: '센텀 호텔', image: '/assets/halls/gimhae/hall-21.webp' },
        { name: '아시아드', image: '/assets/halls/gimhae/hall-22.webp' },
        { name: '라온웨딩', image: '/assets/halls/gimhae/hall-23.webp' },
        { name: '부산호텔', image: '/assets/halls/gimhae/hall-24.webp' },
        { name: '라발스호텔', image: '/assets/halls/gimhae/hall-25.webp' },
        { name: '한화리조트', image: '/assets/halls/gimhae/hall-26.webp' },
        { name: '농심호텔', image: '/assets/halls/gimhae/hall-27.webp' },
        { name: '롯데갤러리움', image: '/assets/halls/gimhae/hall-28.webp' },
        { name: '호메르스호텔', image: '/assets/halls/gimhae/hall-29.webp' },
        { name: '사학연금', image: '/assets/halls/gimhae/hall-30.webp' },
        { name: '해암', image: '/assets/halls/gimhae/hall-31.webp' },
        { name: '이리스', image: '/assets/halls/gimhae/hall-32.webp' },
        { name: '골든웨딩홀', image: '/assets/halls/gimhae/hall-33.webp' },
        ],
        studio: GYEONGNAM_STUDIOS,
    },
    pohang: {
        hall: [
        { name: '더누벨', image: '/assets/halls/pohang/hall-01.webp' },
        { name: '더퀸', image: '/assets/halls/pohang/hall-02.webp' },
        { name: '라메르', image: '/assets/halls/pohang/hall-03.webp' },
        { name: '라한호텔', image: '/assets/halls/pohang/hall-04.webp' },
        { name: '서밋컨벤션', image: '/assets/halls/pohang/hall-05.webp' },
        { name: '티파니웨딩', image: '/assets/halls/pohang/hall-06.webp' },
        { name: 'MH컨벤션', image: '/assets/halls/pohang/hall-07.webp' },
        { name: 'M스타하우스웨딩', image: '/assets/halls/pohang/hall-08.webp' },
        { name: '노비아갈라동촌점', image: '/assets/halls/pohang/hall-09.webp' },
        { name: '퀸벨호텔', image: '/assets/halls/pohang/hall-10.webp' },
        { name: '메리어트', image: '/assets/halls/pohang/hall-11.webp' },
        { name: '엑스코 인터불고', image: '/assets/halls/pohang/hall-12.webp' },
        { name: '노비아갈라전자관점', image: '/assets/halls/pohang/hall-13.webp' },
        { name: '엘파소하우스웨딩', image: '/assets/halls/pohang/hall-14.webp' },
        { name: '중앙컨벤션', image: '/assets/halls/pohang/hall-15.webp' },
        { name: '웨딩 메르디앙', image: '/assets/halls/pohang/hall-16.webp' },
        { name: 'AW호텔', image: '/assets/halls/pohang/hall-17.webp' },
        { name: '라온웨딩', image: '/assets/halls/pohang/hall-18.webp' },
        { name: '웨딩비엔나', image: '/assets/halls/pohang/hall-19.webp' },
        { name: '라테라스', image: '/assets/halls/pohang/hall-20.webp' },
        { name: '파라다이스', image: '/assets/halls/pohang/hall-21.webp' },
        { name: '아리아나호텔', image: '/assets/halls/pohang/hall-22.webp' },
        { name: '웨딩아테네', image: '/assets/halls/pohang/hall-23.webp' },
        { name: '수성스퀘어', image: '/assets/halls/pohang/hall-24.webp' },
        { name: '호텔인터불고만촌점', image: '/assets/halls/pohang/hall-25.webp' },
        { name: '라온제나호텔', image: '/assets/halls/pohang/hall-26.webp' },
        { name: '더아트라움', image: '/assets/halls/pohang/hall-27.webp' },
        { name: '스타디움컨벤션웨딩', image: '/assets/halls/pohang/hall-28.webp' },
        { name: '마리드메이', image: '/assets/halls/pohang/hall-29.webp' },
        { name: '뉴욕뉴욕', image: '/assets/halls/pohang/hall-30.webp' },
        { name: '로터스101', image: '/assets/halls/pohang/hall-31.webp' },
        { name: '어반폴', image: '/assets/halls/pohang/hall-32.webp' },
        { name: '칼라디움', image: '/assets/halls/pohang/hall-33.webp' },
        { name: '스카이나인스', image: '/assets/halls/pohang/hall-34.webp' },
        { name: '륜', image: '/assets/halls/pohang/hall-35.webp' },
        { name: '아현정', image: '/assets/halls/pohang/hall-36.webp' },
        { name: '보스코', image: '/assets/halls/pohang/hall-37.webp' },
        { name: '프리아', image: '/assets/halls/pohang/hall-38.webp' },
        { name: 'J컨벤션웨딩', image: '/assets/halls/pohang/hall-39.webp' },
        { name: 'bw웨딩', image: '/assets/halls/pohang/hall-40.webp' },
        { name: '토미스퀘어가든', image: '/assets/halls/pohang/hall-41.webp' },
        { name: '라뷰웨딩', image: '/assets/halls/pohang/hall-42.webp' },
        { name: '금오산호텔', image: '/assets/halls/pohang/hall-43.webp' },
        ],
    },
};

// New regions start from the Daegu content, with venue/date/title placeholders to fill in from the admin.
export function defaultContent(region: RegionId): SiteContent {
    if (region === DEFAULT_REGION) return DEFAULT_CONTENT;
    const { label, en } = regionInfo(region);
    const own = REGION_PARTNERS[region] ?? {};
    return {
        ...DEFAULT_CONTENT,
        partners: DEFAULT_CONTENT.partners.map((c) => {
            const items = own[c.id];
            return items ? { ...c, count: `${items.length}+`, items } : c;
        }),
        event: {
            ...DEFAULT_CONTENT.event,
            brand: `${en} LAMOUR`,
            eyebrow: 'LAMOUR WEDDING CONVENTION · VOL.2026',
            titleLine1: label,
            dateMain: '일정 추후 안내',
            dateSub: '',
        },
        hero: { ...DEFAULT_CONTENT.hero, alt: `${label} 웨딩박람회` },
        location: {
            ...DEFAULT_CONTENT.location,
            placeName: `${label} 박람회장 (추후 안내)`,
            placeAddress: '',
            address1: `${label} (주소 추후 안내)`,
            address2: '',
            addressNote: '',
            notice: '',
            mapQuery: label,
            naverUrl: '',
        },
    };
}

export const tickerText = (e: TickerEntry) =>
    `${e.name}님 010-****-${e.phone4} · ${e.ago} 신청 완료`;

export const naverMapUrl = (loc: SiteContent['location']) =>
    loc.naverUrl || `https://map.naver.com/p/search/${encodeURIComponent(loc.mapQuery)}`;

export const googleMapEmbedUrl = (query: string) =>
    `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;

/* ---------- Sanitizing: coerce untrusted input into the expected shape ---------- */

const str = (v: unknown, max = 200) =>
    typeof v === 'string' ? v.trim().slice(0, max) : '';

const strList = (v: unknown, maxItems = 30) =>
    Array.isArray(v) ? v.map((x) => str(x, 60)).filter(Boolean).slice(0, maxItems) : [];

const int = (v: unknown, min: number, max: number) => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
};

const obj = (v: unknown): Record<string, unknown> =>
    v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

// Only same-site asset paths and https URLs are allowed as image/link targets.
const safeUrl = (v: unknown) => {
    const s = str(v, 500);
    return s.startsWith('/') || s.startsWith('https://') ? s : '';
};

export const sanitize: { [K in SectionKey]: (v: unknown) => SiteContent[K] } = {
    event(v) {
        const o = obj(v);
        return {
            brand: str(o.brand, 40),
            eyebrow: str(o.eyebrow, 80),
            titleLine1: str(o.titleLine1, 40),
            titleAccent: str(o.titleAccent, 40),
            titleRest: str(o.titleRest, 40),
            subtitle: str(o.subtitle, 300),
            dateMain: str(o.dateMain, 60),
            dateSub: str(o.dateSub, 60),
        };
    },
    hero(v) {
        const o = obj(v);
        return { image: safeUrl(o.image), alt: str(o.alt, 100) };
    },
    reviews(v) {
        return (Array.isArray(v) ? v : [])
            .map((r) => {
                const o = obj(r);
                return {
                    text: str(o.text, 500),
                    bold: str(o.bold, 200),
                    author: str(o.author, 80),
                    image: safeUrl(o.image),
                };
            })
            .filter((r) => r.text || r.bold)
            .slice(0, 40);
    },
    seats(v) {
        const o = obj(v);
        const total = int(o.total, 1, 100000);
        return { total, left: int(o.left, 0, total) };
    },
    location(v) {
        const o = obj(v);
        const address1 = str(o.address1);
        return {
            placeName: str(o.placeName),
            placeAddress: str(o.placeAddress),
            address1,
            address2: str(o.address2),
            addressNote: str(o.addressNote),
            phone: str(o.phone, 40),
            hours: str(o.hours, 80),
            notice: str(o.notice, 300),
            mapQuery: str(o.mapQuery) || address1,
            naverUrl: safeUrl(o.naverUrl),
            tmapUrl: safeUrl(o.tmapUrl),
        };
    },
    form(v) {
        const o = obj(v);
        const weddingMonths = strList(o.weddingMonths);
        const visitDays = strList(o.visitDays);
        return {
            weddingMonths: weddingMonths.length ? weddingMonths : DEFAULT_CONTENT.form.weddingMonths,
            visitDays: visitDays.length ? visitDays : DEFAULT_CONTENT.form.visitDays,
        };
    },
    ticker(v) {
        const o = obj(v);
        const entries = (Array.isArray(o.entries) ? o.entries : [])
            .map((e) => {
                const r = obj(e);
                return {
                    name: str(r.name, 20),
                    phone4: str(r.phone4, 4).replace(/\D/g, '').padStart(4, '0'),
                    ago: str(r.ago, 20),
                };
            })
            .filter((e) => e.name)
            .slice(0, 100);
        return { enabled: o.enabled !== false, entries };
    },
    partners(v) {
        return (Array.isArray(v) ? v : [])
            .map((c, i) => {
                const r = obj(c);
                return {
                    id: str(r.id, 40) || `cat-${i}`,
                    label: str(r.label, 30),
                    count: str(r.count, 20),
                    items: (Array.isArray(r.items) ? r.items : [])
                        .map((it) => {
                            const x = obj(it);
                            return { name: str(x.name, 60), image: safeUrl(x.image) };
                        })
                        .filter((it) => it.name)
                        .slice(0, 50),
                };
            })
            .filter((c) => c.label)
            .slice(0, 12);
    },
};

/* ---------- Random applicant generator for the ticker ---------- */

const SURNAMES = '김이박최정강조윤장임한오서신권황안송류홍';
const GIVEN = '민서지수현은하윤예준도건우진영아연유채원나경';
const pick = (s: string) => s[Math.floor(Math.random() * s.length)];

export function randomTickerEntries(count: number): TickerEntry[] {
    const minutes = Array.from({ length: count }, () => Math.floor(Math.random() * 60))
        .sort((a, b) => b - a);
    return minutes.map((m) => ({
        name: `${pick(SURNAMES)}O${pick(GIVEN)}`,
        phone4: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
        ago: m < 1 ? '방금 전' : `${m}분 전`,
    }));
}
