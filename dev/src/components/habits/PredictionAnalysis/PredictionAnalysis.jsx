import { predictGoalAchievement, detectRiskFactors, formatPredictionAnalysis } from '@utils/predictionAnalysis';
import styles from './PredictionAnalysis.module.css';

/**
 * 예측 분석 컴포넌트
 * @param {Object} props
 * @param {Object} props.habit - 습관 데이터
 * @param {Object} props.stats - 통계 데이터
 */
export function PredictionAnalysis({ habit, stats }) {
  if (!stats || stats.totalCount < 7) {
    return null;
  }

  const prediction = predictGoalAchievement(habit, stats, 30);
  const risks = detectRiskFactors(stats);
  const analysis = formatPredictionAnalysis(prediction, risks);

  if (!analysis) {
    return null;
  }

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'var(--color-success)';
    if (probability >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getAssessmentIcon = (assessment) => {
    switch (assessment) {
      case 'high':
        return '🎯';
      case 'medium':
        return '📊';
      case 'low':
        return '⚠️';
      default:
        return '📈';
    }
  };

  return (
    <div className={styles.analysis}>
      <div className={styles.header}>
        <div className={styles.icon}>{getAssessmentIcon(analysis.summary.assessment)}</div>
        <h3 className={styles.title}>목표 달성 예측</h3>
      </div>

      <div className={styles.prediction}>
        <div className={styles.probability}>
          <div
            className={styles.probabilityValue}
            style={{ color: getProbabilityColor(analysis.summary.probability) }}
          >
            {analysis.summary.probability}%
          </div>
          <div className={styles.probabilityLabel}>달성 확률</div>
        </div>
        <div className={styles.message}>{analysis.summary.message}</div>
      </div>

      {analysis.hasRisks && (
        <div className={styles.risks}>
          <div className={styles.risksTitle}>⚠️ 주의사항</div>
          {risks.map((risk, index) => (
            <div key={index} className={styles.risk}>
              {risk.message}
            </div>
          ))}
        </div>
      )}

      {prediction && (
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>남은 일수:</span>
            <span className={styles.detailValue}>{prediction.remainingDays}일</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>예상 성공 횟수:</span>
            <span className={styles.detailValue}>{prediction.expectedSuccess}회</span>
          </div>
        </div>
      )}
    </div>
  );
}
