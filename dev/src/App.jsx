import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Layout from '@components/layout/Layout';
import Login from '@pages/Auth/Login';
import SignUp from '@pages/Auth/SignUp';
import Dashboard from '@pages/Dashboard';
import Habits from '@pages/Habits';
import HabitDetail from '@pages/Habits/HabitDetail';
import Chat from '@pages/Chat';
import Stats from '@pages/Stats';
import Settings from '@pages/Settings';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" replace />} />
        <Route
          path="/*"
          element={
            user ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/habits" element={<Habits />} />
                  <Route path="/habits/:id" element={<HabitDetail />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/stats" element={<Stats />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
