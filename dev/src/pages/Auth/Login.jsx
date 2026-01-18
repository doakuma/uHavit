import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '@services/supabase/auth';
import styles from './Auth.module.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>uHavit</h1>
        <p className={styles.subtitle}>습관 생성 AI Agent에 오신 것을 환영합니다</p>

        {!import.meta.env.VITE_SUPABASE_URL && (
          <div className={styles.dummyInfo}>
            <strong>🧪 더미 모드</strong>
            <p>테스트 계정:</p>
            <ul>
              <li>이메일: <code>test@example.com</code> / 비밀번호: <code>test123</code></li>
              <li>이메일: <code>demo@example.com</code> / 비밀번호: <code>demo123</code></li>
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className={styles.footer}>
          <Link to="/signup">계정이 없으신가요? 회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
