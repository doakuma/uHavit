import { useState } from 'react';
import { useCreateCheckin } from '@hooks/useCheckins';
import { Button } from '@components/common/Button';
import styles from './CheckinForm.module.css';

/**
 * 체크인 폼 컴포넌트
 * @param {Object} props
 * @param {Object} props.habit - 습관 데이터
 * @param {Object} props.todayCheckin - 체크인 데이터 (선택)
 * @param {string} props.checkinDate - 체크인 날짜 (YYYY-MM-DD, 기본값: 오늘)
 * @param {Function} props.onSuccess - 체크인 성공 시 콜백
 */
export function CheckinForm({ habit, todayCheckin, checkinDate, onSuccess }) {
  const createCheckin = useCreateCheckin();
  const [isCompleted, setIsCompleted] = useState(todayCheckin?.is_completed ?? false);
  const [value, setValue] = useState(todayCheckin?.value?.toString() ?? '');
  const [error, setError] = useState('');

  const hasTarget = habit.target_value && habit.target_unit;
  const date = checkinDate || new Date().toISOString().split('T')[0];
  const isPastDate = date < new Date().toISOString().split('T')[0];
  const isFutureDate = date > new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 수치 입력이 필요한 경우 검증
    if (hasTarget && isCompleted && !value) {
      setError(`${habit.target_unit}을(를) 입력해주세요.`);
      return;
    }

    if (hasTarget && isCompleted && parseFloat(value) <= 0) {
      setError('올바른 값을 입력해주세요.');
      return;
    }

    // 미래 날짜는 체크인 불가
    if (isFutureDate) {
      setError('미래 날짜는 체크인할 수 없습니다.');
      return;
    }

    try {
      await createCheckin.mutateAsync({
        habit_id: habit.id,
        checkin_date: date,
        is_completed: isCompleted,
        value: hasTarget && isCompleted ? parseFloat(value) : null,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || '체크인 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {isPastDate && (
        <div className={styles.dateInfo}>
          <span className={styles.dateLabel}>날짜:</span>
          <span className={styles.dateValue}>{date}</span>
        </div>
      )}
      <div className={styles.statusGroup}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="status"
            checked={isCompleted}
            onChange={() => setIsCompleted(true)}
            className={styles.radio}
          />
          <span className={styles.radioText}>완료</span>
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="status"
            checked={!isCompleted}
            onChange={() => setIsCompleted(false)}
            className={styles.radio}
          />
          <span className={styles.radioText}>미완료</span>
        </label>
      </div>

      {hasTarget && isCompleted && (
        <div className={styles.valueInput}>
          <label htmlFor="value" className={styles.label}>
            {habit.target_unit} 입력
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="value"
              type="number"
              step="0.1"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`목표: ${habit.target_value} ${habit.target_unit}`}
              className={styles.input}
            />
            <span className={styles.unit}>{habit.target_unit}</span>
          </div>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <Button
          type="submit"
          disabled={createCheckin.isPending}
          size="md"
        >
          {createCheckin.isPending ? '저장 중...' : todayCheckin ? '수정하기' : '체크인하기'}
        </Button>
      </div>
    </form>
  );
}
