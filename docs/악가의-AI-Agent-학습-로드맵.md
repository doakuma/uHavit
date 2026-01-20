# 악가의 AI Agent 학습 로드맵

## 📋 문서 정보
- **작성일**: 2026-01-20
- **목적**: AI Agent 개발자 소양 문서를 바탕으로 현재 프로젝트에서 실전 학습하기
- **프로젝트**: uHavit (습관 관리 AI Agent)

---

## 🎯 현재 상태 진단 (솔직하게!)

### 📦 현재 가진 것들
악가야, 솔직히 말하면 지금은 **코드가 있는 상태**일 뿐이야.  
코딩 에이전트가 만들어준 거니까, 아직 **악가가 직접 이해하고 만든 건 아니지**.

하지만! 이게 **오히려 좋은 출발점**이야! 왜냐면:
- ✅ 실제 작동하는 코드가 있음 → 분석하고 배울 수 있어
- ✅ 프로젝트 구조가 잡혀있음 → 바로 실험 가능
- ✅ 개선할 부분이 명확함 → 학습 목표가 분명해

### 🔍 현재 코드 분석 (학습 재료)

#### 1. 프롬프트 엔지니어링 코드 (분석 대상)
**위치**: `ai.js` 423-443줄 `createSystemPrompt` 함수

```javascript
// 지금 있는 코드 (자동 생성)
function createSystemPrompt(habits, recentCheckins) {
  return `당신은 습관 형성을 도와주는 친근한 AI 코치입니다.
  
사용자 습관:
${habits.length > 0 ? JSON.stringify(...) : '아직 등록된 습관이 없습니다.'}

최근 체크인 기록 (최근 7일):
${recentCheckins.length > 0 ? JSON.stringify(...) : '최근 체크인 기록이 없습니다.'}

응답 시 주의사항:
- 친근하고 격려하는 톤을 유지하세요
- 구체적이고 실용적인 조언을 제공하세요
- 사용자의 습관 데이터를 참고하여 맞춤형 답변을 하세요
- 한국어로 응답하세요`;
}
```

**분석 포인트**:
- ❓ 왜 이렇게 구성했을까?
- ❓ 어떤 부분을 개선할 수 있을까?
- ❓ Few-shot Learning을 추가하려면?

**현재 수준**: 코드는 있지만 **이해 필요** 📚

---

#### 2. LLM API 호출 코드 (분석 대상)
**위치**: `ai.js` 266-395줄 `chatWithAIDirect` 함수

```javascript
// OpenAI API 호출 (자동 생성)
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
```

**분석 포인트**:
- ❓ `temperature: 0.7`은 뭘 의미할까?
- ❓ `max_tokens: 500`은 왜 500일까?
- ❓ 다른 파라미터는 뭐가 있을까?
- ❓ 에러 처리는 어떻게 되어있을까?

**현재 수준**: 코드는 있지만 **파라미터 이해 필요** 📚

---

#### 3. 데이터 처리 코드 (분석 대상)
**위치**: `ai.js` 402-415줄 `getRecentCheckins` 함수

**분석 포인트**:
- ❓ 왜 7일치만 가져올까?
- ❓ 더 효율적으로 할 수 있을까?

**현재 수준**: 코드는 있지만 **최적화 방법 학습 필요** 📚

---

### 💡 진짜 현재 수준

**이론 지식**: ⭐ (문서 읽음)  
**실전 경험**: ☆☆☆ (아직 없음)  
**코드 이해도**: ⭐ (분석 시작 단계)  

**결론**: 완전 초보는 아니지만, **실전 경험이 필요한 상태**! 🌱

---

## 🚀 지금 바로 할 수 있는 것들 (실전 학습)

### 학습 전략: 코드 분석 → 이해 → 수정 → 확장

기존 코드를 **분석**하면서 배우고,  
**작은 부분부터 직접 수정**해보면서 익히고,  
나중에 **새 기능을 직접 추가**하면서 완전히 내 것으로 만들자! 💪

---

### 🔰 STEP 0: 기존 코드 이해하기 (선행 학습)

#### 0.1 현재 프롬프트 코드 분석
**목표**: 자동 생성된 코드가 어떻게 작동하는지 이해  
**난이도**: ⭐ (쉬움)  
**예상 시간**: 30분 - 1시간  

**작업 내용**:
1. `ai.js` 파일 열어서 천천히 읽기
2. `createSystemPrompt` 함수 이해하기
   - 왜 이렇게 구성했을까?
   - 각 부분의 역할은 뭘까?
3. 실제로 AI에게 보내지는 프롬프트 확인하기
   - 브라우저 개발자 도구 → Network 탭
   - AI API 요청 내용 확인

**학습 포인트**:
- 프롬프트 구조 이해
- System Prompt vs User Message 차이
- 컨텍스트 주입 방식

**체크리스트**:
- [ ] `createSystemPrompt` 함수가 뭘 하는지 이해했다
- [ ] System Prompt가 어떻게 구성되는지 안다
- [ ] 습관 데이터가 어떻게 주입되는지 안다

