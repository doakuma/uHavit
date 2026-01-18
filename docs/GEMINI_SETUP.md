# Google Gemini API 무료 티어 설정 가이드

## 📋 개요

Google Gemini API는 무료 티어를 제공하여 개발 및 테스트에 사용할 수 있습니다.

### 무료 티어 제한
- **분당 요청 수**: 60회
- **월간 토큰**: 1,500만 토큰까지 무료
- **결제 정보**: 불필요

---

## 🚀 설정 방법

### 1단계: Google AI Studio 접속

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. Google 계정으로 로그인 (Gmail 계정 사용 가능)

### 2단계: API 키 생성

1. "Get API key" 또는 "Create API Key" 버튼 클릭
2. 프로젝트 선택 (새 프로젝트 생성 가능)
3. API 키가 생성되면 복사 (한 번만 표시되므로 안전하게 보관)

### 3단계: 환경 변수 설정

`dev/.env.local` 파일을 열고 다음을 추가:

```bash
# AI API 제공자 선택 (gemini 또는 openai)
VITE_AI_PROVIDER=gemini

# Gemini API 키
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Gemini 모델 선택 (선택사항, 기본값: gemini-1.5-flash)
# 옵션: gemini-1.5-flash (빠름, 무료 티어 적합), gemini-1.5-pro (더 강력)
VITE_GEMINI_MODEL=gemini-1.5-flash
```

**중요**: 
- `your_gemini_api_key_here` 부분을 실제 API 키로 교체하세요
- `.env.local` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함됨)

### 4단계: 개발 서버 재시작

환경 변수를 변경했으므로 개발 서버를 재시작해야 합니다:

```bash
# 개발 서버 중지 (Ctrl+C)
# 다시 시작
pnpm dev
```

---

## ✅ 테스트 방법

1. 브라우저에서 `http://localhost:5173` 접속
2. 로그인 후 Chat 페이지로 이동
3. 메시지를 입력하고 전송
4. Gemini API로 응답이 오는지 확인

---

## 🔍 문제 해결

### API 키 오류가 발생하는 경우

**에러 메시지**: "Gemini API 키가 설정되지 않았습니다"

**해결 방법**:
1. `.env.local` 파일에 `VITE_GEMINI_API_KEY`가 올바르게 설정되었는지 확인
2. 개발 서버를 재시작했는지 확인
3. API 키 앞뒤에 공백이나 따옴표가 없는지 확인

### Rate Limit 오류가 발생하는 경우

**에러 메시지**: "요청이 너무 많습니다"

**해결 방법**:
- 분당 60회 제한이 있으므로 잠시 기다린 후 다시 시도
- 개발 중에는 요청을 줄이거나 캐싱 활용

### API 키가 유효하지 않은 경우

**에러 메시지**: "Gemini API 오류"

**해결 방법**:
1. [Google AI Studio](https://aistudio.google.com/app/apikey)에서 API 키가 활성화되어 있는지 확인
2. API 키를 다시 생성해보기
3. 프로젝트에 Gemini API가 활성화되어 있는지 확인

---

## 🔄 OpenAI로 전환하는 방법

나중에 OpenAI를 사용하고 싶다면:

```bash
# .env.local 파일 수정
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

그리고 개발 서버를 재시작하면 됩니다.

---

## 📚 참고 자료

- [Google AI Studio](https://aistudio.google.com/app/apikey)
- [Gemini API 문서](https://ai.google.dev/docs)
- [Gemini API 가격](https://ai.google.dev/pricing)

---

## 💡 팁

1. **API 키 보안**: API 키는 절대 공개 저장소에 올리지 마세요
2. **무료 티어 모니터링**: [Google Cloud Console](https://console.cloud.google.com/)에서 사용량 확인 가능
3. **개발 환경**: 무료 티어는 개발/테스트용으로 충분합니다
4. **프로덕션**: 프로덕션 환경에서는 유료 플랜을 고려하세요
