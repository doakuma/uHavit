/**
 * 빈도 타입 상수
 */
export const FREQUENCY_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

/**
 * 카테고리 상수
 */
export const CATEGORIES = {
  EXERCISE: 'exercise',
  READING: 'reading',
  HEALTH: 'health',
  LEARNING: 'learning',
  WORK: 'work',
  OTHER: 'other',
};

/**
 * 카테고리 라벨 (한국어)
 */
export const CATEGORY_LABELS = {
  [CATEGORIES.EXERCISE]: '운동',
  [CATEGORIES.READING]: '독서',
  [CATEGORIES.HEALTH]: '건강',
  [CATEGORIES.LEARNING]: '학습',
  [CATEGORIES.WORK]: '업무',
  [CATEGORIES.OTHER]: '기타',
};

/**
 * 빈도 타입 라벨 (한국어)
 */
export const FREQUENCY_LABELS = {
  [FREQUENCY_TYPES.DAILY]: '매일',
  [FREQUENCY_TYPES.WEEKLY]: '주간',
  [FREQUENCY_TYPES.MONTHLY]: '월간',
};

/**
 * 최대 습관 이름 길이
 */
export const MAX_HABIT_NAME_LENGTH = 50;

/**
 * 최대 설명 길이
 */
export const MAX_DESCRIPTION_LENGTH = 200;
