/**
 * 습관 개선 제안 유틸리티
 */

/**
 * 목표 조정 제안 생성
 * @param {Object} habit - 습관 데이터
 * @param {Object} stats - 통계 데이터
 * @returns {Object|null} 제안 객체
 */
export function suggestTargetAdjustment(habit, stats) {
  if (!habit.target_value || !stats || stats.totalCount < 7) {
    return null;
  }

  // 최근 7일간의 평균 값 계산
  const recentCheckins = stats.recentCheckins || [];
  const completedWithValue = recentCheckins
    .filter((c) => c.is_completed && c.value !== null && c.value !== undefined)
    .slice(-7);

  if (completedWithValue.length < 3) {
    return null;
  }

  const avgValue = completedWithValue.reduce((sum, c) => sum + parseFloat(c.value), 0) / completedWithValue.length;
  const targetValue = parseFloat(habit.target_value);
  const ratio = avgValue / targetValue;

  // 평균이 목표의 80% 미만이면 목표를 낮추는 제안
  if (ratio < 0.8 && stats.successRate < 60) {
    const suggestedValue = Math.round(avgValue * 1.1); // 평균의 110%로 제안
    return {
      type: 'lower_target',
      message: `최근 평균(${avgValue.toFixed(1)}${habit.target_unit})이 목표보다 낮아요. 목표를 ${suggestedValue}${habit.target_unit}로 낮춰보는 건 어때요?`,
      currentTarget: targetValue,
      suggestedTarget: suggestedValue,
      unit: habit.target_unit,
    };
  }

  // 평균이 목표의 120% 이상이면 목표를 높이는 제안
  if (ratio > 1.2 && stats.successRate >= 80) {
    const suggestedValue = Math.round(avgValue * 0.9); // 평균의 90%로 제안
    return {
      type: 'raise_target',
      message: `최근 평균(${avgValue.toFixed(1)}${habit.target_unit})이 목표보다 높아요. 목표를 ${suggestedValue}${habit.target_unit}로 높여보는 건 어때요?`,
      currentTarget: targetValue,
      suggestedTarget: suggestedValue,
      unit: habit.target_unit,
    };
  }

  return null;
}

/**
 * 빈도 조정 제안 생성
 * @param {Object} habit - 습관 데이터
 * @param {Object} stats - 통계 데이터
 * @returns {Object|null} 제안 객체
 */
export function suggestFrequencyAdjustment(habit, stats) {
  if (!stats || stats.totalCount < 14) {
    return null;
  }

  // 주간 성공률이 50% 미만이고 빈도가 매일이면 주 N회로 제안
  if (habit.frequency_type === 'daily' && stats.weeklySuccessRate < 50) {
    const suggestedFrequency = Math.ceil(stats.weeklySuccessRate / 100 * 7);
    if (suggestedFrequency >= 3 && suggestedFrequency < 7) {
      return {
        type: 'reduce_frequency',
        message: `주간 성공률이 ${stats.weeklySuccessRate}%로 낮아요. 주 ${suggestedFrequency}회로 줄여보는 건 어때요?`,
        currentFrequency: `${habit.frequency_type} ${habit.frequency_value}회`,
        suggestedFrequency: `weekly ${suggestedFrequency}회`,
      };
    }
  }

  // 주간 성공률이 90% 이상이고 주 N회면 매일로 제안
  if (habit.frequency_type === 'weekly' && stats.weeklySuccessRate >= 90) {
    return {
      type: 'increase_frequency',
      message: `주간 성공률이 ${stats.weeklySuccessRate}%로 높아요! 매일로 늘려보는 건 어때요?`,
      currentFrequency: `${habit.frequency_type} ${habit.frequency_value}회`,
      suggestedFrequency: 'daily 1회',
    };
  }

  return null;
}

/**
 * 알림 시간 최적화 제안 생성
 * @param {Object} habit - 습관 데이터
 * @param {Array} checkins - 체크인 배열
 * @returns {Object|null} 제안 객체
 */
export function suggestReminderTimeOptimization(habit, checkins) {
  if (!habit.reminder_time || !checkins || checkins.length < 7) {
    return null;
  }

  // 완료된 체크인의 시간대 분석
  const completedCheckins = checkins
    .filter((c) => c.is_completed && c.created_at)
    .slice(-30);

  if (completedCheckins.length < 5) {
    return null;
  }

  const hours = completedCheckins.map((c) => {
    const date = new Date(c.created_at);
    return date.getHours();
  });

  // 가장 많이 체크인한 시간대 찾기
  const hourCounts = {};
  hours.forEach((hour) => {
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const mostCommonHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  
  if (!mostCommonHour) {
    return null;
  }

  const currentHour = parseInt(habit.reminder_time.split(':')[0]);
  const suggestedHour = parseInt(mostCommonHour);

  // 현재 알림 시간과 가장 많이 체크인한 시간이 2시간 이상 차이나면 제안
  if (Math.abs(currentHour - suggestedHour) >= 2) {
    const suggestedTime = `${suggestedHour.toString().padStart(2, '0')}:00`;
    return {
      type: 'optimize_reminder',
      message: `대부분 ${suggestedHour}시에 체크인하시네요. 알림 시간을 ${suggestedTime}으로 변경해보는 건 어때요?`,
      currentTime: habit.reminder_time,
      suggestedTime,
    };
  }

  return null;
}

/**
 * 모든 개선 제안 수집
 * @param {Object} habit - 습관 데이터
 * @param {Object} stats - 통계 데이터
 * @param {Array} checkins - 체크인 배열
 * @returns {Array} 제안 배열
 */
export function getAllSuggestions(habit, stats, checkins) {
  const suggestions = [];

  // 통계에 recentCheckins 추가
  const statsWithRecent = {
    ...stats,
    recentCheckins: checkins.slice(-30),
  };

  const targetSuggestion = suggestTargetAdjustment(habit, statsWithRecent);
  if (targetSuggestion) {
    suggestions.push(targetSuggestion);
  }

  const frequencySuggestion = suggestFrequencyAdjustment(habit, stats);
  if (frequencySuggestion) {
    suggestions.push(frequencySuggestion);
  }

  const reminderSuggestion = suggestReminderTimeOptimization(habit, checkins);
  if (reminderSuggestion) {
    suggestions.push(reminderSuggestion);
  }

  return suggestions;
}
