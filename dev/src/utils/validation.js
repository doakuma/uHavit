import { FREQUENCY_TYPES, CATEGORIES, MAX_HABIT_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from '@constants';

/**
 * 습관 데이터 유효성 검사
 * @param {Object} habit - 습관 데이터
 * @returns {Object} { isValid: boolean, errors: Array }
 */
export function validateHabit(habit) {
  const errors = [];

  if (!habit.name || habit.name.trim().length === 0) {
    errors.push('습관 이름은 필수입니다.');
  } else if (habit.name.length > MAX_HABIT_NAME_LENGTH) {
    errors.push(`습관 이름은 ${MAX_HABIT_NAME_LENGTH}자 이하여야 합니다.`);
  }

  if (habit.description && habit.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`설명은 ${MAX_DESCRIPTION_LENGTH}자 이하여야 합니다.`);
  }

  const validFrequencyTypes = Object.values(FREQUENCY_TYPES);
  if (!validFrequencyTypes.includes(habit.frequency_type)) {
    errors.push('유효하지 않은 빈도 타입입니다.');
  }

  if (!habit.frequency_value || habit.frequency_value < 1) {
    errors.push('빈도 값은 1 이상이어야 합니다.');
  }

  const validCategories = Object.values(CATEGORIES);
  if (habit.category && !validCategories.includes(habit.category)) {
    errors.push('유효하지 않은 카테고리입니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 체크인 데이터 유효성 검사
 * @param {Object} checkin - 체크인 데이터
 * @returns {Object} { isValid: boolean, errors: Array }
 */
export function validateCheckin(checkin) {
  const errors = [];

  if (!checkin.habit_id) {
    errors.push('습관 ID는 필수입니다.');
  }

  if (!checkin.checkin_date) {
    errors.push('체크인 날짜는 필수입니다.');
  }

  if (checkin.is_completed === undefined || checkin.is_completed === null) {
    errors.push('완료 여부는 필수입니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
