import { supabase } from './client';
import * as dummyData from '../data/dummyData';

// 더미 모드 활성화 여부
const USE_DUMMY_MODE =
  import.meta.env.DEV &&
  (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);

/**
 * 체크인 기록
 * @param {Object} checkin - 체크인 데이터
 * @returns {Promise<Object>} 생성된 체크인
 */
export async function createCheckin(checkin) {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const checkins = dummyData.getDummyCheckins();
    const newCheckin = {
      ...checkin,
      id: `checkin-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // 기존 체크인이 있으면 업데이트, 없으면 추가
    const index = checkins.findIndex(
      (c) => c.habit_id === checkin.habit_id && c.checkin_date === checkin.checkin_date
    );
    
    if (index !== -1) {
      checkins[index] = { ...checkins[index], ...newCheckin };
    } else {
      checkins.push(newCheckin);
    }
    
    dummyData.saveDummyCheckins(checkins);
    return newCheckin;
  }

  const { data, error } = await supabase
    .from('habit_checkins')
    .upsert(checkin, { onConflict: 'habit_id,checkin_date' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 습관별 체크인 조회
 * @param {string} habitId - 습관 ID
 * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns {Promise<Array>} 체크인 배열
 */
export async function getCheckins(habitId, startDate, endDate) {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const checkins = dummyData.getDummyCheckins();
    return checkins.filter((c) => {
      if (c.habit_id !== habitId) return false;
      if (startDate && c.checkin_date < startDate) return false;
      if (endDate && c.checkin_date > endDate) return false;
      return true;
    });
  }

  let query = supabase
    .from('habit_checkins')
    .select('*')
    .eq('habit_id', habitId)
    .order('checkin_date', { ascending: true });

  if (startDate) {
    query = query.gte('checkin_date', startDate);
  }
  if (endDate) {
    query = query.lte('checkin_date', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * 오늘의 체크인 조회
 * @param {string} habitId - 습관 ID
 * @returns {Promise<Object|null>} 체크인 데이터
 */
export async function getTodayCheckin(habitId) {
  const today = new Date().toISOString().split('T')[0];
  const checkins = await getCheckins(habitId, today, today);
  return checkins.length > 0 ? checkins[0] : null;
}
