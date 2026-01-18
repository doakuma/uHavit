import { useAuth } from '@hooks/useAuth';
import styles from './Settings.module.css';

function Settings() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>설정</h1>
        <p className={styles.subtitle}>계정 및 앱 설정을 관리하세요</p>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>계정 정보</h2>
          <div className={styles.infoItem}>
            <span className={styles.label}>이메일</span>
            <span className={styles.value}>{user?.email || '-'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>닉네임</span>
            <span className={styles.value}>{user?.user_metadata?.nickname || '-'}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>알림 설정</h2>
          <div className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>습관 리마인더</div>
              <div className={styles.settingDescription}>설정한 시간에 습관 수행 알림을 받습니다</div>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" defaultChecked />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
          <div className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>일일 요약 알림</div>
              <div className={styles.settingDescription}>하루 종료 시 오늘의 성과 요약을 받습니다</div>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>앱 정보</h2>
          <div className={styles.infoItem}>
            <span className={styles.label}>버전</span>
            <span className={styles.value}>0.1.0 (MVP)</span>
          </div>
          {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
            <div className={styles.dummyNotice}>
              🧪 더미 모드로 실행 중입니다. 실제 데이터베이스 연결을 위해 환경 변수를 설정하세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
