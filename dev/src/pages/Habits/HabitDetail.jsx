import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useHabit, useDeleteHabit, useToggleHabitActive } from '@hooks/useHabits';
import { useCheckins, useTodayCheckin, useCreateCheckin } from '@hooks/useCheckins';
import { HabitForm } from '@components/habits/HabitForm';
import { CheckinForm } from '@components/habits/CheckinForm';
import { HabitCalendar } from '@components/habits/HabitCalendar';
import { CheckinHistory } from '@components/habits/CheckinHistory';
import { HabitTrend } from '@components/habits/HabitTrend';
import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import { CATEGORY_LABELS, FREQUENCY_LABELS } from '@constants';
import { calculateHabitStats } from '@utils/habitStats';
import styles from './HabitDetail.module.css';

function HabitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: habit, isLoading, error } = useHabit(id);
  const { data: checkins = [] } = useCheckins(id);
  const { data: todayCheckin } = useTodayCheckin(id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const deleteHabit = useDeleteHabit();
  const toggleActive = useToggleHabitActive();

  // 통계 계산
  const stats = habit ? calculateHabitStats(habit, checkins) : null;

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

  const handleDelete = async () => {
    await deleteHabit.mutateAsync(habit.id);
    navigate('/habits');
  };

  const handleToggleActive = async () => {
    await toggleActive.mutateAsync({ id: habit.id, isActive: !habit.is_active });
  };

  const handleCheckinSuccess = () => {
    setIsCheckinOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="secondary" onClick={() => navigate('/habits')}>
          ← 목록으로
        </Button>
        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={() => setIsCheckinOpen(true)}>
            {todayCheckin?.is_completed ? '체크인 수정' : '체크인하기'}
          </Button>
          <Button variant="secondary" onClick={() => setIsEditMode(true)}>
            수정
          </Button>
          <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(true)}>
            삭제
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {/* 메인 콘텐츠 영역 */}
        <div className={styles.mainContent}>
          {/* 습관 정보 섹션 */}
          <div className={styles.section}>
            <div className={styles.titleRow}>
              <h1 className={styles.name}>{habit.name}</h1>
              {habit.category && (
                <span className={styles.category}>{CATEGORY_LABELS[habit.category]}</span>
              )}
            </div>
            {habit.description && (
              <p className={styles.description}>{habit.description}</p>
            )}
          </div>

          {/* 체크인 섹션 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>오늘의 체크인</h2>
            <div className={styles.checkinCard}>
              {todayCheckin ? (
                <div className={styles.checkinStatus}>
                  <div className={styles.checkinStatusRow}>
                    <span className={styles.checkinLabel}>상태:</span>
                    <span className={`${styles.checkinValue} ${todayCheckin.is_completed ? styles.completed : styles.incomplete}`}>
                      {todayCheckin.is_completed ? '✅ 완료' : '❌ 미완료'}
                    </span>
                  </div>
                  {todayCheckin.value && habit.target_unit && (
                    <div className={styles.checkinStatusRow}>
                      <span className={styles.checkinLabel}>기록:</span>
                      <span className={styles.checkinValue}>
                        {todayCheckin.value} {habit.target_unit}
                      </span>
                    </div>
                  )}
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setIsCheckinOpen(true)}
                    className={styles.editCheckinButton}
                  >
                    수정하기
                  </Button>
                </div>
              ) : (
                <div className={styles.noCheckin}>
                  <p>아직 오늘 체크인하지 않았습니다.</p>
                  <Button onClick={() => setIsCheckinOpen(true)}>체크인하기</Button>
                </div>
              )}
            </div>
          </div>

          {/* 통계 섹션 */}
          {stats && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>통계</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats.successRate}%</div>
                  <div className={styles.statLabel}>전체 성공률</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats.streak}일</div>
                  <div className={styles.statLabel}>현재 연속 일수</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats.maxStreak}일</div>
                  <div className={styles.statLabel}>최고 연속 일수</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats.completedCount}</div>
                  <div className={styles.statLabel}>완료 횟수</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats.weeklySuccessRate}%</div>
                  <div className={styles.statLabel}>주간 성공률</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats.monthlySuccessRate}%</div>
                  <div className={styles.statLabel}>월간 성공률</div>
                </div>
              </div>
            </div>
          )}

          {/* 트렌드 그래프 섹션 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>주간 트렌드</h2>
            <HabitTrend habit={habit} days={30} />
          </div>

          {/* 체크인 기록 섹션 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>최근 기록</h2>
            <CheckinHistory habit={habit} limit={30} />
          </div>
        </div>

        {/* 사이드바 영역 */}
        <div className={styles.sidebar}>
          {/* 캘린더 히트맵 섹션 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>캘린더</h2>
            <HabitCalendar habit={habit} />
          </div>

          {/* 기본 정보 섹션 */}
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
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>상태</span>
                <span className={styles.infoValue}>
                  {habit.is_active ? '활성' : '비활성'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 체크인 모달 */}
      <Modal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        title="체크인하기"
      >
        <CheckinForm
          habit={habit}
          todayCheckin={todayCheckin}
          onSuccess={handleCheckinSuccess}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal isOpen={isEditMode} onClose={() => setIsEditMode(false)} title="습관 수정">
        <HabitForm
          habit={habit}
          onSuccess={() => {
            setIsEditMode(false);
          }}
          onCancel={() => setIsEditMode(false)}
        />
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="습관 삭제"
      >
        <div className={styles.deleteConfirm}>
          <p>정말 이 습관을 삭제하시겠습니까?</p>
          <p className={styles.deleteWarning}>삭제된 습관은 복구할 수 없습니다.</p>
          <div className={styles.deleteActions}>
            <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleteHabit.isPending}
            >
              {deleteHabit.isPending ? '삭제 중...' : '삭제하기'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default HabitDetail;
