-- ============================================
-- uHavit 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. profiles 테이블 생성
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. habits 테이블 생성
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  target_unit TEXT, -- '분', 'km', '페이지' 등
  frequency_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  frequency_value INTEGER NOT NULL, -- 주 N회, 월 N회 등
  category TEXT, -- 'exercise', 'reading', 'health', 'learning', 'work', 'other'
  reminder_time TIME,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. habit_checkins 테이블 생성
CREATE TABLE IF NOT EXISTS habit_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  value NUMERIC, -- 수치 입력 시 값
  notes TEXT, -- Phase 2: 일기
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(habit_id, checkin_date)
);

-- 4. ai_conversations 테이블 생성 (MVP)
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  metadata JSONB, -- 추가 컨텍스트 정보
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 인덱스 생성
-- ============================================

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_active ON habits(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_checkins_habit_date ON habit_checkins(habit_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON habit_checkins(checkin_date);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON ai_conversations(user_id, created_at);

-- ============================================
-- Row Level Security (RLS) 정책
-- ============================================

-- profiles: 사용자는 자신의 프로필만 조회/수정 가능
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- habits: 사용자는 자신의 습관만 조회/수정/삭제 가능
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own habits" ON habits;
CREATE POLICY "Users can manage own habits"
  ON habits FOR ALL
  USING (auth.uid() = user_id);

-- habit_checkins: 사용자는 자신의 습관 체크인만 조회/수정 가능
ALTER TABLE habit_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own checkins" ON habit_checkins;
CREATE POLICY "Users can manage own checkins"
  ON habit_checkins FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_checkins.habit_id
      AND habits.user_id = auth.uid()
    )
  );

-- ai_conversations: 사용자는 자신의 대화만 조회/생성 가능
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own conversations" ON ai_conversations;
CREATE POLICY "Users can manage own conversations"
  ON ai_conversations FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- 트리거 함수: 사용자 생성 시 프로필 자동 생성
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 업데이트 시간 자동 갱신 함수
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- profiles 테이블 업데이트 시간 트리거
DROP TRIGGER IF EXISTS set_updated_at_profiles ON profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- habits 테이블 업데이트 시간 트리거
DROP TRIGGER IF EXISTS set_updated_at_habits ON habits;
CREATE TRIGGER set_updated_at_habits
  BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- habit_checkins 테이블 업데이트 시간 트리거
DROP TRIGGER IF EXISTS set_updated_at_checkins ON habit_checkins;
CREATE TRIGGER set_updated_at_checkins
  BEFORE UPDATE ON habit_checkins
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
