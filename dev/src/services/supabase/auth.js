import { supabase } from './client';
import * as dummyAuth from '../auth/dummyAuth';

// 더미 모드 활성화 여부 (환경 변수가 없으면 더미 모드)
const USE_DUMMY_AUTH =
  import.meta.env.DEV &&
  (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);

/**
 * 이메일과 비밀번호로 회원가입
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function signUp(email, password) {
  if (USE_DUMMY_AUTH) {
    return dummyAuth.dummySignUp(email, password);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

/**
 * 이메일과 비밀번호로 로그인
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function signIn(email, password) {
  if (USE_DUMMY_AUTH) {
    return dummyAuth.dummySignIn(email, password);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * 로그아웃
 * @returns {Promise<{ error: any }>}
 */
export async function signOut() {
  if (USE_DUMMY_AUTH) {
    return dummyAuth.dummySignOut();
  }

  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * 비밀번호 재설정 이메일 전송
 * @param {string} email - 이메일
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function resetPassword(email) {
  if (USE_DUMMY_AUTH) {
    return {
      data: null,
      error: { message: '더미 모드에서는 비밀번호 재설정을 지원하지 않습니다.' },
    };
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
}

/**
 * 현재 사용자 세션 가져오기
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function getSession() {
  if (USE_DUMMY_AUTH) {
    return dummyAuth.dummyGetSession();
  }

  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}

/**
 * 현재 사용자 정보 가져오기
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function getUser() {
  if (USE_DUMMY_AUTH) {
    return dummyAuth.dummyGetUser();
  }

  const { data, error } = await supabase.auth.getUser();
  return { data, error };
}
