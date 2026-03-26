# 🎱 로또 당첨번호

동행복권 로또 6/45 당첨번호를 확인할 수 있는 모바일 최적화 웹사이트입니다.

> 운영 주소는 배포 환경의 `NEXT_PUBLIC_SITE_URL` 값으로 설정됩니다.

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| **최신 당첨번호** | 매주 자동 갱신되는 최신 로또 당첨번호 확인 |
| **회차별 조회** | 1회차부터 최신 회차까지 전체 당첨 결과 조회 |
| **번호 통계** | 번호별 출현 빈도, 마지막 출현 회차, 평균 출현 간격 |
| **번호 생성기** | 랜덤 번호 생성 및 제외번호 선택 기능 |

## 🛠 기술 스택

- **Framework** — [Next.js 15](https://nextjs.org/) (App Router, Server Components)
- **Language** — TypeScript (strict mode)
- **Styling** — [Tailwind CSS 4](https://tailwindcss.com/)
- **Deploy** — [Vercel](https://vercel.com/)
- **Data** — [동행복권 공식 API](https://www.dhlottery.co.kr/)

## 📱 페이지 구조

```
/                   → 최신 당첨번호 (메인)
/lotto/{회차}       → 회차별 당첨 결과
/history            → 전체 당첨번호 이력
/stats              → 번호 통계
/generator          → 번호 생성기
```

## 🔍 SEO

- SSG + ISR (최신 회차 1시간, 과거 회차 영구 캐시)
- JSON-LD 구조화 데이터 (`WebSite`, `Article`, `BreadcrumbList`)
- 동적 sitemap.xml / robots.txt
- 페이지별 메타 태그 (OG, Twitter Card)
- 시맨틱 HTML + `lang="ko"`

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# (선택) SEO canonical/sitemap 기준 도메인
export NEXT_PUBLIC_SITE_URL="https://your-domain.example"

# 프로덕션 빌드
npm run build

# 빌드 결과 실행
npm start
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx            # 루트 레이아웃
│   ├── page.tsx              # 메인 (최신 당첨번호)
│   ├── sitemap.ts            # 동적 sitemap
│   ├── robots.ts             # robots.txt
│   ├── manifest.ts           # PWA manifest
│   ├── lotto/[round]/        # 회차별 페이지
│   ├── history/              # 당첨번호 이력
│   ├── stats/                # 번호 통계
│   └── generator/            # 번호 생성기
├── components/               # UI 컴포넌트
├── lib/                      # API, 유틸, SEO, 상수
└── types/                    # TypeScript 타입 정의
```

## 📄 라이선스

MIT

---

> ⚠️ 본 사이트는 동행복권과 관련 없는 비공식 프로젝트입니다. 당첨번호 데이터는 동행복권에서 제공하는 공공 정보입니다.
