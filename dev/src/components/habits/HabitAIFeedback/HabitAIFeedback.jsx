import { useState } from 'react';
import { getHabitFeedback } from '@services/supabase/ai';
import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import styles from './HabitAIFeedback.module.css';

/**
 * 습관 AI 피드백 컴포넌트
 * @param {Object} props
 * @param {Object} props.habit - 습관 데이터
 * @param {Object} props.stats - 습관 통계 데이터
 * @param {Array} props.checkins - 체크인 배열
 */
export function HabitAIFeedback({ habit, stats, checkins }) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetFeedback = async () => {
    if (!habit || !stats) return;

    setIsLoading(true);
    setError('');
    setFeedback('');

    try {
      const response = await getHabitFeedback(habit.id, stats, checkins);
      setFeedback(response);
      setIsOpen(true);
    } catch (err) {
      setError(err.message || '피드백을 가져오는 중 오류가 발생했습니다.');
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleGetFeedback}
        disabled={isLoading || !habit || !stats}
        className={styles.feedbackButton}
      >
        {isLoading ? '분석 중...' : '🤖 AI가 분석해줘'}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="AI 피드백">
        <div className={styles.feedbackContent}>
          {isLoading ? (
            <div className={styles.loading}>
              <div>AI가 분석 중입니다...</div>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          ) : feedback ? (
            <div className={styles.feedback}>
              <div className={styles.feedbackText}>{feedback}</div>
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
