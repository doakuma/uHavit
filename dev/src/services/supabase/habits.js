import { supabase } from './client';
import * as dummyData from '../data/dummyData';

// 더미 모드 활성화 여부
const USE_DUMMY_MODE =
  import.meta.env.DEV &&
  (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);

/**
 * 습관 목록 조회
 * @returns {Promise<Array>} 습관 배열
 */
export async function getHabits() {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 300)); // 지연 시뮬레이션
    const habits = dummyData.getDummyHabits();
    const userId = dummyData.getCurrentUserId();
    return habits.filter((h) => h.user_id === userId && h.is_active);
  }

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 습관 상세 조회
 * @param {string} id - 습관 ID
 * @returns {Promise<Object>} 습관 데이터
 */
export async function getHabit(id) {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const habits = dummyData.getDummyHabits();
    const habit = habits.find((h) => h.id === id);
    if (!habit) {
      throw new Error('습관을 찾을 수 없습니다.');
    }
    return habit;
  }

  const { data, error } = await supabase.from('habits').select('*').eq('id', id).single();

  if (error) throw error;
  return data;
}

/**
 * 습관 생성
 * @param {Object} habit - 습관 데이터
 * @returns {Promise<Object>} 생성된 습관
 */
export async function createHabit(habit) {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userId = dummyData.getCurrentUserId();
    const newHabit = {
      ...habit,
      id: `habit-${Date.now()}`,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const habits = dummyData.getDummyHabits();
    habits.push(newHabit);
    dummyData.saveDummyHabits(habits);
    return newHabit;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const { data, error } = await supabase
    .from('habits')
    .insert({
      ...habit,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 습관 수정
 * @param {string} id - 습관 ID
 * @param {Object} updates - 수정할 데이터
 * @returns {Promise<Object>} 수정된 습관
 */
export async function updateHabit(id, updates) {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const habits = dummyData.getDummyHabits();
    const index = habits.findIndex((h) => h.id === id);
    if (index === -1) {
      throw new Error('습관을 찾을 수 없습니다.');
    }
    habits[index] = {
      ...habits[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    dummyData.saveDummyHabits(habits);
    return habits[index];
  }

  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 습관 삭제 (소프트 삭제)
 * @param {string} id - 습관 ID
 * @returns {Promise<void>}
 */
export async function deleteHabit(id) {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const habits = dummyData.getDummyHabits();
    const index = habits.findIndex((h) => h.id === id);
    if (index !== -1) {
      habits[index].is_active = false;
      habits[index].updated_at = new Date().toISOString();
      dummyData.saveDummyHabits(habits);
    }
    return;
  }

  const { error } = await supabase.from('habits').update({ is_active: false }).eq('id', id);

  if (error) throw error;
}

/**
 * 습관 활성화/비활성화
 * @param {string} id - 습관 ID
 * @param {boolean} isActive - 활성화 여부
 * @returns {Promise<Object>} 수정된 습관
 */
export async function toggleHabitActive(id, isActive) {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const habits = dummyData.getDummyHabits();
    const index = habits.findIndex((h) => h.id === id);
    if (index === -1) {
      throw new Error('습관을 찾을 수 없습니다.');
    }
    habits[index].is_active = isActive;
    habits[index].updated_at = new Date().toISOString();
    dummyData.saveDummyHabits(habits);
    return habits[index];
  }

  const { data, error } = await supabase
    .from('habits')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
