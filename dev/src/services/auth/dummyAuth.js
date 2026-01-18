/**
 * 더미 인증 서비스 (개발용)
 * Supabase 없이도 로그인 기능을 테스트할 수 있도록 함
 */

const DUMMY_USERS = [
  {
    id: 'dummy-user-1',
    email: 'test@example.com',
    password: 'test123',
    nickname: '테스트 사용자',
  },
  {
    id: 'dummy-user-2',
    email: 'demo@example.com',
    password: 'demo123',
    nickname: '데모 사용자',
  },
];

const STORAGE_KEY = 'uhavit_dummy_auth';

/**
 * 더미 사용자로 로그인
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function dummySignIn(email, password) {
  // 약간의 지연을 추가하여 실제 API 호출처럼 보이게 함
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = DUMMY_USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    return {
      data: null,
      error: { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
    };
  }

  const session = {
    user: {
      id: user.id,
      email: user.email,
      user_metadata: {
        nickname: user.nickname,
      },
    },
    access_token: `dummy-token-${user.id}`,
  };

  // 로컬 스토리지에 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

  return {
    data: { session, user: session.user },
    error: null,
  };
}

/**
 * 더미 사용자로 회원가입
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function dummySignUp(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 이미 존재하는 이메일인지 확인
  const existingUser = DUMMY_USERS.find((u) => u.email === email);
  if (existingUser) {
    return {
      data: null,
      error: { message: '이미 존재하는 이메일입니다.' },
    };
  }

  // 새 사용자 생성
  const newUser = {
    id: `dummy-user-${Date.now()}`,
    email,
    password,
    nickname: email.split('@')[0],
  };

  DUMMY_USERS.push(newUser);

  const session = {
    user: {
      id: newUser.id,
      email: newUser.email,
      user_metadata: {
        nickname: newUser.nickname,
      },
    },
    access_token: `dummy-token-${newUser.id}`,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

  return {
    data: { session, user: session.user },
    error: null,
  };
}

/**
 * 더미 로그아웃
 * @returns {Promise<{ error: any }>}
 */
export async function dummySignOut() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  localStorage.removeItem(STORAGE_KEY);
  return { error: null };
}

/**
 * 저장된 더미 세션 가져오기
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function dummyGetSession() {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      data: { session: null },
      error: null,
    };
  }

  try {
    const session = JSON.parse(stored);
    return {
      data: { session },
      error: null,
    };
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return {
      data: { session: null },
      error: null,
    };
  }
}

/**
 * 더미 사용자 정보 가져오기
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function dummyGetUser() {
  const { data } = await dummyGetSession();
  return {
    data: { user: data.session?.user || null },
    error: null,
  };
}