---

#### 0.2 LLM API 파라미터 이해
**목표**: API 호출 파라미터의 의미 파악  
**난이도**: ⭐ (쉬움)  
**예상 시간**: 30분  

**학습 내용**:
```javascript
{
  model: 'gpt-4o-mini',      // 어떤 모델? 왜 mini?
  messages,                   // 메시지 형식은?
  temperature: 0.7,           // 이게 뭐지? (0~2)
  max_tokens: 500,            // 왜 500? 늘리면?
}
```

**실험해보기**:
1. `temperature`를 0.3, 1.0, 1.5로 바꿔보기
   - 차이가 느껴지나?
2. `max_tokens`를 100, 1000으로 바꿔보기
   - 응답이 어떻게 달라지나?

**학습 자료**:
- OpenAI API 문서: https://platform.openai.com/docs/api-reference/chat/create

**체크리스트**:
- [ ] `temperature`가 뭔지 안다 (창의성 vs 일관성)
- [ ] `max_tokens`의 역할을 안다
- [ ] 다른 파라미터도 조사해봤다

---

### 레벨 1: 프롬프트 엔지니어링 강화 🔥

#### 1.1 Few-shot Learning 적용 (첫 실전!)
**목표**: 기존 프롬프트에 예시 추가하여 응답 품질 향상  
**난이도**: ⭐ (쉬움)  
**예상 시간**: 1-2시간  
**학습 방식**: 기존 코드 수정 ✏️  

**작업 내용**:
```javascript
// ai.js의 createSystemPrompt 함수 개선
const systemPrompt = `당신은 습관 형성을 도와주는 친근한 AI 코치입니다.

[예시 대화]
사용자: "운동을 시작하고 싶은데 어떻게 해야 할까요?"
AI: "좋은 목표네요! 처음엔 작은 목표부터 시작하는 게 중요해요. 예를 들어 '매일 10분 걷기'처럼 부담 없는 목표로 시작해보세요. 악가님의 일정은 어떤가요? 아침이 좋을까요, 저녁이 좋을까요?"

사용자: "요즘 습관을 잘 못 지키고 있어요..."
AI: "괜찮아요! 습관 형성은 실패를 반복하며 배우는 과정이에요. 최근 일주일 데이터를 보니 주말에 실패가 많더라고요. 주말엔 어떤 일이 있었나요? 함께 원인을 찾아보아요."

[사용자 데이터]
...
`;
```

**학습 포인트**:
- Few-shot Learning의 효과 체험
- 응답 톤과 패턴 제어 경험
- 예시를 통한 행동 유도

---

#### 1.2 Chain-of-Thought (CoT) 적용
**목표**: AI가 단계별로 사고하도록 유도  
**난이도**: ⭐⭐ (중간)  
**예상 시간**: 2-3시간  

**작업 내용**:
```javascript
// 특정 기능에 CoT 프롬프트 추가
// 예: 습관 실패 분석 시

const analyzeFailurePrompt = `다음 단계를 따라 습관 실패 원인을 분석해주세요:

1단계: 데이터 패턴 파악
- 최근 7일간 성공/실패 패턴 확인
- 요일별, 시간대별 차이 확인

2단계: 가능한 원인 추론
- 환경적 요인 (주말, 바쁜 시간대)
- 심리적 요인 (동기 부족, 스트레스)
- 목표 난이도 (너무 높거나 낮음)

3단계: 구체적 조언 제시
- 원인에 맞는 해결책 제안
- 실천 가능한 작은 단계 제시

4단계: 응답 작성
- 친근하고 격려하는 톤으로 작성
- 구체적인 예시 포함

---
[사용자 데이터]
...
`;
```

**학습 포인트**:
- 복잡한 작업을 단계별로 분해
- AI의 사고 과정 명시적으로 유도
- 더 정확하고 논리적인 응답 생성

---

#### 1.3 구조화된 출력 (JSON 응답)
**목표**: AI 응답을 구조화하여 UI에 반영  
**난이도**: ⭐⭐ (중간)  
**예상 시간**: 2-4시간  

**작업 내용**:
```javascript
// 예: 습관 피드백 요청 시 구조화된 응답
const feedbackPrompt = `
다음 형식의 JSON으로 응답해주세요:

{
  "encouragement": "현재 성과에 대한 격려 (1-2문장)",
  "strengths": ["잘하고 있는 점 1", "잘하고 있는 점 2"],
  "improvements": ["개선할 수 있는 점 1", "개선할 수 있는 점 2"],
  "actionItems": [
    {
      "action": "구체적인 행동 1",
      "reason": "왜 이 행동이 도움이 되는지"
    }
  ],
  "motivationalQuote": "오늘의 동기부여 한마디"
}

[습관 데이터]
...
`;
```

**UI 개선**:
- `HabitAIFeedback` 컴포넌트에서 구조화된 데이터 활용
- 섹션별로 나눠서 보기 좋게 표시
- 액션 아이템을 체크리스트로 표시

