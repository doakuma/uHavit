/**
 * 습관 통계 계산 유틸리티
 */

/**
 * 연속 일수 계산
 * @param {Array} checkins - 체크인 배열
 * @param {Date} fromDate - 시작 날짜 (기본값: 오늘)
 * @returns {number} 연속 일수
 */
export function calculateStreak(checkins, fromDate = new Date()) {
  let streak = 0;
  const sortedCheckins = [...checkins]
    .filter((c) => c.is_completed)
    .sort((a, b) => new Date(b.checkin_date) - new Date(a.checkin_date));

  if (sortedCheckins.length === 0) return 0;

  // 오늘부터 역순으로 체크
  for (let i = 0; i < 365; i++) {
    const date = new Date(fromDate);
    date.setDate(fromDate.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const checkin = sortedCheckins.find((c) => c.checkin_date === dateStr);
    if (checkin && checkin.is_completed) {
      streak++;
    } else if (i === 0) {
      // 오늘이 완료되지 않았으면 연속이 끊긴 것
      break;
    } else {
      // 과거 날짜에서 완료되지 않은 날이 나오면 중단
      break;
    }
  }

  return streak;
}

/**
 * 최고 연속 일수 계산
 * @param {Array} checkins - 체크인 배열
 * @returns {number} 최고 연속 일수
 */
export function calculateMaxStreak(checkins) {
  const sortedCheckins = [...checkins]
    .filter((c) => c.is_completed)
    .sort((a, b) => new Date(a.checkin_date) - new Date(b.checkin_date));

  if (sortedCheckins.length === 0) return 0;

  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate = null;

  sortedCheckins.forEach((checkin) => {
    const checkinDate = new Date(checkin.checkin_date);
    
    if (lastDate === null) {
      currentStreak = 1;
    } else {
      const daysDiff = Math.floor((checkinDate - lastDate) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        // 연속된 날짜
        currentStreak++;
      } else {
        // 연속이 끊김
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }
    
    lastDate = checkinDate;
  });

  return Math.max(maxStreak, currentStreak);
}

/**
 * 성공률 계산
 * @param {Array} checkins - 체크인 배열
 * @returns {number} 성공률 (0-100)
 */
export function calculateSuccessRate(checkins) {
  if (checkins.length === 0) return 0;
  const completedCount = checkins.filter((c) => c.is_completed).length;
  return Math.round((completedCount / checkins.length) * 100);
}

/**
 * 기간별 성공률 계산
 * @param {Array} checkins - 체크인 배열
 * @param {number} days - 기간 (일수)
 * @returns {number} 성공률 (0-100)
 */
export function calculateSuccessRateForPeriod(checkins, days) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days);
  
  const periodCheckins = checkins.filter((c) => {
    const checkinDate = new Date(c.checkin_date);
    return checkinDate >= startDate && checkinDate <= today;
  });

  return calculateSuccessRate(periodCheckins);
}

/**
 * 습관 통계 계산
 * @param {Object} habit - 습관 데이터
 * @param {Array} checkins - 체크인 배열
 * @returns {Object} 통계 객체
 */
export function calculateHabitStats(habit, checkins) {
  const habitCheckins = checkins.filter((c) => c.habit_id === habit.id);
  const completedCount = habitCheckins.filter((c) => c.is_completed).length;
  const totalCount = habitCheckins.length;
  const successRate = calculateSuccessRate(habitCheckins);
  const streak = calculateStreak(habitCheckins);
  const maxStreak = calculateMaxStreak(habitCheckins);
  const weeklySuccessRate = calculateSuccessRateForPeriod(habitCheckins, 7);
  const monthlySuccessRate = calculateSuccessRateForPeriod(habitCheckins, 30);

  return {
    completedCount,
    totalCount,
    successRate,
    streak,
    maxStreak,
    weeklySuccessRate,
    monthlySuccessRate,
  };
}
