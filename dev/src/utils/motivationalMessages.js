/**
 * 동기부여 메시지 생성 유틸리티
 */

/**
 * 통계 기반 동기부여 메시지 생성
 * @param {Object} stats - 습관 통계 데이터
 * @param {Object} habit - 습관 데이터
 * @param {Object} todayCheckin - 오늘의 체크인 데이터
 * @returns {string} 동기부여 메시지
 */
export function generateMotivationalMessage(stats, habit, todayCheckin) {
  if (!stats) return null;

  const messages = [];

  // 연속 일수 기반 메시지
  if (stats.streak > 0) {
    if (stats.streak >= 30) {
      messages.push(`🎉 대단해요! ${stats.streak}일 연속 달성! 정말 멋져요!`);
    } else if (stats.streak >= 14) {
      messages.push(`🔥 ${stats.streak}일 연속! 습관이 자리잡고 있어요!`);
    } else if (stats.streak >= 7) {
      messages.push(`✨ ${stats.streak}일 연속 달성! 계속 화이팅!`);
    } else {
      messages.push(`👍 ${stats.streak}일 연속! 좋은 시작이에요!`);
    }
  }

  // 성공률 기반 메시지
  if (stats.successRate >= 90) {
    messages.push(`🌟 성공률 ${stats.successRate}%! 거의 완벽해요!`);
  } else if (stats.successRate >= 70) {
    messages.push(`💪 성공률 ${stats.successRate}%! 잘하고 있어요!`);
  } else if (stats.successRate >= 50) {
    messages.push(`📈 성공률 ${stats.successRate}%! 조금만 더 노력하면 더 좋아질 거예요!`);
  } else if (stats.totalCount > 0) {
    messages.push(`💪 아직 시작 단계예요. 작은 성취도 소중해요!`);
  }

  // 오늘 체크인 상태 기반 메시지
  if (todayCheckin) {
    if (todayCheckin.is_completed) {
      messages.push(`✅ 오늘도 완료! 멋져요!`);
    } else {
      messages.push(`💪 내일은 꼭 완료해봐요!`);
    }
  } else {
    messages.push(`⏰ 오늘의 체크인을 잊지 마세요!`);
  }

  // 주간 성공률 기반 메시지
  if (stats.weeklySuccessRate >= 80) {
    messages.push(`📊 이번 주 성공률 ${stats.weeklySuccessRate}%! 훌륭해요!`);
  }

  // 최고 연속 일수 기반 메시지
  if (stats.maxStreak > stats.streak && stats.maxStreak >= 7) {
    messages.push(`🏆 최고 기록은 ${stats.maxStreak}일이에요! 다시 도전해봐요!`);
  }

  return messages.length > 0 ? messages[0] : '오늘도 화이팅! 💪';
}

/**
 * 실패 시 격려 메시지 생성
 * @param {Object} stats - 습관 통계 데이터
 * @returns {string} 격려 메시지
 */
export function generateEncouragementMessage(stats) {
  if (!stats) return null;

  const messages = [
    '실패는 성공의 어머니예요. 내일 다시 도전해봐요! 💪',
    '한 번의 실패는 아무것도 아니에요. 계속 노력하면 돼요! 🌟',
    '모든 습관은 작은 실패를 통해 완성돼요. 포기하지 마세요! ✨',
  ];

  if (stats.streak > 0) {
    return `연속 ${stats.streak}일 달성했어요! 오늘은 쉬어가도 괜찮아요. 내일 다시 시작해봐요! 💪`;
  }

  return messages[Math.floor(Math.random() * messages.length)];
}