**학습 포인트**:
- 구조화된 출력의 장점 체험
- JSON 파싱 및 검증
- UI와 AI 응답 연동

---

### 레벨 2: Function Calling (Tool Use) 구현 🔥🔥

#### 2.1 기본 Function Calling
**목표**: AI가 함수를 호출하여 실제 액션 수행  
**난이도**: ⭐⭐⭐ (높음)  
**예상 시간**: 4-8시간  

**구현할 함수들**:
1. `createHabit(name, description, frequency, category)` - 습관 생성
2. `updateHabit(habitId, updates)` - 습관 수정
3. `checkinHabit(habitId, date, value)` - 체크인 기록
4. `getHabitStats(habitId)` - 습관 통계 조회
5. `analyzePattern(habitId)` - 패턴 분석

**작업 내용**:
```javascript
// ai.js에 함수 정의 추가
const tools = [
  {
    type: "function",
    function: {
      name: "create_habit",
      description: "새로운 습관을 생성합니다",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "습관 이름 (예: '매일 운동하기')"
          },
          description: {
            type: "string",
            description: "습관 설명 (선택사항)"
          },
          frequency_type: {
            type: "string",
            enum: ["daily", "weekly", "monthly"],
            description: "빈도 유형"
          },
          frequency_value: {
            type: "number",
            description: "빈도 값 (예: 주 3회면 3)"
          },
          category: {
            type: "string",
            enum: ["운동", "독서", "건강", "학습", "업무", "기타"],
            description: "카테고리"
          }
        },
        required: ["name", "frequency_type", "frequency_value"]
      }
    }
  },
  // ... 다른 함수들
];

// OpenAI API 호출 시 tools 추가
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages,
    tools, // 🔥 추가!
    tool_choice: "auto", // AI가 필요시 자동으로 함수 호출
    temperature: 0.7,
    max_tokens: 500,
  }),
});

// 응답에서 함수 호출 확인
const aiData = await response.json();
const message = aiData.choices[0].message;

if (message.tool_calls) {
  // AI가 함수를 호출하려고 함
  for (const toolCall of message.tool_calls) {
    const functionName = toolCall.function.name;
    const functionArgs = JSON.parse(toolCall.function.arguments);
    
    // 실제 함수 실행
    let functionResult;
    switch (functionName) {
      case 'create_habit':
        functionResult = await createHabitFromAI(functionArgs);
        break;
      case 'checkin_habit':
        functionResult = await checkinHabitFromAI(functionArgs);
        break;
      // ... 다른 함수들
    }
    
    // 함수 실행 결과를 다시 AI에게 전달
    messages.push({
      role: "function",
      name: functionName,
      content: JSON.stringify(functionResult)
    });
  }
  
  // 함수 실행 결과를 바탕으로 최종 응답 생성
  const finalResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    // ... (동일한 요청, messages에 함수 실행 결과 포함)
  });
}
```

**실제 사용 예시**:
```
사용자: "매일 아침 30분 운동하는 습관을 만들어줘"
AI: [create_habit 함수 호출]
    → 함수 실행: 습관 생성 완료
    → AI 응답: "좋아요! '매일 아침 30분 운동하기' 습관을 만들었어요! 
                내일 아침부터 시작해볼까요? 알림 시간도 설정할까요?"
```

**학습 포인트**:
- Function Calling의 핵심 개념 이해
- AI와 실제 시스템 연동
- 단순 챗봇 → 실행 가능한 Agent로 전환

---

#### 2.2 멀티턴 Function Calling
**목표**: 여러 함수를 연속으로 호출하여 복잡한 작업 수행  
**난이도**: ⭐⭐⭐ (높음)  
**예상 시간**: 4-6시간  

**시나리오 예시**:
```
사용자: "이번 주 운동 습관 분석해서 보고해줘"
AI: 
  1. getHabitStats("운동") 호출 → 통계 조회
  2. analyzePattern("운동") 호출 → 패턴 분석
  3. 두 결과를 종합하여 보고서 작성
```

**학습 포인트**:
- 복잡한 작업을 여러 함수 호출로 분해
- 함수 실행 순서 관리
- 멀티턴 대화 처리

---

### 레벨 3: RAG 패턴 구현 🔥🔥

#### 3.1 벡터 임베딩 및 검색
**목표**: 대화 기록과 습관 데이터를 벡터로 저장하고 유사도 검색  
**난이도**: ⭐⭐⭐ (높음)  
**예상 시간**: 6-10시간  

**작업 내용**:
1. **Supabase Vector Extension 활성화**
   ```sql
   -- schema.sql에 추가
   create extension if not exists vector;
   
   -- 대화 기록에 벡터 컬럼 추가
   alter table ai_conversations
   add column embedding vector(1536);
   
   -- 벡터 유사도 검색 함수
   create or replace function match_conversations(
     query_embedding vector(1536),
     match_threshold float,
     match_count int
   )
   returns table (
     id uuid,
     content text,
     similarity float
   )
   language sql stable
   as $$
     select
       id,
       content,
       1 - (ai_conversations.embedding <=> query_embedding) as similarity
     from ai_conversations
     where 1 - (ai_conversations.embedding <=> query_embedding) > match_threshold
     order by similarity desc
     limit match_count;
   $$;
   ```

