import { useHabits } from '@hooks/useHabits';
import { HabitCard } from '../HabitCard';
import styles from './HabitList.module.css';

/**
 * 습관 목록 컴포넌트
 */
export function HabitList() {
  const { data: habits, isLoading, error } = useHabits();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <div>습관을 불러오는 중 오류가 발생했습니다.</div>
        <div className={styles.errorMessage}>{error.message}</div>
      </div>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📝</div>
        <div className={styles.emptyText}>아직 등록된 습관이 없습니다.</div>
        <div className={styles.emptySubtext}>새로운 습관을 만들어보세요!</div>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
}
