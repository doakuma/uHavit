import { useState } from 'react';
import { useCheckins } from '@hooks/useCheckins';
import { CheckinForm } from '@components/habits/CheckinForm';
import { Modal } from '@components/common/Modal';
import styles from './HabitCalendar.module.css';

/**
 * 습관 캘린더 컴포넌트 (히트맵)
 * @param {Object} props
 * @param {Object} props.habit - 습관 데이터
 */
export function HabitCalendar({ habit }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  
  // 현재 월의 시작일과 종료일 계산
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // 캘린더에 표시할 날짜 범위 (현재 월 + 이전/다음 월 일부)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay()); // 일요일부터 시작
  
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay())); // 토요일까지

  // 체크인 데이터 조회
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];
  const { data: checkins = [] } = useCheckins(habit.id, startDateStr, endDateStr);

  // 날짜별 체크인 맵 생성
  const checkinMap = new Map();
  checkins.forEach((checkin) => {
    checkinMap.set(checkin.checkin_date, checkin);
  });

  // 캘린더 날짜 배열 생성
  const calendarDays = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const checkin = checkinMap.get(dateStr);
    const isToday = dateStr === today.toISOString().split('T')[0];
    const isCurrentMonth = currentDate.getMonth() === currentMonth;
    
    calendarDays.push({
      date: new Date(currentDate),
      dateStr,
      checkin,
      isToday,
      isCurrentMonth,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setIsCheckinModalOpen(true);
  };

  const handleCheckinSuccess = () => {
    setIsCheckinModalOpen(false);
    setSelectedDate(null);
  };

  const getDateClassName = (day) => {
    const classes = [styles.date];
    
    if (!day.isCurrentMonth) {
      classes.push(styles.otherMonth);
    }
    
    if (day.isToday) {
      classes.push(styles.today);
    }
    
    if (day.checkin) {
      if (day.checkin.is_completed) {
        classes.push(styles.completed);
      } else {
        classes.push(styles.incomplete);
      }
    } else {
      classes.push(styles.noCheckin);
    }
    
    return classes.join(' ');
  };

  const selectedCheckin = selectedDate ? checkinMap.get(selectedDate) : null;

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <h3 className={styles.monthTitle}>
          {currentYear}년 {currentMonth + 1}월
        </h3>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.completed}`}></div>
            <span>완료</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.incomplete}`}></div>
            <span>미완료</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.noCheckin}`}></div>
            <span>기록 없음</span>
          </div>
        </div>
      </div>

      <div className={styles.weekdays}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.dates}>
        {calendarDays.map((day) => (
          <button
            key={day.dateStr}
            className={getDateClassName(day)}
            onClick={() => handleDateClick(day.dateStr)}
            title={day.dateStr}
          >
            <span className={styles.dateNumber}>{day.date.getDate()}</span>
            {day.checkin && (
              <span className={styles.checkinIndicator}>
                {day.checkin.is_completed ? '✓' : '✗'}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 체크인 모달 */}
      <Modal
        isOpen={isCheckinModalOpen}
        onClose={() => {
          setIsCheckinModalOpen(false);
          setSelectedDate(null);
        }}
        title={`${selectedDate} 체크인`}
      >
        <CheckinForm
          habit={habit}
          todayCheckin={selectedCheckin}
          checkinDate={selectedDate}
          onSuccess={handleCheckinSuccess}
        />
      </Modal>
    </div>
  );
}
