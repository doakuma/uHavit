import { useHabits } from '@hooks/useHabits';
import { HabitCard } from '@components/habits/HabitCard';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { data: habits, isLoading } = useHabits();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>로딩 중...</div>
      </div>
    );
  }

  const todayHabits = habits || [];
  const completedCount = todayHabits.length; // 더미 데이터에서는 모두 완료로 표시

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>대시보드</h1>
        <p className={styles.subtitle}>오늘의 습관을 확인하고 체크인하세요</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{todayHabits.length}</div>
          <div className={styles.statLabel}>오늘의 습관</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{completedCount}</div>
          <div className={styles.statLabel}>완료한 습관</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {todayHabits.length > 0 ? Math.round((completedCount / todayHabits.length) * 100) : 0}%
          </div>
          <div className={styles.statLabel}>완료율</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>오늘의 습관</h2>
          <Link to="/habits" className={styles.link}>
            전체 보기 →
          </Link>
        </div>

        {todayHabits.length === 0 ? (
          <div className={styles.empty}>
            <p>오늘 완료할 습관이 없습니다.</p>
            <Link to="/habits" className={styles.createLink}>
              새 습관 만들기
            </Link>
          </div>
        ) : (
          <div className={styles.habitGrid}>
            {todayHabits.slice(0, 6).map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>빠른 액션</h2>
        </div>
        <div className={styles.quickActions}>
          <Link to="/habits" className={styles.actionButton}>
            새 습관 만들기
          </Link>
          <Link to="/chat" className={styles.actionButton}>
            AI와 대화하기
          </Link>
          <Link to="/stats" className={styles.actionButton}>
            통계 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
