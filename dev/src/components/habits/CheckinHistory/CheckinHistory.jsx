import { useCheckins } from '@hooks/useCheckins';
import { CheckinForm } from '@components/habits/CheckinForm';
import { Modal } from '@components/common/Modal';
import { useState } from 'react';
import styles from './CheckinHistory.module.css';

/**
 * 체크인 기록 컴포넌트
 * @param {Object} props
 * @param {Object} props.habit - 습관 데이터
 * @param {number} props.limit - 표시할 최대 개수 (기본값: 30)
 */
export function CheckinHistory({ habit, limit = 30 }) {
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 최근 N일의 체크인 조회
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - limit);
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

  // 최근 N일의 날짜 배열 생성 (최신순)
  const recentDates = [];
  for (let i = 0; i < limit; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    recentDates.push({
      date,
      dateStr,
      checkin: checkinMap.get(dateStr),
    });
  }

  const handleDateClick = (dateStr, checkin) => {
    setSelectedCheckin({ dateStr, checkin });
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedCheckin(null);
  };

  const formatDate = (date) => {
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;

    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.history}>
      <div className={styles.list}>
        {recentDates.map(({ date, dateStr, checkin }) => (
          <button
            key={dateStr}
            className={`${styles.item} ${checkin ? (checkin.is_completed ? styles.completed : styles.incomplete) : styles.noCheckin}`}
            onClick={() => handleDateClick(dateStr, checkin)}
          >
            <div className={styles.itemLeft}>
              <span className={styles.date}>{formatDate(date)}</span>
              <span className={styles.dateFull}>{dateStr}</span>
            </div>
            <div className={styles.itemRight}>
              {checkin ? (
                <>
                  <span className={styles.status}>
                    {checkin.is_completed ? '✅ 완료' : '❌ 미완료'}
                  </span>
                  {checkin.value && habit.target_unit && (
                    <span className={styles.value}>
                      {checkin.value} {habit.target_unit}
                    </span>
                  )}
                </>
              ) : (
                <span className={styles.noRecord}>기록 없음</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* 체크인 수정 모달 */}
      {selectedCheckin && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCheckin(null);
          }}
          title={`${selectedCheckin.dateStr} 체크인`}
        >
          <CheckinForm
            habit={habit}
            todayCheckin={selectedCheckin.checkin}
            checkinDate={selectedCheckin.dateStr}
            onSuccess={handleSuccess}
          />
        </Modal>
      )}
    </div>
  );
}
