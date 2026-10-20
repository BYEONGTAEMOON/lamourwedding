import type { StaticImageData } from 'next/image';
import gift1 from '@/public/assets/gift1.png';
import gift2 from '@/public/assets/gift2.png';
import gift3 from '@/public/assets/gift3.png';
import gift4 from '@/public/assets/gift4.png';
import gift5 from '@/public/assets/gift5.png';
import gift6 from '@/public/assets/gift6.png';
import gift7 from '@/public/assets/gift7.png';
import gift8 from '@/public/assets/gift8.png';
import gift9 from '@/public/assets/gift9.png';
import gift10 from '@/public/assets/gift10.png';

export const NAV = [
    { href: '#benefits', label: '혜택' },
    { href: '#partners', label: '제휴업체' },
    { href: '#reviews', label: '후기' },
    { href: '#gifts', label: '사은품' },
    { href: '#location', label: '오시는 길' },
];

export const WHY = [
    {
        stat: '스드메 정찰제',
        highlight: '정찰제',
        title: '가격표시제',
        desc: '전문적인 웨딩컨설팅 업체에서 체계적인 결혼준비를 해보세요.',
    },
    {
        stat: '에스크로정책',
        highlight: '정책',
        title: '의무화 기준',
        desc: '안전하고 투명한 결제 시스템 웨딩서비스를 제공합니다.',
    },
];

// Each detail is a list of [plain text, bold text] pairs joined with " · ".
export const BENEFITS: {
    value: string;
    title: string;
    details: [string, string][];
}[] = [
    {
        value: '20만 원',
        title: '사전등록 기프트',
        details: [
            ['결혼준비 가이드북', '무료'],
            ['청첩장할인쿠폰', '10만 원'],
            ['혼수 상품권', '10만 원'],
            ['현장 사은품 세트', ''],
        ],
    },
    {
        value: '최대 65%',
        title: '스드메 프로모션',
        details: [
            ['스튜디오', '40%↓'],
            ['드레스', '35%↓'],
            ['메이크업', '25%↓'],
            ['본식 스냅', '15%↓'],
        ],
    },
    {
        value: '150만 원',
        title: '웨딩홀 혜택',
        details: [
            ['50여 개 웨딩홀', '무료 섭외'],
            ['잔여 타임', '최대 30%↓'],
            ['식사 비교', '10만 원'],
        ],
    },
    {
        value: '최대 5%+',
        title: '혼수 할인',
        details: [
            ['허니문', '최대 150만원 할인'],
            ['예물·예복·한복', '최대 35% 할인'],
            ['가전(LG)', '최대 3%+α'],
        ],
    },
    {
        value: 'VIP 전용',
        title: '추가 혜택',
        details: [
            ['제휴업체 이벤트·행사', '우선 선정'],
            ['업체별 사은품', '현장 지급'],
        ],
    },
];

// Gifts without an image fall back to a numbered tile.
export const GIFTS: { title: string; desc: string; image?: StaticImageData }[] = [
    {
        title: '결혼준비 가이드북',
        desc: '시기별 핵심 체크리스트와 꿀팁을 담았습니다.',
        image: gift1,
    },
    {
        title: '신세계상품권 10만 원',
        desc: '백화점 전 지점 및 제휴처에서 현금처럼 사용하세요.',
        image: gift2,
    },
    {
        title: '스드메 시크릿 할인',
        desc: '박람회 계약자에게만 열리는 역대급 특가입니다.',
        image: gift3,
    },
    {
        title: '혼수 상품권 10만 원',
        desc: '한복·예복·예물 등 필수 상품에 사용 가능합니다.',
        image: gift4,
    },
    {
        title: '모바일 청첩장 무료',
        desc: '감성 가득한 모바일 청첩장을 제작해요.',
        image: gift5,
    },
    {
        title: '액자 세트',
        desc: '포토테이블을 고급스럽게 연출해 드려요.',
        image: gift6,
    },
    {
        title: '드레스 추가금 할인',
        desc: '프리미엄 라인 드레스 부담을 덜어드려요.',
        image: gift7,
    },
    {
        title: '부케 상품권',
        desc: '신부님을 위한 맞춤형 부케를 선물해요.',
        image: gift8,
    },
    {
        title: '피팅 벌수 추가',
        desc: '인생 드레스를 찾도록 피팅을 늘려드려요.',
        image: gift9,
    },
    {
        title: '식전영상 무료제작',
        desc: '예식 오프닝을 빛낼 식전영상을 드립니다.',
        image: gift10,
    },
];

export const FAQS = [
    {
        q: '웨딩박람회에 방문하면 어떤 혜택이 있나요?',
        a: '인기 웨딩홀부터 스드메, 예물, 혼수, 신혼여행까지 한자리에서 비교해 보세요. 박람회 현장에서만 만나볼 수 있는 특별 프로모션과 다양한 결혼 준비 혜택을 확인하실 수 있습니다.',
    },
    {
        q: '웨딩홀 견적도 비교할 수 있나요?',
        a: '지역의 다양한 웨딩홀을 예산과 희망 날짜에 맞춰 비교 상담받으실 수 있습니다. 식대, 대관료, 보증 인원 등 주요 조건을 꼼꼼하게 확인하고 나에게 맞는 웨딩홀을 찾아보세요.',
    },
    {
        q: '결혼 준비 비용을 절약할 수 있을까요?',
        a: '결혼 준비는 같은 조건이라도 선택에 따라 비용이 달라질 수 있습니다. 웨딩 전문가와 함께 예산을 계획하고, 다양한 업체의 견적과 박람회 특별 혜택을 비교해 합리적인 결혼 준비를 시작해 보세요.',
    },
    {
        q: '아직 결혼 날짜가 정해지지 않았는데 방문해도 되나요?',
        a: '물론입니다! 결혼 날짜나 웨딩홀이 정해지지 않아도 괜찮습니다. 결혼 준비 순서부터 예상 비용, 웨딩홀 선택까지 전문가의 상담을 통해 차근차근 준비할 수 있습니다.',
    },
    {
        q: '스드메 패키지도 비교할 수 있나요?',
        a: '원하는 웨딩 스타일과 예산에 맞춰 스튜디오, 드레스, 메이크업 구성을 비교해 보세요. 다양한 스타일과 패키지별 포함 사항을 살펴보고 나에게 어울리는 웨딩 서비스를 선택할 수 있습니다.',
    },
    {
        q: '꼭 계약해야 하나요?',
        a: '꼭 계약하실 필요는 없습니다. 다양한 웨딩 상품과 견적을 비교하고 충분히 상담받아 보세요. 중요한 결혼 준비인 만큼 원하는 조건을 꼼꼼히 확인하고 신중하게 결정하시는 것이 좋습니다.',
    },
];
