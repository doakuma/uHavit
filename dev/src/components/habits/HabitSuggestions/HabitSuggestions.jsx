import { useState } from 'react';
import { getAllSuggestions } from '@utils/habitSuggestions';
import { Button } from '@components/common/Button';
import styles from './HabitSuggestions.module.css';

/**
 * 습관 개선 제안 컴포넌트
 * @param {Object} props
 * @param {Object} props.habit - 습관 데이터
 * @param {Object} props.stats - 통계 데이터
 * @param {Array} props.checkins - 체크인 배열
 * @param {Function} props.onApplySuggestion - 제안 적용 콜백
 */
export function HabitSuggestions({ habit, stats, checkins, onApplySuggestion }) {
  const suggestions = getAllSuggestions(habit, stats, checkins);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className={styles.suggestions}>
      <div className={styles.header}>
        <div className={styles.icon}>💡</div>
        <h3 className={styles.title}>개선 제안</h3>
      </div>
      <div className={styles.list}>
        {suggestions.map((suggestion, index) => (
          <div key={index} className={styles.suggestion}>
            <p className={styles.message}>{suggestion.message}</p>
            {onApplySuggestion && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onApplySuggestion(suggestion)}
                className={styles.applyButton}
              >
                적용하기
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
