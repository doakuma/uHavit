/**
 * 예측 분석 유틸리티
 */

/**
 * 목표 달성 예측 계산
 * @param {Object} habit - 습관 데이터
 * @param {Object} stats - 통계 데이터
 * @param {number} targetDays - 목표 일수 (기본값: 30)
 * @returns {Object} 예측 결과
 */
export function predictGoalAchievement(habit, stats, targetDays = 30) {
  if (!stats || stats.totalCount < 7) {
    return null;
  }

  // 최근 7일간의 성공률을 기반으로 예측
  const recentSuccessRate = stats.weeklySuccessRate;
  
  // 목표까지 남은 일수 계산
  const startDate = new Date(habit.start_date);
  const today = new Date();
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, targetDays - daysSinceStart);

  if (remainingDays === 0) {
    return null;
  }

  // 예상 성공 횟수 계산
  const expectedSuccess = Math.round((recentSuccessRate / 100) * remainingDays);
  
  // 목표 달성 확률 계산 (현재 성공률과 최근 성공률의 평균 사용)
  const avgSuccessRate = (stats.successRate + recentSuccessRate) / 2;
  const achievementProbability = Math.min(100, Math.round(avgSuccessRate));

  // 목표 달성 가능성 평가
  let assessment = 'medium';
  let message = '';
  
  if (achievementProbability >= 80) {
    assessment = 'high';
    message = `현재 추세로 보면 목표 달성 확률이 높아요! 계속 화이팅!`;
  } else if (achievementProbability >= 60) {
    assessment = 'medium';
    message = `현재 추세를 유지하면 목표 달성이 가능해요!`;
  } else {
    assessment = 'low';
    message = `목표 달성을 위해 조금 더 노력이 필요해요. 작은 목표부터 시작해보세요!`;
  }

  return {
    targetDays,
    remainingDays,
    expectedSuccess,
    achievementProbability,
    assessment,
    message,
    currentSuccessRate: stats.successRate,
    recentSuccessRate,
  };
}

/**
 * 위험 요소 감지
 * @param {Object} stats - 통계 데이터
 * @returns {Array} 위험 요소 배열
 */
export function detectRiskFactors(stats) {
  const risks = [];

  // 연속 실패 감지
  if (stats.streak === 0 && stats.totalCount > 0) {
    risks.push({
      type: 'broken_streak',
      severity: 'high',
      message: '연속 일수가 끊겼어요. 다시 시작해봐요!',
    });
  }

  // 성공률 하락 감지
  if (stats.weeklySuccessRate < stats.monthlySuccessRate - 20) {
    risks.push({
      type: 'declining_success',
      severity: 'medium',
      message: '최근 성공률이 하락하고 있어요. 원인을 파악해보세요.',
    });
  }

  // 낮은 성공률 감지
  if (stats.successRate < 50 && stats.totalCount >= 14) {
    risks.push({
      type: 'low_success_rate',
      severity: 'high',
      message: '전체 성공률이 50% 미만이에요. 목표를 조정해보는 게 어떨까요?',
    });
  }

  // 주간 성공률 급락 감지
  if (stats.weeklySuccessRate < 30 && stats.totalCount >= 7) {
    risks.push({
      type: 'weekly_drop',
      severity: 'high',
      message: '이번 주 성공률이 매우 낮아요. 습관을 다시 점검해보세요.',
    });
  }

  return risks;
}

/**
 * 예측 분석 결과 포맷팅
 * @param {Object} prediction - 예측 결과
 * @param {Array} risks - 위험 요소 배열
 * @returns {Object} 포맷된 결과
 */
export function formatPredictionAnalysis(prediction, risks) {
  if (!prediction) {
    return null;
  }

  return {
    prediction,
    risks,
    hasRisks: risks.length > 0,
    summary: {
      probability: prediction.achievementProbability,
      assessment: prediction.assessment,
      message: prediction.message,
    },
  };
}
