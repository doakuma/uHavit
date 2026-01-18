import { useCheckins } from '@hooks/useCheckins';
import styles from './HabitTrend.module.css';

/**
 * 습관 트렌드 그래프 컴포넌트
 * @param {Object} props
 * @param {Object} props.habit - 습관 데이터
 * @param {number} props.days - 표시할 일수 (기본값: 30)
 */
export function HabitTrend({ habit, days = 30 }) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = today.toISOString().split('T')[0];

  const { data: checkins = [], isLoading } = useCheckins(
    habit.id,
    startDateStr,
    endDateStr
  );

  // 날짜별 체크인 맵 생성
  const checkinMap = new Map();
  checkins.forEach((checkin) => {
    checkinMap.set(checkin.checkin_date, checkin);
  });

  // 주간 데이터 생성 (최근 N주)
  const weeks = Math.ceil(days / 7);
  const weekData = [];
  
  for (let i = 0; i < weeks; i++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (i * 7 + 6));
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() - (i * 7));
    
    let completed = 0;
    let total = 0;
    
    for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const checkin = checkinMap.get(dateStr);
      if (checkin) {
        total++;
        if (checkin.is_completed) {
          completed++;
        }
      }
    }
    
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    weekData.push({
      week: i + 1,
      label: i === 0 ? '이번 주' : `${i}주 전`,
      successRate,
      completed,
      total,
    });
  }

  // 최대값 계산 (그래프 높이 조정용)
  const maxValue = Math.max(...weekData.map((w) => w.successRate), 100);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.trend}>
      <div className={styles.bars}>
        {weekData.map((week) => (
          <div key={week.week} className={styles.barContainer}>
            <div className={styles.barWrapper}>
              <div
                className={styles.bar}
                style={{
                  height: `${(week.successRate / maxValue) * 100}%`,
                  backgroundColor:
                    week.successRate >= 80
                      ? 'var(--color-success)'
                      : week.successRate >= 50
                      ? 'var(--color-warning)'
                      : 'var(--color-error)',
                }}
                title={`${week.label}: ${week.successRate}% (${week.completed}/${week.total})`}
              >
                <span className={styles.barValue}>{week.successRate}%</span>
              </div>
            </div>
            <div className={styles.barLabel}>{week.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: 'var(--color-success)' }}
          ></div>
          <span>80% 이상</span>
        </div>
        <div className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: 'var(--color-warning)' }}
          ></div>
          <span>50-79%</span>
        </div>
        <div className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: 'var(--color-error)' }}
          ></div>
          <span>50% 미만</span>
        </div>
      </div>
    </div>
  );
}
