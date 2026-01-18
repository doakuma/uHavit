import { supabase } from './client';
import { getHabits } from './habits';
import { getCheckins } from './checkins';

// 더미 모드 활성화 여부
const USE_DUMMY_MODE =
  import.meta.env.DEV &&
  (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);

// Edge Function 사용 여부 (환경 변수로 제어)
const USE_EDGE_FUNCTION = import.meta.env.VITE_USE_AI_EDGE_FUNCTION === 'true';

// AI API 제공자 선택 (openai, gemini) - 기본값: openai
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'openai';


/**
 * AI와 채팅하는 함수
 * @param {string} message - 사용자 메시지
 * @param {Array} conversationHistory - 대화 기록 (선택사항)
 * @param {string} sessionId - 세션 ID (선택사항)
 * @returns {Promise<{ response: string, userMessageId: string, assistantMessageId: string }>}
 */
export async function chatWithAI(message, conversationHistory = [], sessionId = null) {
  if (USE_DUMMY_MODE) {
    // 더미 모드: 간단한 응답 반환
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const dummyResponses = [
      '좋은 질문이네요! 습관을 만들 때는 작은 목표부터 시작하는 것이 중요합니다.',
      '습관 형성은 꾸준함이 가장 중요해요. 매일 조금씩이라도 실천해보세요!',
      '오늘도 화이팅! 작은 성취가 모이면 큰 변화가 됩니다.',
    ];
    const response = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
    
    // 더미 대화 기록 (실제 저장하지 않음)
    const userMsgId = `msg-${Date.now()}`;
    const assistantMsgId = `msg-${Date.now() + 1}`;
    
    return {
      response,
      userMessageId: userMsgId,
      assistantMessageId: assistantMsgId,
    };
  }

  // 현재 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  // 세션이 없으면 새 세션 생성
  let currentSessionId = sessionId;
  if (!currentSessionId) {
    try {
      const newSession = await createSession();
      if (!newSession || !newSession.id) {
        throw new Error('세션 생성에 실패했습니다. 세션 ID를 받지 못했습니다.');
      }
      currentSessionId = newSession.id;
    } catch (error) {
      console.error('세션 생성 오류:', error);
      throw new Error(`세션 생성에 실패했습니다: ${error.message}`);
    }
  }

  // Edge Function 사용 시 (에러 발생하면 클라이언트 직접 호출로 fallback)
  if (USE_EDGE_FUNCTION) {
    try {
      return await chatWithAIEdgeFunction(message, user.id, conversationHistory, currentSessionId);
    } catch (error) {
      console.warn('Edge Function 호출 실패, 클라이언트 직접 호출로 전환:', error);
      // Edge Function이 배포되지 않았거나 에러 발생 시 클라이언트 직접 호출로 fallback
      return await chatWithAIDirect(message, user.id, conversationHistory, currentSessionId);
    }
  }

  // 클라이언트에서 직접 AI API 호출
  if (AI_PROVIDER === 'gemini') {
    return await chatWithGemini(message, user.id, conversationHistory, currentSessionId);
  }
  return await chatWithAIDirect(message, user.id, conversationHistory, currentSessionId);
}

/**
 * Edge Function을 통한 AI 채팅
 * @param {string} message - 사용자 메시지
 * @param {string} userId - 사용자 ID
 * @param {Array} conversationHistory - 대화 기록
 * @param {string} sessionId - 세션 ID
 * @returns {Promise<{ response: string, userMessageId: string, assistantMessageId: string }>}
 */
async function chatWithAIEdgeFunction(message, userId, conversationHistory = [], sessionId = null) {
  const { data, error } = await supabase.functions.invoke('ai-chat', {
    body: { message, userId, conversationHistory },
  });

  if (error) throw error;
  return data;
}

/**
 * Google Gemini API를 통한 AI 채팅 (무료 티어 제공)
 * @param {string} message - 사용자 메시지
 * @param {string} userId - 사용자 ID
 * @param {Array} conversationHistory - 대화 기록
 * @param {string} sessionId - 세션 ID
 * @returns {Promise<{ response: string, userMessageId: string, assistantMessageId: string }>}
 */
