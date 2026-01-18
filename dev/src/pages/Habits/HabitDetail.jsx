import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useHabit, useUpdateHabit } from '@hooks/useHabits';
import { HabitForm } from '@components/habits/HabitForm';
import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import { CATEGORY_LABELS, FREQUENCY_LABELS } from '@constants';
import styles from './HabitDetail.module.css';

function HabitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: habit, isLoading, error } = useHabit(id);
  const [isEditMode, setIsEditMode] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>로딩 중...</div>
      </div>
    );
  }

  if (error || !habit) {
    return (
      <div className={styles.error}>
        <div>습관을 불러오는 중 오류가 발생했습니다.</div>
        <Button onClick={() => navigate('/habits')}>목록으로 돌아가기</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="secondary" onClick={() => navigate('/habits')}>
          ← 목록으로
        </Button>
        <Button onClick={() => setIsEditMode(true)}>수정</Button>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h1 className={styles.name}>{habit.name}</h1>
          {habit.category && (
            <span className={styles.category}>{CATEGORY_LABELS[habit.category]}</span>
          )}
        </div>

        {habit.description && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>설명</h2>
            <p className={styles.description}>{habit.description}</p>
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>기본 정보</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>빈도</span>
              <span className={styles.infoValue}>
                {FREQUENCY_LABELS[habit.frequency_type]} {habit.frequency_value}회
              </span>
            </div>
            {habit.target_value && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>목표</span>
                <span className={styles.infoValue}>
                  {habit.target_value} {habit.target_unit || ''}
                </span>
              </div>
            )}
            {habit.reminder_time && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>알림 시간</span>
                <span className={styles.infoValue}>{habit.reminder_time}</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>시작일</span>
              <span className={styles.infoValue}>{habit.start_date}</span>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditMode} onClose={() => setIsEditMode(false)} title="습관 수정">
        <HabitForm
          habit={habit}
          onSuccess={() => {
            setIsEditMode(false);
          }}
          onCancel={() => setIsEditMode(false)}
        />
      </Modal>
    </div>
  );
}

export default HabitDetail;
