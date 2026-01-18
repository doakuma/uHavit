import { useState, useEffect } from 'react';
import { getSession } from '@services/supabase/auth';

// 더미 모드 활성화 여부
const USE_DUMMY_AUTH =
  import.meta.env.DEV &&
  (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);

/**
 * 인증 관련 Hook
 * @returns {Object} { user, loading }
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 세션 확인
    getSession()
      .then(({ data, error }) => {
        if (error) {
          console.error('세션 확인 오류:', error);
        }
        setUser(data?.session?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('세션 확인 실패:', error);
        setLoading(false);
      });

    let subscription = null;
    let interval = null;

    // 더미 모드가 아닐 때만 Supabase 인증 상태 변경 감지
    if (!USE_DUMMY_AUTH) {
      import('@services/supabase/client').then(({ supabase }) => {
        const {
          data: { subscription: sub },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        });
        subscription = sub;
      });
    }

    // 더미 모드에서는 로컬 스토리지 변경 감지 (같은 탭에서도 동작하도록)
    if (USE_DUMMY_AUTH) {
      const checkSession = () => {
        getSession().then(({ data }) => {
          setUser(data?.session?.user ?? null);
        });
      };

      // storage 이벤트는 다른 탭에서만 발생하므로, 직접 체크
      interval = setInterval(checkSession, 1000);

      const handleStorageChange = () => {
        checkSession();
      };

      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      if (interval) {
        clearInterval(interval);
      }
      if (USE_DUMMY_AUTH) {
        window.removeEventListener('storage', () => {});
      }
    };
  }, []);

  return {
    user,
    loading,
  };
}