2. **임베딩 생성 (OpenAI API)**
   ```javascript
   // ai.js에 임베딩 함수 추가
   async function generateEmbedding(text) {
     const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
     
     const response = await fetch('https://api.openai.com/v1/embeddings', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${apiKey}`,
       },
       body: JSON.stringify({
         model: 'text-embedding-3-small', // 더 저렴한 모델
         input: text,
       }),
     });
     
     const data = await response.json();
     return data.data[0].embedding;
   }
   
   // 대화 저장 시 임베딩 생성
   const embedding = await generateEmbedding(message);
   
   const { data: userMsg, error: userError } = await supabase
     .from('ai_conversations')
     .insert({
       user_id: userId,
       session_id: sessionId,
       message_type: 'user',
       content: message,
       embedding, // 🔥 벡터 저장
     })
     .select()
     .single();
   ```

3. **관련 대화 검색 및 컨텍스트 주입**
   ```javascript
   // 사용자 메시지와 유사한 과거 대화 검색
   async function searchRelevantConversations(message, userId) {
     const queryEmbedding = await generateEmbedding(message);
     
     const { data, error } = await supabase.rpc('match_conversations', {
       query_embedding: queryEmbedding,
       match_threshold: 0.7, // 유사도 70% 이상
       match_count: 5, // 상위 5개
     });
     
     return data;
   }
   
   // System Prompt에 관련 대화 추가
   const relevantConversations = await searchRelevantConversations(message, userId);
   
   const systemPrompt = `...
   
   [참고: 과거 유사한 대화]
   ${relevantConversations.map(c => `- ${c.content}`).join('\n')}
   
   ...`;
   ```

**학습 포인트**:
- 벡터 임베딩의 개념 이해
- 유사도 검색 (Similarity Search) 경험
- RAG 패턴의 실전 적용
- 컨텍스트 윈도우 최적화 (비용 절감)

---

#### 3.2 하이브리드 검색 (키워드 + 벡터)
**목표**: 키워드 검색과 벡터 검색을 결합하여 정확도 향상  
**난이도**: ⭐⭐⭐ (높음)  
**예상 시간**: 4-6시간  

**작업 내용**:
```javascript
// 키워드 검색 (PostgreSQL Full-Text Search)
const { data: keywordResults } = await supabase
  .from('ai_conversations')
  .select('*')
  .textSearch('content', message)
  .limit(10);

// 벡터 검색
const vectorResults = await searchRelevantConversations(message, userId);

// 두 결과를 결합 (Reciprocal Rank Fusion)
const combinedResults = combineResults(keywordResults, vectorResults);
```

**학습 포인트**:
- 하이브리드 검색의 장점
- 검색 결과 조합 알고리즘

---

### 레벨 4: Agent 패턴 구현 🔥🔥🔥

#### 4.1 ReAct 패턴
**목표**: Reasoning + Acting 패턴으로 복잡한 작업 수행  
**난이도**: ⭐⭐⭐⭐ (매우 높음)  
**예상 시간**: 8-12시간  

**개념**:
```
Thought (사고) → Action (행동) → Observation (관찰) → 반복
```

**구현 예시**:
```javascript
// ReAct 루프
async function reactLoop(userMessage, maxIterations = 5) {
  const history = [];
  
  for (let i = 0; i < maxIterations; i++) {
    // 1. Thought: AI가 다음 행동 계획
    const thoughtPrompt = `
[이전 기록]
${history.join('\n')}

[사용자 요청]
${userMessage}

다음 중 하나를 선택하세요:
1. Thought: 현재 상황을 분석하고 다음 행동 계획
2. Action: 함수를 호출하여 정보 수집 또는 작업 수행
3. Answer: 최종 답변 제공

형식:
Thought: [당신의 생각]
Action: [함수 이름](인자들)
또는
Answer: [최종 답변]
`;
    
    const response = await callAI(thoughtPrompt);
    
    // 2. 응답 파싱
    if (response.startsWith('Answer:')) {
      // 최종 답변 도달
      return response.replace('Answer:', '').trim();
    }
    
    const thought = extractThought(response);
    const action = extractAction(response);
    
    history.push(`Thought: ${thought}`);
    history.push(`Action: ${action}`);
    
    // 3. Action 실행
    const observation = await executeAction(action);
    history.push(`Observation: ${observation}`);
    
    // 4. 다음 반복으로
  }
  
  return '작업을 완료하지 못했습니다. 다시 시도해주세요.';
}
```

**사용 예시**:
```
사용자: "이번 달 가장 성공률이 높은 습관을 찾아서 그 패턴을 분석해줘"

