// Supabase Edge Function: AI Chat
// Deno 환경에서 실행됩니다

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

const SYSTEM_PROMPT = `당신은 습관 형성을 도와주는 친근한 AI 코치입니다. 사용자의 습관 데이터를 분석하여 맞춤형 조언을 제공하세요.

응답 시 주의사항:
- 친근하고 격려하는 톤을 유지하세요
- 구체적이고 실용적인 조언을 제공하세요
- 사용자의 습관 데이터를 참고하여 맞춤형 답변을 하세요
- 한국어로 응답하세요`;

interface RequestBody {
  message: string;
  userId: string;
  conversationHistory?: Array<{ message_type: string; content: string }>;
}

serve(async (req) => {
  // CORS 헤더 설정
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // OpenAI API 키 확인
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API 키가 설정되지 않았습니다.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    // 요청 본문 파싱
    const { message, userId, conversationHistory = [] }: RequestBody = await req.json();

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: 'message와 userId가 필요합니다.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    // Supabase 클라이언트 생성
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: req.headers.get('Authorization') ?? '' },
      },
    });

    // 사용자 습관 조회
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (habitsError) {
      console.error('습관 조회 오류:', habitsError);
    }

    // 최근 체크인 기록 조회 (최근 7일)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const startDate = sevenDaysAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const { data: checkins, error: checkinsError } = await supabase
      .from('habit_checkins')
      .select('*')
      .in(
        'habit_id',
        habits?.map((h) => h.id) ?? []
      )
      .gte('checkin_date', startDate)
      .lte('checkin_date', endDate)
      .order('checkin_date', { ascending: false })
      .limit(20);

    if (checkinsError) {
      console.error('체크인 조회 오류:', checkinsError);
    }

    // 컨텍스트 정보를 System 프롬프트에 추가
    const contextPrompt = `
사용자 습관:
${habits && habits.length > 0
  ? JSON.stringify(
      habits.map((h) => ({
        name: h.name,
        description: h.description,
        frequency: `${h.frequency_type} ${h.frequency_value}회`,
        category: h.category,
        is_active: h.is_active,
      })),
      null,
      2
    )
  : '아직 등록된 습관이 없습니다.'}

최근 체크인 기록 (최근 7일):
${checkins && checkins.length > 0
  ? JSON.stringify(checkins.slice(0, 20), null, 2)
  : '최근 체크인 기록이 없습니다.'}
`;

    // 대화 메시지 구성
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + '\n\n' + contextPrompt },
      ...conversationHistory.map((msg) => ({
        role: msg.message_type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // OpenAI API 호출
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error('OpenAI API 오류:', errorData);
      return new Response(
        JSON.stringify({ error: errorData.error?.message || 'OpenAI API 호출 실패' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    const aiData = await openaiResponse.json();
    const aiResponse = aiData.choices[0].message.content;

    // 대화 기록 저장
    const { data: userMsg, error: userError } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: userId,
        message_type: 'user',
        content: message,
      })
      .select()
      .single();

    if (userError) {
      console.error('사용자 메시지 저장 오류:', userError);
    }

    const { data: assistantMsg, error: assistantError } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: userId,
        message_type: 'assistant',
        content: aiResponse,
      })
      .select()
      .single();

    if (assistantError) {
      console.error('AI 메시지 저장 오류:', assistantError);
    }

    // 응답 반환
    return new Response(
      JSON.stringify({
        response: aiResponse,
        userMessageId: userMsg?.id,
        assistantMessageId: assistantMsg?.id,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Edge Function 오류:', error);
    return new Response(
      JSON.stringify({ error: error.message || '서버 오류가 발생했습니다.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
});