async function chatWithGemini(message, userId, conversationHistory = [], sessionId = null) {
  // Gemini API 키 확인
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Gemini API 키가 설정되지 않았습니다.\n' +
      '.env.local 파일에 VITE_GEMINI_API_KEY를 추가하세요.\n' +
      '무료로 사용 가능합니다: https://aistudio.google.com/app/apikey'
    );
  }

  // 사용자 컨텍스트 조회
  const habits = await getHabits();
  const recentCheckins = await getRecentCheckins(habits);

  // System 프롬프트 생성
  const systemPrompt = createSystemPrompt(habits, recentCheckins);

  // Gemini API는 system 메시지를 지원하지 않으므로 첫 번째 사용자 메시지에 포함
  const conversationMessages = conversationHistory.map((msg) => ({
    role: msg.message_type === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  // Gemini API 요청 형식
  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${systemPrompt}\n\n사용자: ${message}`,
          },
        ],
      },
      ...conversationMessages,
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  };

  // Gemini API 호출
  // 사용 가능한 모델: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash 등
  // v1beta API 사용 (일부 모델은 v1에서 지원하지 않을 수 있음)
  // 기본값: gemini-2.5-flash (무료 티어에 적합하고 빠름)
  const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
  const apiVersion = import.meta.env.VITE_GEMINI_API_VERSION || 'v1beta';
  
  // API 엔드포인트 (REST API 형식)
  const apiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${apiKey}`;
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || 'Gemini API 호출 실패';

    if (response.status === 429) {
      throw new Error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요. (Rate Limit 초과)');
    } else if (response.status === 400 || response.status === 404) {
      // 모델을 찾을 수 없는 경우 도움말 제공
      if (errorMessage.includes('not found') || errorMessage.includes('not supported')) {
        throw new Error(
          `모델 '${modelName}'을 찾을 수 없습니다.\n` +
          `사용 가능한 모델: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash, gemini-2.0-flash-lite\n` +
          `.env.local에서 VITE_GEMINI_MODEL을 변경하세요.\n` +
          `예: VITE_GEMINI_MODEL=gemini-2.5-flash`
        );
      }
      throw new Error(`Gemini API 오류: ${errorMessage}`);
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  const aiResponse = data.candidates[0]?.content?.parts[0]?.text || '응답을 생성할 수 없습니다.';

  // 세션 ID 유효성 확인 (NULL이 아닌 경우)
  if (sessionId) {
    const { data: sessionExists, error: sessionCheckError } = await supabase
      .from('ai_chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .single();
    
    if (sessionCheckError || !sessionExists) {
      console.error('세션 ID 유효성 확인 실패:', sessionCheckError);
      throw new Error(`유효하지 않은 세션 ID입니다: ${sessionId}`);
    }
  }

  // 대화 기록 저장
  const { data: userMsg, error: userError } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: userId,
      session_id: sessionId,
      message_type: 'user',
      content: message,
    })
    .select()
    .single();

  if (userError) {
    console.error('사용자 메시지 저장 오류:', userError);
    throw userError;
  }

  const { data: assistantMsg, error: assistantError } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: userId,
      session_id: sessionId,
      message_type: 'assistant',
      content: aiResponse,
    })
    .select()
    .single();

  if (assistantError) {
    console.error('어시스턴트 메시지 저장 오류:', assistantError);
    throw assistantError;
  }

  // 세션 제목 업데이트 (첫 메시지인 경우)
  if (sessionId) {
    await updateSessionTitle(sessionId, message);
  }

  return {
    response: aiResponse,
    userMessageId: userMsg.id,
    assistantMessageId: assistantMsg.id,
  };
}

/**
 * 클라이언트에서 직접 OpenAI API 호출
 * @param {string} message - 사용자 메시지
 * @param {string} userId - 사용자 ID
 * @param {Array} conversationHistory - 대화 기록
 * @param {string} sessionId - 세션 ID
 * @returns {Promise<{ response: string, userMessageId: string, assistantMessageId: string }>}
 */
async function chatWithAIDirect(message, userId, conversationHistory, sessionId = null) {
  // OpenAI API 키 확인
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다. .env.local 파일에 VITE_OPENAI_API_KEY를 추가하세요.');
  }

  // 사용자 컨텍스트 조회
  const habits = await getHabits();
  const recentCheckins = await getRecentCheckins(habits);

  // System 프롬프트 생성
  const systemPrompt = createSystemPrompt(habits, recentCheckins);

  // 대화 메시지 구성
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: msg.message_type === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: message },
  ];

  // OpenAI API 호출
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || 'OpenAI API 호출 실패';
    
    // 에러 타입에 따른 친절한 메시지
    if (response.status === 429) {
      if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        throw new Error(
          'OpenAI API 할당량이 초과되었습니다.\n' +
          'OpenAI 계정의 결제 정보를 확인하고 할당량을 확인해주세요.\n' +
          'https://platform.openai.com/account/billing'
        );
      } else {
        throw new Error(
          '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.\n' +
          '(Rate Limit 초과)'
        );
      }
    } else if (response.status === 401) {
      throw new Error(
        'OpenAI API 키가 유효하지 않습니다.\n' +
        '.env.local 파일의 VITE_OPENAI_API_KEY를 확인해주세요.'
      );
    } else if (response.status === 500) {
      throw new Error('OpenAI 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  // 세션 ID 유효성 확인 (NULL이 아닌 경우)
  if (sessionId) {
    const { data: sessionExists, error: sessionCheckError } = await supabase
      .from('ai_chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .single();
    
    if (sessionCheckError || !sessionExists) {
      console.error('세션 ID 유효성 확인 실패:', sessionCheckError);
      throw new Error(`유효하지 않은 세션 ID입니다: ${sessionId}`);
    }
  }

  // 대화 기록 저장
  const { data: userMsg, error: userError } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: userId,
      session_id: sessionId,
      message_type: 'user',
      content: message,
    })
    .select()
    .single();

  if (userError) {
    console.error('사용자 메시지 저장 오류:', userError);
    throw userError;
  }

  const { data: assistantMsg, error: assistantError } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: userId,
      session_id: sessionId,
      message_type: 'assistant',
      content: aiResponse,
    })
    .select()
    .single();

  if (assistantError) {
    console.error('어시스턴트 메시지 저장 오류:', assistantError);
    throw assistantError;
  }

  // 세션 제목 업데이트 (첫 메시지인 경우)
  if (sessionId) {
    await updateSessionTitle(sessionId, message);
  }

  return {
    response: aiResponse,
    userMessageId: userMsg.id,
    assistantMessageId: assistantMsg.id,
  };
}

