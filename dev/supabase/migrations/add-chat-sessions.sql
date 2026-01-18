-- ============================================
-- 채팅 세션 기능 추가 마이그레이션
-- 기존 ai_conversations 테이블에 session_id 컬럼 추가
-- ============================================

-- 1. ai_chat_sessions 테이블 생성
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT, -- 세션 제목 (첫 메시지 또는 사용자 지정)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. ai_conversations 테이블에 session_id 컬럼 추가 (NULL 허용)
ALTER TABLE ai_conversations 
  ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES ai_chat_sessions(id) ON DELETE CASCADE;

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_sessions_user ON ai_chat_sessions(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON ai_conversations(session_id, created_at);

-- 4. RLS 정책 추가
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own chat sessions" ON ai_chat_sessions;
CREATE POLICY "Users can manage own chat sessions"
  ON ai_chat_sessions FOR ALL
  USING (auth.uid() = user_id);

-- 5. 업데이트 시간 트리거 추가
DROP TRIGGER IF EXISTS set_updated_at_sessions ON ai_chat_sessions;
CREATE TRIGGER set_updated_at_sessions
  BEFORE UPDATE ON ai_chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. 기존 메시지들을 기본 세션으로 마이그레이션 (선택사항)
-- 각 사용자별로 기본 세션을 생성하고, 기존 메시지들을 해당 세션에 연결
DO $$
DECLARE
  user_record RECORD;
  default_session_id UUID;
BEGIN
  -- 각 사용자별로 처리
  FOR user_record IN SELECT DISTINCT user_id FROM ai_conversations WHERE session_id IS NULL
  LOOP
    -- 기본 세션 생성
    INSERT INTO ai_chat_sessions (user_id, title, created_at, updated_at)
    VALUES (user_record.user_id, '기본 대화', NOW(), NOW())
    RETURNING id INTO default_session_id;
    
    -- 해당 사용자의 모든 메시지를 기본 세션에 연결
    UPDATE ai_conversations
    SET session_id = default_session_id
    WHERE user_id = user_record.user_id AND session_id IS NULL;
  END LOOP;
END $$;