Iteration 1:
Thought: 먼저 모든 습관의 성공률을 조회해야겠다
Action: getHabitsStats()
Observation: [습관1: 85%, 습관2: 92%, 습관3: 78%]

Iteration 2:
Thought: 습관2가 가장 높네. 이제 패턴을 분석해야지
Action: analyzePattern(습관2)
Observation: [요일별 패턴, 시간대별 패턴]

Iteration 3:
Thought: 충분한 정보를 얻었으니 보고서를 작성하자
Answer: 이번 달 가장 성공률이 높은 습관은 '습관2'로 92%예요! 
        패턴을 보니 주중 아침에 성공률이 높고...
```

**학습 포인트**:
- Agent의 자율적 사고 과정 구현
- 멀티스텝 추론 (Multi-step Reasoning)
- 복잡한 작업의 자동화

---

#### 4.2 Plan-and-Execute 패턴
**목표**: 복잡한 작업을 계획하고 단계별로 실행  
**난이도**: ⭐⭐⭐⭐ (매우 높음)  
**예상 시간**: 8-12시간  

**구현 예시**:
```javascript
async function planAndExecute(userGoal) {
  // 1. Planning Phase
  const plan = await createPlan(userGoal);
  // plan: ["1단계: ...", "2단계: ...", "3단계: ..."]
  
  // 2. Execution Phase
  const results = [];
  for (const step of plan) {
    const result = await executeStep(step);
    results.push(result);
    
    // 필요시 계획 수정
    if (result.needsReplanning) {
      plan = await adjustPlan(plan, results);
    }
  }
  
  // 3. 최종 보고
  return summarizeResults(results);
}
```

**학습 포인트**:
- 계획 수립 능력
- 동적 계획 조정
- 장기 작업 관리

---

### 레벨 5: 고급 메모리 시스템 🔥🔥

#### 5.1 사용자 프로필 요약
**목표**: 대화를 통해 사용자 특성 파악 및 요약 저장  
**난이도**: ⭐⭐⭐ (높음)  
**예상 시간**: 4-6시간  

**작업 내용**:
```javascript
// 새 테이블 추가 (schema.sql)
create table user_profiles_summary (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  personality_traits jsonb, -- 성격 특성
  preferences jsonb,         -- 선호도
  goals jsonb,              -- 목표
  challenges jsonb,         -- 어려움
  updated_at timestamptz default now()
);

