# 라모르 웨딩박람회 랜딩 페이지

Next.js 16 랜딩 페이지와 `/admin` 관리자 페이지입니다. 데이터는 Supabase에 저장하고 Vercel에 배포합니다.

## 지역별 페이지

| 지역 | 주소 |
| --- | --- |
| 전체 지역 안내 (메인) | `/` |
| 대구 | `/daegu` |
| 김해 | `/gimhae` |
| 부산 | `/busan` |
| 포항 | `/pohang` |

관리자 왼쪽의 **지역별 페이지 관리**에서 지역을 고르면, 아래 메뉴가 모두 그 지역의 내용을 편집합니다. 신청 명단은 모든 지역이 한곳에 모이고 지역으로 필터링할 수 있습니다. 지역을 추가하려면 `lib/regions.ts`에 한 줄을 넣으면 됩니다.

## 관리자에서 바꿀 수 있는 것

| 메뉴 | 내용 |
| --- | --- |
| 신청 명단 | 사전예약 신청 목록 검색, 상태(신규/연락완료/방문완료/취소), 메모, 삭제, CSV 다운로드, 번호 차단(차단된 번호의 신청은 저장되지 않음) |
| 박람회 정보 | 상단 로고 글자, 첫 화면 제목·소개 문구, 박람회 날짜 |
| 메인 이미지 · 후기 | 첫 화면 사진, 후기 슬라이드 |
| 한정 인원 · 잔여석 | "이번 주 N팀 한정", 잔여석 |
| 제휴업체 목록 | 카테고리(웨딩홀·스튜디오·드레스·혼수 등) 이름과 업체 수, 업체명, 사진 업로드, 순서 변경 |
| 오시는 길 · 지도 | 장소명, 주소, 문의 전화, 영업시간, 안내 문구, 지도 검색어, 네이버/TMAP 링크 |
| 신청폼 옵션 | 결혼 예정월, 방문 희망일 선택지 |
| 상단 신청 알림 | 알림 띠 표시 여부, 문구 목록 수정, 랜덤 생성 |

저장하면 사이트에 바로 반영됩니다.

## 로컬 저장 모드 (Supabase 없이)

Supabase 환경변수가 비어 있으면 자동으로 이 컴퓨터의 파일에 저장합니다.

- 관리자에서 수정한 내용: `data/site-content.json`
- 업로드한 사진: `data/uploads/` (주소는 `/uploads/...`)
- 신청 명단: `data/reservations.json` (개인정보라 git에 올라가지 않음)

`npm run dev`나 `npm run start`로 한 컴퓨터에서 돌릴 때만 동작합니다. **Vercel에서는 파일을 저장할 수 없으므로** 배포 전에 아래 Supabase 설정을 하세요. Supabase 값을 넣으면 자동으로 Supabase를 사용합니다. 로컬에 저장한 내용은 자동으로 옮겨지지 않습니다.

## 처음 설정하기

1. **Supabase 프로젝트 만들기**: [supabase.com](https://supabase.com)에서 새 프로젝트를 만듭니다.
2. **테이블 만들기**: Supabase → SQL Editor에 [`supabase/schema.sql`](supabase/schema.sql) 내용을 붙여넣고 실행합니다.
   신청 테이블, 콘텐츠 테이블, 이미지 저장용 `assets` 버킷이 만들어집니다.
3. **환경변수 설정**: `.env.example`을 `.env.local`로 복사하고 값을 채웁니다.
   - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: Supabase → Project Settings → API
   - `ADMIN_PASSWORD`: 관리자 로그인 비밀번호 (길고 추측하기 어렵게)
   - `ADMIN_SESSION_SECRET`: `openssl rand -base64 32`로 만든 임의 문자열
4. **Vercel에도 같은 환경변수 입력**: Vercel → Project → Settings → Environment Variables에 위 4개를 넣고 다시 배포합니다.

> `SUPABASE_SERVICE_ROLE_KEY`는 모든 데이터에 접근할 수 있는 키입니다. 깃에 올리거나 다른 사람에게 공유하지 마세요.

DB에 아직 저장된 값이 없는 항목은 코드에 있는 기본값(`lib/site-content.ts`)으로 표시됩니다.

## 새 신청 알림 메일 (선택)

신청이 들어올 때마다 지정한 이메일로 알림을 보냅니다. [Resend](https://resend.com)를 사용합니다(무료 하루 100통).

1. resend.com에 가입하고 **API Keys → Create API Key**로 키를 만듭니다.
2. Vercel 환경변수에 추가하고 다시 배포합니다.
   - `RESEND_API_KEY`: 만든 키 (`re_`로 시작)
   - `NOTIFY_EMAIL`: 받을 이메일. 여러 명이면 쉼표로 구분
3. Resend에 도메인을 인증하기 전에는 **Resend에 가입한 이메일로만** 받을 수 있습니다.

값이 없으면 알림만 건너뛰고 신청은 정상 저장됩니다. 차단된 번호, 중복·스팸으로 걸러진 신청은 알림을 보내지 않습니다.

## 개발

```bash
npm run dev     # http://localhost:3000, 관리자는 /admin
npm run build
npm run lint
```

## 구조

- `app/page.tsx`: 메인. 네 지역 박람회를 날짜순 카드로 보여주고 각 지역 페이지로 연결합니다.
- `app/[region]/page.tsx`, `app/_components/landing.tsx`: 지역별 랜딩 페이지. 관리자 편집 항목은 `lib/content.ts`의 `getSiteContent()`에서 읽습니다(캐시, 저장 시 즉시 갱신).
- `app/_content.ts`: 코드로만 관리하는 고정 문구(혜택, 사은품, FAQ 등)
- `app/actions.ts`: 사전예약 접수
- `app/admin/`: 관리자 화면과 Server Actions
- `lib/`: 데이터 형식·기본값, Supabase 클라이언트, 로그인 세션
- `proxy.ts`: 로그인하지 않은 `/admin` 접근을 로그인 페이지로 보냄
