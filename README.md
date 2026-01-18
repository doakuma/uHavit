# 습관 생성 AI Agent

AI 기반 습관 형성 도우미 웹 애플리케이션입니다.

## 📋 프로젝트 개요

사용자가 원하는 습관을 형성하도록 도와주고, 개인 맞춤형 습관 계획을 수립하며, 지속적인 추적 및 모니터링을 통해 습관 형성을 지원하는 AI 기반 웹 애플리케이션입니다.

## ✨ 주요 기능

### MVP 기능
- ✅ 습관 생성 및 관리
- ✅ 습관 체크인 (완료/미완료, 수치 입력)
- ✅ AI 채팅 (개인화된 조언 및 피드백)
- ✅ 기본 통계 및 시각화
- ✅ 캘린더 뷰 (히트맵)
- ✅ 알림 기능

### Phase 2 (예정)
- 습관 간 상관관계 분석
- 목표 달성 예측
- 사진 첨부 및 일기 작성
- 다국어 지원

## 🛠 기술 스택

- **프론트엔드**: React 18+, JavaScript, Vite
- **백엔드**: Supabase (PostgreSQL, Auth, Realtime)
- **AI**: OpenAI GPT API (gpt-4o-mini)
- **상태 관리**: React Query
- **스타일링**: CSS Modules
- **배포**: Vercel

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+
- pnpm 8+
- Supabase 계정
- OpenAI API 키

### 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/doakuma/uHavit.git
cd uHavit
```

2. 의존성 설치
```bash
pnpm install
```

3. 환경 변수 설정
```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 다음 값들을 설정하세요:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 개발 서버 실행
```bash
pnpm dev
```

5. 브라우저에서 열기
```
http://localhost:5173
```

## 📁 프로젝트 구조

```
uHavit/
├── docs/                   # 프로젝트 문서
├── src/
│   ├── components/        # React 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── hooks/             # Custom Hooks (React Query)
│   ├── services/          # API 서비스
│   ├── utils/             # 유틸리티 함수
│   └── constants/         # 상수 정의
├── supabase/              # Supabase 설정
└── public/                # 정적 파일
```

자세한 구조는 [프로젝트 구조 제안서](./docs/05-프로젝트-구조-제안서.md)를 참고하세요.

## 📚 문서

- [프로젝트 요건 정의서](./docs/01-프로젝트-요건정의서.md)
- [기능 명세서](./docs/02-기능-명세서.md)
- [기술 명세서](./docs/03-기술-명세서.md)
- [MVP 범위 정의서](./docs/04-MVP-범위-정의서.md)
- [프로젝트 구조 제안서](./docs/05-프로젝트-구조-제안서.md)
- [파이썬 추가 가이드](./docs/06-파이썬-추가-가이드.md)

## 🧪 개발

### 스크립트

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview

# 린트 검사
pnpm lint
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 🤝 기여

기여를 환영합니다! 이슈를 생성하거나 Pull Request를 제출해주세요.

## 📧 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**참고**: 이 프로젝트는 현재 MVP 개발 단계입니다.