// 대화 분석하여 프로필 업데이트
async function updateUserProfile(userId, conversations) {
  const summaryPrompt = `
다음 대화를 분석하여 사용자의 특성을 JSON으로 요약해주세요:

{
  "personality_traits": ["아침형 인간", "완벽주의 성향"],
  "preferences": ["아침 운동 선호", "혼자 하는 활동 선호"],
  "goals": ["건강 개선", "생산성 향상"],
  "challenges": ["주말에 루틴 무너짐", "동기부여 부족"]
}

[대화 기록]
${conversations.map(c => c.content).join('\n')}
`;

  const summary = await callAI(summaryPrompt);
  
  await supabase
    .from('user_profiles_summary')
    .upsert({
      user_id: userId,
      ...JSON.parse(summary),
      updated_at: new Date().toISOString(),
    });
}
```

**학습 포인트**:
- 장기 메모리 관리
- 사용자 모델링
- 개인화된 경험 제공

---

#### 5.2 대화 압축 (요약)
**목표**: 긴 대화 기록을 요약하여 토큰 절약  
**난이도**: ⭐⭐ (중간)  
**예상 시간**: 3-4시간  

**작업 내용**:
```javascript
// 대화가 일정 길이를 넘으면 요약
async function compressConversationHistory(conversations) {
  if (conversations.length < 20) {
    return conversations; // 짧으면 그대로
  }
  
  // 오래된 대화 (10-20번째)를 요약
  const toSummarize = conversations.slice(10, 20);
  
  const summaryPrompt = `
다음 대화를 3-5줄로 요약해주세요:
${toSummarize.map(c => c.content).join('\n')}
`;

  const summary = await callAI(summaryPrompt);
  
  // 최근 10개 + 요약 + 나머지
  return [
    ...conversations.slice(0, 10),
    { role: 'system', content: `[이전 대화 요약]\n${summary}` },
    ...conversations.slice(20),
  ];
}
```

**학습 포인트**:
- 토큰 비용 관리
- 컨텍스트 윈도우 최적화
- 정보 손실 최소화

---

### 레벨 6: 평가 및 모니터링 🔥

#### 6.1 응답 품질 메트릭
**목표**: AI 응답 품질을 자동으로 평가  
**난이도**: ⭐⭐⭐ (높음)  
**예상 시간**: 4-6시간  

**작업 내용**:
```javascript
// 응답 품질 평가 (AI로 AI를 평가)
async function evaluateResponse(userMessage, aiResponse, context) {
  const evalPrompt = `
다음 AI 응답을 평가해주세요 (1-5점):

[사용자 질문]
${userMessage}

[AI 응답]
${aiResponse}

[컨텍스트]
${context}

평가 기준:
1. 관련성: 사용자 질문과 관련이 있는가?
2. 유용성: 실제로 도움이 되는가?
3. 친근함: 톤이 친근하고 격려하는가?
4. 구체성: 구체적인 조언을 제공하는가?

JSON 형식으로 응답:
{
  "relevance": 4,
  "usefulness": 5,
  "friendliness": 5,
  "specificity": 3,
  "overall": 4.25,
  "feedback": "좋은 응답이지만 좀 더 구체적인 예시가 있으면 좋겠습니다"
}
`;

  const evaluation = await callAI(evalPrompt);
  
  // DB에 저장
  await supabase.from('ai_response_evaluations').insert({
    conversation_id: conversationId,
    evaluation: JSON.parse(evaluation),
  });
}
```

**학습 포인트**:
- AI 응답 품질 측정
- 자동화된 평가 시스템
- 지속적 개선

---

#### 6.2 사용자 피드백 수집
**목표**: 👍/👎 버튼으로 피드백 수집 및 분석  
**난이도**: ⭐⭐ (중간)  
**예상 시간**: 2-4시간  

**작업 내용**:
1. **UI 추가** (`HabitAIChatWidget`)
   ```jsx
   <div className="message-feedback">
     <button onClick={() => handleFeedback(message.id, 'positive')}>
       👍
     </button>
     <button onClick={() => handleFeedback(message.id, 'negative')}>
       👎
     </button>
   </div>
   ```

2. **피드백 저장**
   ```javascript
   async function saveFeedback(messageId, feedbackType, comment = null) {
     await supabase.from('ai_feedback').insert({
       message_id: messageId,
       feedback_type: feedbackType, // 'positive' or 'negative'
       comment,
     });
   }
   ```

3. **피드백 분석**
   ```javascript
   async function analyzeFeedback() {
     const { data } = await supabase
       .from('ai_feedback')
       .select('*, ai_conversations(content)')
       .eq('feedback_type', 'negative');
     
     // 부정적 피드백이 많은 패턴 찾기
     const negativePatterns = await findPatterns(data);
     
     // 프롬프트 개선에 활용
     await improvePromptBasedOnFeedback(negativePatterns);
   }
   ```

**학습 포인트**:
- 사용자 중심 개선
- 피드백 루프 구축
- 데이터 기반 의사결정

---

### 레벨 7: 실전 AI Agent 기능 구현 🔥🔥🔥

#### 7.1 습관 추천 Agent
**목표**: 사용자 데이터를 분석하여 새로운 습관 추천  
**난이도**: ⭐⭐⭐⭐ (매우 높음)  
**예상 시간**: 8-12시간  

**구현 단계**:
1. **데이터 수집**: 현재 습관, 성공률, 패턴
2. **분석**: 부족한 영역 파악
3. **추천 생성**: 맞춤형 습관 제안
4. **Action**: 사용자 확인 후 습관 생성

**작업 내용**:
```javascript
// HabitSuggestions 컴포넌트 AI 통합
async function generateHabitSuggestions(userId) {
  // 1. 사용자 데이터 분석
  const habits = await getHabits();
  const stats = await getHabitsStats();
  const profile = await getUserProfileSummary(userId);
  
  // 2. AI에게 추천 요청 (Function Calling 사용)
  const suggestionPrompt = `
사용자의 현재 습관과 성공 패턴을 분석하여 새로운 습관을 추천해주세요.

[현재 습관]
${JSON.stringify(habits)}

[통계]
${JSON.stringify(stats)}

[사용자 프로필]
${JSON.stringify(profile)}

추천 조건:
- 현재 없는 카테고리 우선
- 사용자의 성공 패턴과 유사한 빈도
- 실현 가능한 목표

3개의 습관을 추천하고, 각각에 대해:
1. 습관 이름
2. 설명
3. 추천 이유
4. 예상 성공률
`;

  const suggestions = await callAI(suggestionPrompt);
  return JSON.parse(suggestions);
}
```

**학습 포인트**:
- 데이터 기반 추천 시스템
- 개인화된 Agent 경험
- 엔드-투-엔드 AI Agent 워크플로우

---

#### 7.2 패턴 분석 Agent (Phase 2 기능)
**목표**: 습관 성공/실패 패턴을 자동으로 분석  
**난이도**: ⭐⭐⭐⭐ (매우 높음)  
**예상 시간**: 10-15시간  

**구현 내용**:
- 요일별 성공률 분석
- 시간대별 성공률 분석
- 습관 간 상관관계 분석
- AI가 인사이트 자동 생성

**학습 포인트**:
- 고급 데이터 분석
- 통계적 인사이트 생성
- 자동화된 보고서 작성

---

#### 7.3 예측 Agent (Phase 2 기능)
**목표**: 목표 달성 가능성 예측  
**난이도**: ⭐⭐⭐⭐ (매우 높음)  
**예상 시간**: 10-15시간  

**구현 내용**:
- 현재 성공률 기반 예측
- 트렌드 분석
- "이대로 가면 목표 달성 확률 85%" 같은 예측 제공

**학습 포인트**:
- 예측 모델링
- 시계열 분석
- 확률 기반 조언

---

## 📚 학습 자료 및 참고

### 필수 학습 자료
1. **OpenAI Function Calling**: https://platform.openai.com/docs/guides/function-calling
2. **LangChain 튜토리얼**: https://python.langchain.com/docs/get_started/
   - (참고: JavaScript도 지원 - LangChain.js)
3. **Supabase Vector**: https://supabase.com/docs/guides/ai/vector-columns
4. **ReAct 논문**: "ReAct: Synergizing Reasoning and Acting in Language Models"

### 추가 자료
- DeepLearning.AI - ChatGPT Prompt Engineering (무료)
- OpenAI Cookbook: https://cookbook.openai.com/
- Anthropic Prompt Library: https://docs.anthropic.com/claude/prompt-library

---

## 🎯 추천 학습 순서

### 🌱 1단계: 코드 이해 (지금 바로!)
**기간**: 1-2일  
**목표**: 자동 생성된 코드가 뭘 하는지 완전히 이해하기

1. ✅ **STEP 0.1: 현재 프롬프트 코드 분석** (30분-1시간)
2. ✅ **STEP 0.2: LLM API 파라미터 이해** (30분)
3. ✅ **실험**: 파라미터 바꿔보며 결과 확인 (1-2시간)

**학습 효과**: 
- 코드가 어떻게 작동하는지 이해 ✨
- 실험을 통해 체감 🔬
- 자신감 상승! 💪

**체크포인트**:
- [ ] `ai.js` 파일을 읽고 이해했다
- [ ] API 파라미터를 직접 바꿔봤다
- [ ] 결과 차이를 체감했다

---

### 🔰 2단계: 작은 수정 (1주일 내)
**기간**: 1주일  
**목표**: 기존 코드를 조금씩 개선해보기

1. ✅ **프롬프트 엔지니어링 강화** (레벨 1)
   - Few-shot Learning 적용 (1-2시간)
   - Chain-of-Thought 적용 (2-3시간)
   - 구조화된 출력 (2-4시간)

**학습 효과**: 즉시 AI 응답 품질 향상 체험! ✨

**체크포인트**:
- [ ] 프롬프트를 직접 수정해봤다
- [ ] 응답이 개선되는 걸 확인했다
- [ ] Before/After를 비교했다

---

### 🚀 3단계: 새 기능 추가 (2-3주 내)
2. ✅ **Function Calling 구현** (레벨 2)
   - 기본 Function Calling (4-8시간)
   - 멀티턴 Function Calling (4-6시간)

**예상 기간**: 2주  
**학습 효과**: 챗봇 → 실행 가능한 Agent 전환! 🔥

---

### 💪 4단계: 고급 기능 (1-2개월 내)
3. ✅ **RAG 패턴 구현** (레벨 3)
   - 벡터 임베딩 및 검색 (6-10시간)
   - 하이브리드 검색 (4-6시간)

4. ✅ **메모리 시스템** (레벨 5)
   - 사용자 프로필 요약 (4-6시간)
   - 대화 압축 (3-4시간)

**예상 기간**: 1개월  
**학습 효과**: 프로덕션 수준의 Agent 시스템! 💎

---

### 🏆 5단계: 전문가 (2-3개월 내)
5. ✅ **Agent 패턴 구현** (레벨 4)
   - ReAct 패턴 (8-12시간)
   - Plan-and-Execute 패턴 (8-12시간)

6. ✅ **평가 및 모니터링** (레벨 6)
   - 응답 품질 메트릭 (4-6시간)
   - 사용자 피드백 시스템 (2-4시간)

7. ✅ **실전 AI Agent 기능** (레벨 7)
   - 습관 추천 Agent (8-12시간)
   - 패턴 분석 Agent (10-15시간)
   - 예측 Agent (10-15시간)

**예상 기간**: 2-3개월  
**학습 효과**: AI Agent 개발자로 완성! 🎉

---

## ✅ 체크리스트 (솔직 버전!)

### 현재 상태 (코드는 있지만...)
- [ ] 프롬프트 엔지니어링 **코드 이해** ← 아직 완전히 이해 못함
- [ ] LLM API **파라미터 의미 파악** ← temperature가 뭔지 모름
- [x] JavaScript 기초 (이건 할 수 있어!)
- [x] 데이터베이스 연동 (Supabase 쓰고 있어!)

### 첫 번째 목표 (이번 주!)
- [ ] **STEP 0.1**: `createSystemPrompt` 함수 완전히 이해
- [ ] **STEP 0.2**: API 파라미터 (temperature, max_tokens) 이해
- [ ] **실험**: 파라미터 직접 바꿔보기
- [ ] **정리**: 배운 것 메모하기

### 두 번째 목표 (다음 주!)
- [ ] Few-shot Learning 직접 적용해보기
- [ ] 응답 Before/After 비교하기
- [ ] Chain-of-Thought 이해하기

### 세 번째 목표 (이번 달!)
- [ ] Function Calling 구현 (핵심!)
- [ ] 구조화된 출력 (JSON) 적용
- [ ] 실제 작동하는 Agent 만들기

### 장기 목표 (2-3개월!)
- [ ] RAG 패턴 이해 및 구현
- [ ] Agent 패턴 (ReAct) 구현
- [ ] 멀티 에이전트 시스템 설계

---

## 💡 팁 및 주의사항

### 실패해도 괜찮아!
- AI Agent 개발은 시행착오의 연속이야
- 프롬프트 하나 개선하는데 10번 넘게 시도하는 게 정상!
- 실패할 때마다 배우는 거니까 두려워하지 마 💪

### 비용 관리
- 개발 중엔 `gpt-4o-mini` 사용 (저렴함)
- 토큰 사용량 모니터링
- 캐싱 전략 활용 (같은 요청은 재사용)
- Gemini 무료 티어 적극 활용!

### 테스트 주도 개발
- 새 기능 구현 전에 테스트 케이스 먼저 작성
- 예상 입력/출력을 명확히 정의
- 엣지 케이스도 고려

### 문서화
- 프롬프트 변경 시 버전 관리
- 어떤 프롬프트가 효과적이었는지 기록
- A/B 테스트 결과 문서화

---

## 🎯 오늘 뭐부터 해볼까?

### 추천: STEP 0부터 차근차근! 📚

**왜 STEP 0부터?**
- 코드를 이해해야 수정할 수 있어
- 30분~1시간이면 충분해
- 기초가 탄탄해야 나중에 헷갈리지 않아
- 실험하면서 재미도 있어! 🔬

### 오늘의 미션 (30분-1시간)

1. ✅ `dev/src/services/supabase/ai.js` 파일 열기
2. ✅ `createSystemPrompt` 함수 찾기 (423줄쯤)
3. ✅ 천천히 읽으면서 이해하기
4. ✅ 궁금한 점 메모하기

**이해 체크 질문**:
- System Prompt가 뭐지?
- 왜 습관 데이터를 JSON으로 보낼까?
- "친근하고 격려하는 톤"을 AI가 어떻게 알까?

### 내일의 미션 (30분)

1. ✅ `chatWithAIDirect` 함수 찾기 (266줄쯤)
2. ✅ API 파라미터 이해하기
3. ✅ `temperature` 값을 0.3 → 1.0으로 바꿔보기
4. ✅ 실제로 채팅해보면서 차이 느껴보기

---

## 💪 악가에게 하고 싶은 말

악가야, 솔직히 말해줘서 고마워! 🙌

자동 생성된 코드라고 부끄러워할 필요 전혀 없어.  
오히려 **좋은 학습 자료**가 생긴 거잖아!

진짜 실력은:
1. 코드를 **분석하고 이해**하는 것
2. 왜 그렇게 했는지 **비판적으로 사고**하는 것
3. 더 나은 방법을 **직접 시도**해보는 것

이 세 가지만 하면 돼!

천천히, 하나씩 해보자.  
막히는 거 있으면 언제든 불러줘! 같이 코드 뜯어보면서 배워나가자~ ❤️

**시작이 반이야! 오늘 30분만 투자해보자!** ✨

---

## 📝 학습 일지 작성 팁

매일 배운 걸 간단히 메모해두면 좋아:

```markdown
## 2026-01-20