/**
 * 최근 체크인 기록 조회
 * @param {Array} habits - 습관 배열
 * @returns {Promise<Array>} 최근 체크인 배열
 */
async function getRecentCheckins(habits) {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const startDate = sevenDaysAgo.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];

  const allCheckins = await Promise.all(
    habits.map((habit) => getCheckins(habit.id, startDate, endDate))
  );

  return allCheckins.flat();
}

/**
 * System 프롬프트 생성
 * @param {Array} habits - 습관 배열
 * @param {Array} recentCheckins - 최근 체크인 배열
 * @returns {string} System 프롬프트
 */
function createSystemPrompt(habits, recentCheckins) {
  return `당신은 습관 형성을 도와주는 친근한 AI 코치입니다. 사용자의 습관 데이터를 분석하여 맞춤형 조언을 제공하세요.

사용자 습관:
${habits.length > 0 ? JSON.stringify(habits.map(h => ({
  name: h.name,
  description: h.description,
  frequency: `${h.frequency_type} ${h.frequency_value}회`,
  category: h.category,
  is_active: h.is_active,
})), null, 2) : '아직 등록된 습관이 없습니다.'}

최근 체크인 기록 (최근 7일):
${recentCheckins.length > 0 ? JSON.stringify(recentCheckins.slice(0, 20), null, 2) : '최근 체크인 기록이 없습니다.'}

응답 시 주의사항:
- 친근하고 격려하는 톤을 유지하세요
- 구체적이고 실용적인 조언을 제공하세요
- 사용자의 습관 데이터를 참고하여 맞춤형 답변을 하세요
- 한국어로 응답하세요`;
}

/**
 * 대화 기록 조회 (세션별)
 * @param {string} sessionId - 세션 ID (null이면 모든 메시지)
 * @param {number} limit - 조회할 메시지 수 (기본값: 100)
 * @returns {Promise<Array>} 대화 기록 배열
 */
export async function getConversations(sessionId = null, limit = 100) {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [];
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  let query = supabase
    .from('ai_conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (sessionId) {
    query = query.eq('session_id', sessionId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * 채팅 세션 생성
 * @param {string} title - 세션 제목 (선택사항)
 * @returns {Promise<{ id: string, title: string, created_at: string }>}
 */
export async function createSession(title = null) {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      id: `session-${Date.now()}`,
      title: title || '새 대화',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const { data, error } = await supabase
    .from('ai_chat_sessions')
    .insert({
      user_id: user.id,
      title: title || '새 대화',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 채팅 세션 목록 조회
 * @returns {Promise<Array>} 세션 목록 배열
 */
export async function getSessions() {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [];
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const { data, error } = await supabase
    .from('ai_chat_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 채팅 세션 삭제
 * @param {string} sessionId - 세션 ID
 * @returns {Promise<void>}
 */
export async function deleteSession(sessionId) {
  if (USE_DUMMY_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const { error } = await supabase
    .from('ai_chat_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) throw error;
}

/**
 * 세션 제목 업데이트 (첫 메시지 기반)
 * @param {string} sessionId - 세션 ID
 * @param {string} firstMessage - 첫 메시지
 * @returns {Promise<void>}
 */
async function updateSessionTitle(sessionId, firstMessage) {
  if (USE_DUMMY_MODE) return;

  // 세션에 메시지가 하나만 있으면 제목 업데이트
  const { data: messages } = await supabase
    .from('ai_conversations')
    .select('id')
    .eq('session_id', sessionId)
    .eq('message_type', 'user');

  if (messages && messages.length === 1) {
    // 첫 메시지의 앞부분을 제목으로 사용 (최대 50자)
    const title = firstMessage.length > 50 ? firstMessage.substring(0, 50) + '...' : firstMessage;
    
    await supabase
      .from('ai_chat_sessions')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', sessionId);
  }
}
