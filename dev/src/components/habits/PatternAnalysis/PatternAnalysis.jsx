import { analyzeDayOfWeekPattern, analyzeTimePattern, formatPatternAnalysis } from '@utils/patternAnalysis';
import styles from './PatternAnalysis.module.css';

/**
 * 패턴 분석 컴포넌트
 * @param {Object} props
 * @param {Array} props.checkins - 체크인 배열
 */
export function PatternAnalysis({ checkins }) {
  if (!checkins || checkins.length === 0) {
    return null;
  }

  const dayPattern = analyzeDayOfWeekPattern(checkins);
  const timePattern = analyzeTimePattern(checkins);
  const analysisText = formatPatternAnalysis(dayPattern, timePattern);

  if (!analysisText) {
    return null;
  }

  return (
    <div className={styles.analysis}>
      <div className={styles.icon}>📊</div>
      <div className={styles.content}>
        <div className={styles.title}>패턴 분석</div>
        <div className={styles.text}>{analysisText}</div>
      </div>
    </div>
  );
}