### 오늘 배운 것
- createSystemPrompt 함수가 뭘 하는지 이해함
- System Prompt가 AI의 "역할"을 정의한다는 걸 알게 됨

### 궁금한 것
- temperature가 정확히 어떻게 작동하는지?
- 다른 모델은 어떤 게 있을까?

### 내일 할 것
- temperature 실험해보기
- Few-shot Learning 적용해보기
```

이렇게 기록하면:
- 성장이 눈에 보여서 뿌듯해 😊
- 나중에 막힐 때 돌아보기 좋아
- 학습 속도가 빨라져!

**화이팅! 악가는 할 수 있어!** 💪✨

---

## 🎉 마무리

**현재 수준**: 완전 초보 (솔직하게!)  
**강점**: 코드가 있고, 배울 의지가 있어!  
**다음 스텝**: 코드 이해 → 작은 수정 → 새 기능 추가! 🚀

2-3개월 후엔:
- Function Calling으로 실행 가능한 Agent 만들기 ✅
- RAG 패턴으로 똑똑한 검색 구현하기 ✅
- ReAct 패턴으로 자율적으로 생각하는 Agent 만들기 ✅

이 모든 게 가능해! 

**지금은 코드를 이해하는 게 먼저야.** 📚  
**천천히, 확실하게 배워나가자!** 💪

궁금한 거 있으면 언제든 불러줘~ 같이 해보자! ❤️✨
