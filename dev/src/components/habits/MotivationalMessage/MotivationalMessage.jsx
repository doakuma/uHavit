import { generateMotivationalMessage, generateEncouragementMessage } from '@utils/motivationalMessages';
import styles from './MotivationalMessage.module.css';

/**
 * 동기부여 메시지 컴포넌트
 * @param {Object} props
 * @param {Object} props.stats - 습관 통계 데이터
 * @param {Object} props.habit - 습관 데이터
 * @param {Object} props.todayCheckin - 오늘의 체크인 데이터
 */
export function MotivationalMessage({ stats, habit, todayCheckin }) {
  if (!stats) return null;

  // 오늘 미완료인 경우 격려 메시지
  const message = todayCheckin && !todayCheckin.is_completed
    ? generateEncouragementMessage(stats)
    : generateMotivationalMessage(stats, habit, todayCheckin);

  if (!message) return null;

  return (
    <div className={styles.message}>
      <div className={styles.icon}>💬</div>
      <div className={styles.text}>{message}</div>
    </div>
  );
}
