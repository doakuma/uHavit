/**
 * 패턴 분석 유틸리티
 */

/**
 * 요일별 성공률 분석
 * @param {Array} checkins - 체크인 배열
 * @returns {Object} 요일별 통계
 */
export function analyzeDayOfWeekPattern(checkins) {
  const dayStats = {
    0: { completed: 0, total: 0 }, // 일요일
    1: { completed: 0, total: 0 }, // 월요일
    2: { completed: 0, total: 0 }, // 화요일
    3: { completed: 0, total: 0 }, // 수요일
    4: { completed: 0, total: 0 }, // 목요일
    5: { completed: 0, total: 0 }, // 금요일
    6: { completed: 0, total: 0 }, // 토요일
  };

  checkins.forEach((checkin) => {
    const date = new Date(checkin.checkin_date);
    const dayOfWeek = date.getDay();
    
    dayStats[dayOfWeek].total++;
    if (checkin.is_completed) {
      dayStats[dayOfWeek].completed++;
    }
  });

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const result = Object.entries(dayStats).map(([day, stats]) => ({
    day: parseInt(day),
    dayName: dayNames[parseInt(day)],
    completed: stats.completed,
    total: stats.total,
    successRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
  }));

  // 성공률 기준으로 정렬
  result.sort((a, b) => b.successRate - a.successRate);

  return {
    byDay: result,
    bestDay: result[0]?.total > 0 ? result[0] : null,
    worstDay: result[result.length - 1]?.total > 0 ? result[result.length - 1] : null,
  };
}

/**
 * 시간대별 성공률 분석 (체크인 시간 기준)
 * @param {Array} checkins - 체크인 배열 (created_at 포함)
 * @returns {Object} 시간대별 통계
 */
export function analyzeTimePattern(checkins) {
  const timeStats = {
    morning: { completed: 0, total: 0 }, // 6-12
    afternoon: { completed: 0, total: 0 }, // 12-18
    evening: { completed: 0, total: 0 }, // 18-24
    night: { completed: 0, total: 0 }, // 0-6
  };

  checkins.forEach((checkin) => {
    if (!checkin.created_at) return;
    
    const date = new Date(checkin.created_at);
    const hour = date.getHours();
    
    let timeSlot;
    if (hour >= 6 && hour < 12) {
      timeSlot = 'morning';
    } else if (hour >= 12 && hour < 18) {
      timeSlot = 'afternoon';
    } else if (hour >= 18 && hour < 24) {
      timeSlot = 'evening';
    } else {
      timeSlot = 'night';
    }

    timeStats[timeSlot].total++;
    if (checkin.is_completed) {
      timeStats[timeSlot].completed++;
    }
  });

  const timeLabels = {
    morning: '오전 (6-12시)',
    afternoon: '오후 (12-18시)',
    evening: '저녁 (18-24시)',
    night: '새벽 (0-6시)',
  };

  const result = Object.entries(timeStats).map(([slot, stats]) => ({
    slot,
    label: timeLabels[slot],
    completed: stats.completed,
    total: stats.total,
    successRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
  }));

  result.sort((a, b) => b.successRate - a.successRate);

  return {
    byTime: result,
    bestTime: result[0]?.total > 0 ? result[0] : null,
    worstTime: result[result.length - 1]?.total > 0 ? result[result.length - 1] : null,
  };
}

/**
 * 패턴 분석 결과를 텍스트로 변환
 * @param {Object} dayPattern - 요일별 패턴 분석 결과
 * @param {Object} timePattern - 시간대별 패턴 분석 결과
 * @returns {string} 분석 결과 텍스트
 */
export function formatPatternAnalysis(dayPattern, timePattern) {
  const insights = [];

  if (dayPattern.bestDay && dayPattern.worstDay) {
    if (dayPattern.bestDay.successRate - dayPattern.worstDay.successRate > 20) {
      insights.push(
        `${dayPattern.bestDay.dayName}요일 성공률(${dayPattern.bestDay.successRate}%)이 ${dayPattern.worstDay.dayName}요일(${dayPattern.worstDay.successRate}%)보다 훨씬 높아요.`
      );
    }
  }

  if (timePattern.bestTime && timePattern.worstTime) {
    if (timePattern.bestTime.successRate - timePattern.worstTime.successRate > 20) {
      insights.push(
        `${timePattern.bestTime.label}에 체크인할 때 성공률(${timePattern.bestTime.successRate}%)이 가장 높아요.`
      );
    }
  }

  return insights.join(' ');
}
