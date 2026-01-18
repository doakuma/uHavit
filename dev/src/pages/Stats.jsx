import { useHabits } from '@hooks/useHabits';
import { getDummyCheckins, getCurrentUserId } from '@services/data/dummyData';
import styles from './Stats.module.css';

function Stats() {
  const { data: habits, isLoading } = useHabits();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>로딩 중...</div>
      </div>
    );
  }

  // 더미 모드일 때 체크인 데이터 가져오기
  const USE_DUMMY_MODE =
    import.meta.env.DEV &&
    (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);

  let checkins = [];
  if (USE_DUMMY_MODE) {
    checkins = getDummyCheckins();
  }

  // 습관별 통계 계산
  const habitStats = (habits || []).map((habit) => {
    const habitCheckins = checkins.filter((c) => c.habit_id === habit.id);
    const completedCount = habitCheckins.filter((c) => c.is_completed).length;
    const totalCount = habitCheckins.length;
    const successRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // 연속 일수 계산
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const checkin = habitCheckins.find((c) => c.checkin_date === dateStr);
      if (checkin && checkin.is_completed) {
        streak++;
      } else {
        break;
      }
    }

    return {
      ...habit,
      completedCount,
      totalCount,
      successRate,
      streak,
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>통계</h1>
        <p className={styles.subtitle}>습관 수행 현황을 확인하세요</p>
      </div>

      {habitStats.length === 0 ? (
        <div className={styles.empty}>
          <p>아직 등록된 습관이 없습니다.</p>
        </div>
      ) : (
        <div className={styles.statsGrid}>
          {habitStats.map((stat) => (
            <div key={stat.id} className={styles.statCard}>
              <h3 className={styles.habitName}>{stat.name}</h3>
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <div className={styles.metricValue}>{stat.successRate}%</div>
                  <div className={styles.metricLabel}>성공률</div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricValue}>{stat.streak}일</div>
                  <div className={styles.metricLabel}>연속 일수</div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricValue}>{stat.completedCount}</div>
                  <div className={styles.metricLabel}>완료 횟수</div>
                </div>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${stat.successRate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Stats;
