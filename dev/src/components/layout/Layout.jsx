import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { signOut } from '@services/supabase/auth';
import styles from './Layout.module.css';

function Layout({ children }) {
  const location = useLocation();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { path: '/', label: '대시보드', icon: '📊' },
    { path: '/habits', label: '습관', icon: '✅' },
    { path: '/chat', label: 'AI 채팅', icon: '💬' },
    { path: '/stats', label: '통계', icon: '📈' },
    { path: '/settings', label: '설정', icon: '⚙️' },
  ];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>uHavit</h1>
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className={styles.userSection}>
            <span className={styles.userEmail}>{user?.email}</span>
            <button onClick={handleSignOut} className={styles.signOutButton}>
              로그아웃
            </button>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

export default Layout;
