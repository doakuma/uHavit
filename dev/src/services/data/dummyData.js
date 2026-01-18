/**
 * 더미 데이터 (개발용)
 * Supabase 없이도 모든 화면을 테스트할 수 있도록 함
 */

// 더미 습관 데이터
export const DUMMY_HABITS = [
  {
    id: 'habit-1',
    user_id: 'dummy-user-1',
    name: '매일 운동하기',
    description: '하루 30분 이상 운동하기',
    target_value: 30,
    target_unit: '분',
    frequency_type: 'daily',
    frequency_value: 1,
    category: 'exercise',
    reminder_time: '07:00',
    start_date: '2026-01-01',
    end_date: null,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'habit-2',
    user_id: 'dummy-user-1',
    name: '독서하기',
    description: '하루 30페이지 이상 읽기',
    target_value: 30,
    target_unit: '페이지',
    frequency_type: 'daily',
    frequency_value: 1,
    category: 'reading',
    reminder_time: '21:00',
    start_date: '2026-01-05',
    end_date: null,
    is_active: true,
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'habit-3',
    user_id: 'dummy-user-1',
    name: '물 마시기',
    description: '하루 2L 이상 물 마시기',
    target_value: 2,
    target_unit: 'L',
    frequency_type: 'daily',
    frequency_value: 1,
    category: 'health',
    reminder_time: null,
    start_date: '2026-01-10',
    end_date: null,
    is_active: true,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-01-10T00:00:00Z',
  },
];

// 더미 체크인 데이터 생성 함수
function generateDummyCheckins() {
  const checkins = [];
  const today = new Date();
  const habits = DUMMY_HABITS;

  habits.forEach((habit) => {
    const startDate = new Date(habit.start_date);
    
    // 최근 30일 데이터 생성
    for (let i = 0; i < 30; i++) {
      const checkinDate = new Date(today);
      checkinDate.setDate(today.getDate() - i);
      
      // 시작일 이전은 체크인 없음
      if (checkinDate < startDate) continue;
      
      // 랜덤하게 완료/미완료 생성 (70% 완료율)
      const isCompleted = Math.random() > 0.3;
      
      // 완료한 경우 랜덤 값 생성 (목표값의 80-120%)
      let value = null;
      if (isCompleted && habit.target_value) {
        const min = habit.target_value * 0.8;
        const max = habit.target_value * 1.2;
        value = Math.round((Math.random() * (max - min) + min) * 10) / 10;
      }

      checkins.push({
        id: `checkin-${habit.id}-${i}`,
        habit_id: habit.id,
        checkin_date: checkinDate.toISOString().split('T')[0],
        is_completed: isCompleted,
        value: value,
        notes: null,
        created_at: checkinDate.toISOString(),
        updated_at: checkinDate.toISOString(),
      });
    }
  });

  return checkins;
}

export const DUMMY_CHECKINS = generateDummyCheckins();

// 로컬 스토리지 키
const STORAGE_KEY_HABITS = 'uhavit_dummy_habits';
const STORAGE_KEY_CHECKINS = 'uhavit_dummy_checkins';

/**
 * 로컬 스토리지에서 습관 데이터 가져오기
 */
export function getDummyHabits() {
  const stored = localStorage.getItem(STORAGE_KEY_HABITS);
  if (stored) {
    return JSON.parse(stored);
  }
  // 초기 데이터 저장
  localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(DUMMY_HABITS));
  return DUMMY_HABITS;
}

/**
 * 로컬 스토리지에서 체크인 데이터 가져오기
 */
export function getDummyCheckins() {
  const stored = localStorage.getItem(STORAGE_KEY_CHECKINS);
  if (stored) {
    return JSON.parse(stored);
  }
  // 초기 데이터 저장
  localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(DUMMY_CHECKINS));
  return DUMMY_CHECKINS;
}

/**
 * 로컬 스토리지에 습관 데이터 저장
 */
export function saveDummyHabits(habits) {
  localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
}

/**
 * 로컬 스토리지에 체크인 데이터 저장
 */
export function saveDummyCheckins(checkins) {
  localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(checkins));
}

/**
 * 현재 사용자 ID 가져오기
 */
export function getCurrentUserId() {
  const authData = localStorage.getItem('uhavit_dummy_auth');
  if (authData) {
    try {
      const session = JSON.parse(authData);
      return session.user?.id || 'dummy-user-1';
    } catch {
      return 'dummy-user-1';
    }
  }
  return 'dummy-user-1';
}
