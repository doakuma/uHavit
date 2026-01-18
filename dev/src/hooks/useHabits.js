import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitActive,
} from '@services/supabase/habits';

/**
 * 습관 목록 조회 Hook
 */
export function useHabits() {
  return useQuery({
    queryKey: ['habits'],
    queryFn: getHabits,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 습관 상세 조회 Hook
 * @param {string} id - 습관 ID
 */
export function useHabit(id) {
  return useQuery({
    queryKey: ['habits', id],
    queryFn: () => getHabit(id),
    enabled: !!id,
  });
}

/**
 * 습관 생성 Mutation Hook
 */
export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}

/**
 * 습관 수정 Mutation Hook
 */
export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updateHabit(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habits', data.id] });
    },
  });
}

/**
 * 습관 삭제 Mutation Hook
 */
export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}

/**
 * 습관 활성화/비활성화 Mutation Hook
 */
export function useToggleHabitActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => toggleHabitActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}
