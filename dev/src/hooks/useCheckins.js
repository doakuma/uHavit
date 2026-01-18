import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createCheckin, getCheckins, getTodayCheckin } from '@services/supabase/checkins';

/**
 * 습관별 체크인 조회 Hook
 * @param {string} habitId - 습관 ID
 * @param {string} startDate - 시작 날짜 (YYYY-MM-DD, 선택)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD, 선택)
 */
export function useCheckins(habitId, startDate, endDate) {
  return useQuery({
    queryKey: ['checkins', habitId, startDate, endDate],
    queryFn: () => getCheckins(habitId, startDate, endDate),
    enabled: !!habitId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 오늘의 체크인 조회 Hook
 * @param {string} habitId - 습관 ID
 */
export function useTodayCheckin(habitId) {
  return useQuery({
    queryKey: ['checkins', habitId, 'today'],
    queryFn: () => getTodayCheckin(habitId),
    enabled: !!habitId,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 체크인 생성/수정 Mutation Hook
 */
export function useCreateCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCheckin,
    onSuccess: (data) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['checkins', data.habit_id] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habits', data.habit_id] });
    },
  });
}
