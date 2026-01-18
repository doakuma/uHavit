import { Link } from 'react-router-dom';
import { CATEGORY_LABELS, FREQUENCY_LABELS } from '@constants';
import { useDeleteHabit } from '@hooks/useHabits';
import styles from './HabitCard.module.css';

/**
 * 습관 카드 컴포넌트
 * @param {Object} props
 * @param {Object} props.habit - 습관 데이터
 */
export function HabitCard({ habit }) {
  const deleteHabit = useDeleteHabit();

  const handleDelete = async () => {
    if (window.confirm('정말 이 습관을 삭제하시겠습니까?')) {
      await deleteHabit.mutateAsync(habit.id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{habit.name}</h3>
        {habit.category && (
          <span className={styles.category}>{CATEGORY_LABELS[habit.category]}</span>
        )}
      </div>

      {habit.description && <p className={styles.description}>{habit.description}</p>}

      <div className={styles.meta}>
        <span className={styles.frequency}>
          {FREQUENCY_LABELS[habit.frequency_type]} {habit.frequency_value}회
        </span>
        {habit.target_value && (
          <span className={styles.target}>
            목표: {habit.target_value} {habit.target_unit || ''}
          </span>
        )}
      </div>

      <div className={styles.actions}>
        <Link to={`/habits/${habit.id}`} className={styles.viewButton}>
          상세보기
        </Link>
        <button onClick={handleDelete} className={styles.deleteButton} disabled={deleteHabit.isPending}>
          {deleteHabit.isPending ? '삭제 중...' : '삭제'}
        </button>
      </div>
    </div>
  );
}
