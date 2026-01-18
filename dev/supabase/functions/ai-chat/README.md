# AI Chat Edge Function

Supabase Edge Function을 사용한 AI 채팅 기능입니다.

## 설정 방법

### 1. Edge Function 배포

```bash
# Supabase CLI 설치 (필요시)
npm install -g supabase

# Supabase 프로젝트 연결
supabase link --project-ref your-project-ref

# Edge Function 배포
supabase functions deploy ai-chat
```

### 2. 환경 변수 설정

Supabase 대시보드에서 다음 환경 변수를 설정하세요:

- `OPENAI_API_KEY`: OpenAI API 키
- `SUPABASE_URL`: Supabase 프로젝트 URL (자동 설정됨)
- `SUPABASE_ANON_KEY`: Supabase Anon Key (자동 설정됨)

**설정 위치**: Supabase Dashboard > Edge Functions > ai-chat > Settings > Secrets

### 3. 클라이언트에서 사용

`.env.local` 파일에 다음을 추가:

```bash
VITE_USE_AI_EDGE_FUNCTION=true
```

이렇게 하면 클라이언트에서 직접 OpenAI API를 호출하는 대신 Edge Function을 사용합니다.

## 보안

- OpenAI API 키가 클라이언트에 노출되지 않습니다
- 서버에서만 API 키를 사용합니다
- RLS 정책으로 사용자 데이터 접근을 제어합니다

## 참고

- Edge Function을 사용하지 않으려면 `.env.local`에서 `VITE_USE_AI_EDGE_FUNCTION`을 제거하거나 `false`로 설정하세요
- 개발 환경에서는 클라이언트에서 직접 호출하는 방식도 사용 가능합니다 (보안 주의)
