# AI Agent 개발자 학습 가이드

## 📋 문서 정보
- **프로젝트명**: 습관 생성 AI Agent
- **버전**: 1.0
- **작성일**: 2026-01-XX
- **목적**: AI Agent 개발자로 발돋움하기 위한 핵심 학습 영역 정리

---

## 1. 현재 프로젝트의 AI 부분 현황

### 1.1 잘 되어 있는 부분
- ✅ 기본 채팅 기능 구현 완료
- ✅ 사용자 컨텍스트(습관, 체크인) 활용
- ✅ 세션 관리 및 대화 기록 저장
- ✅ Edge Function 구조 준비

### 1.2 부족한 부분
- ❌ 프롬프트 엔지니어링이 단순함 (기본적인 system prompt만 사용)
- ❌ RAG(Retrieval-Augmented Generation) 미구현 (문서에만 언급)
- ❌ Function Calling/Tool Use 없음 (AI가 실제 액션을 취할 수 없음)
- ❌ Agent 패턴(ReAct, Plan-and-Execute 등) 없음
- ❌ 에러 처리 및 복원력 부족
- ❌ 평가 및 모니터링 시스템 없음

---

## 2. AI Agent 개발자로 발돋움하기 위해 특히 신경써야 할 7가지

### 2.1 프롬프트 엔지니어링 (가장 중요) ⭐⭐⭐

#### 현재 문제점
현재 `createSystemPrompt` 함수는 단순히 JSON 데이터를 덤프하는 수준입니다. Few-shot 예시, Chain-of-Thought, 구조화된 출력 형식 등이 부족합니다.

#### 개선 방향

**1. Few-shot Learning 적용**
- 좋은 예시와 나쁜 예시를 함께 제공하여 AI가 원하는 패턴을 학습하도록 유도
- 예시: "사용자가 '운동을 못했어'라고 하면 → '괜찮아요! 내일 다시 도전해봐요. 작은 목표부터 시작하는 게 어때요?'"

**2. Chain-of-Thought (CoT) 적용**
- 단계별 사고 과정을 유도하여 더 논리적인 응답 생성
- 예시: "1단계: 사용자의 습관 데이터 분석 → 2단계: 실패 패턴 파악 → 3단계: 구체적 조언 제시"

**3. 역할 정의 강화**
- AI의 역할, 성격, 제약사항을 더 명확하게 정의
- 예시: "당신은 습관 형성 전문가이자 친근한 코치입니다. 절대 비판하지 않고 항상 격려합니다."

**4. 출력 형식 제약**
- JSON 형식으로 구조화된 응답 요청
- 예시: `{"analysis": "...", "advice": "...", "next_steps": [...]}`

**5. 단계별 사고 과정 유도**
- "먼저 사용자의 현재 상태를 파악하고, 그 다음 개선 방안을 제시하세요"와 같은 지시

#### 학습 자료
- OpenAI Prompt Engineering Guide: https://platform.openai.com/docs/guides/prompt-engineering
- LangChain Prompt Templates: https://python.langchain.com/docs/modules/model_io/prompts/
- Anthropic Prompt Library: https://docs.anthropic.com/claude/prompt-library

---

### 2.2 Function Calling / Tool Use (핵심) ⭐⭐⭐

#### 현재 문제점
AI가 단순히 조언만 제공하고, 실제로 습관을 생성하거나 체크인을 기록하는 등의 액션을 취할 수 없습니다.

#### 개선 방향

**Function Calling 구현 예시:**
```javascript
const tools = [
  {
    type: "function",
    function: {
      name: "create_habit",
      description: "사용자가 원하는 습관을 생성합니다",
      parameters: {
        type: "object",
        properties: {
          name: { 
            type: "string", 
            description: "습관 이름 (예: '매일 30분 운동하기')" 
          },
          frequency_type: { 
            type: "string", 
            enum: ["daily", "weekly", "monthly"],
            description: "습관 수행 빈도 타입"
          },
          frequency_value: {
            type: "integer",
            description: "빈도 값 (예: daily면 1, weekly면 3)"
          },
          category: {
            type: "string",
            enum: ["exercise", "reading", "health", "learning", "work", "other"],
            description: "습관 카테고리"
          },
          description: {
            type: "string",
            description: "습관에 대한 설명 (선택사항)"
          }
        },
        required: ["name", "frequency_type", "frequency_value"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_habit_stats",
      description: "특정 습관의 통계를 조회합니다 (성공률, 연속 일수 등)",
      parameters: {
        type: "object",
        properties: {
          habit_id: {
            type: "string",
            description: "조회할 습관의 ID"
          }
        },
        required: ["habit_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "record_checkin",
      description: "습관 체크인을 기록합니다",
      parameters: {
        type: "object",
        properties: {
          habit_id: {
            type: "string",
            description: "체크인할 습관의 ID"
          },
          is_completed: {
            type: "boolean",
            description: "완료 여부"
          },
          value: {
            type: "number",
            description: "수치 입력 시 값 (예: 30분, 5km)"
          },
          date: {
            type: "string",
            format: "date",
            description: "체크인 날짜 (YYYY-MM-DD 형식)"
          }
        },
        required: ["habit_id", "is_completed"]
      }
    }
  }
];
```

**구현 단계:**
1. OpenAI API 호출 시 `tools` 파라미터 추가
2. AI 응답에서 `tool_calls` 확인
3. 각 함수를 실제로 실행
4. 결과를 다시 AI에게 전달하여 최종 응답 생성

#### 학습 자료
- OpenAI Function Calling 문서: https://platform.openai.com/docs/guides/function-calling
- LangChain Tools & Agents: https://python.langchain.com/docs/modules/tools/
- AutoGPT, BabyAGI 같은 오픈소스 프로젝트 분석

---

### 2.3 RAG (Retrieval-Augmented Generation) ⭐⭐

#### 현재 문제점
문서에 RAG가 언급되어 있지만 실제 구현은 없습니다. 현재는 모든 습관과 체크인 데이터를 JSON으로 덤프하여 컨텍스트로 전달하고 있어 토큰 낭비가 심합니다.

#### 개선 방향

**1. 벡터 임베딩 구현**
- 습관 데이터, 체크인 기록을 벡터로 변환하여 저장
- 사용자 질문과 관련성 높은 데이터만 검색

**2. 검색 최적화**
- 사용자 질문: "운동 습관이 왜 실패하는지 분석해줘"
- → 관련 습관만 검색 (운동 카테고리, 최근 실패 기록)
- → 불필요한 데이터(독서 습관 등) 제외

**3. 대화 기록 검색**
- 과거 대화 기록에서도 관련 내용만 검색
- 예시: "이전에 운동 습관에 대해 이야기했던 내용"

**구현 예시:**
```javascript
// 1. 벡터 임베딩 생성
const habitEmbedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: `습관: ${habit.name}, 설명: ${habit.description}, 카테고리: ${habit.category}`
});

// 2. 벡터 DB에 저장 (Supabase Vector Store 사용)
await supabase.from('habit_embeddings').insert({
  habit_id: habit.id,
  embedding: habitEmbedding.data[0].embedding,
  content: `${habit.name} - ${habit.description}`
});

// 3. 사용자 질문과 관련성 높은 습관 검색
const queryEmbedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: userQuestion
});

const { data } = await supabase.rpc('match_habits', {
  query_embedding: queryEmbedding.data[0].embedding,
  match_threshold: 0.7,
  match_count: 5
});
```

#### 학습 자료
- LangChain RAG 튜토리얼: https://python.langchain.com/docs/use_cases/question_answering/
- Supabase Vector Store: https://supabase.com/docs/guides/ai/vector-columns
- Pinecone, Weaviate 같은 벡터 DB 학습

---

### 2.4 Agent 패턴 (ReAct, Plan-and-Execute 등) ⭐⭐

#### 현재 문제점
단순 채팅봇 수준입니다. 목표를 달성하기 위한 계획 수립 → 실행 → 관찰 → 반복하는 Agent 루프가 없습니다.

#### 개선 방향

**ReAct 패턴 예시:**
```python
# ReAct: Reasoning + Acting
class HabitAgent:
    def __init__(self):
        self.thought = ""
        self.action = ""
        self.observation = ""
    
    def react_loop(self, user_query):
        # Thought: 사용자 요청 분석
        thought = self.llm.generate(f"사용자가 '{user_query}'라고 했습니다. 무엇을 해야 할까요?")
        
        # Action: 필요한 도구 선택
        action = self.llm.generate(f"다음 중 어떤 도구를 사용해야 할까요? {available_tools}")
        
        # Observation: 결과 관찰
        observation = self.execute_action(action)
        
        # 반복...
        if not self.is_goal_achieved():
            return self.react_loop(f"관찰 결과: {observation}. 다음 단계는?")
        
        return self.final_response()
```

**Plan-and-Execute 패턴:**
1. **Planning**: 사용자 요청을 분석하여 단계별 계획 수립
2. **Execution**: 각 단계를 순차적으로 실행
3. **Monitoring**: 각 단계의 결과를 모니터링하고 필요시 계획 수정

**구현 예시:**
```javascript
// 사용자: "운동 습관을 만들고 싶어"
// 1. Planning: AI가 계획 수립
const plan = {
  steps: [
    "사용자의 운동 목표 파악",
    "적절한 빈도 제안",
    "습관 생성",
    "첫 체크인 안내"
  ]
};

// 2. Execution: 각 단계 실행
for (const step of plan.steps) {
  const result = await executeStep(step);
  // 3. Monitoring: 결과 확인 및 필요시 계획 수정
  if (needsAdjustment(result)) {
    plan = adjustPlan(plan, result);
  }
}
```

#### 학습 자료
- LangChain Agents: https://python.langchain.com/docs/modules/agents/
- ReAct 논문: "ReAct: Synergizing Reasoning and Acting in Language Models"
- AutoGPT, LangGraph 같은 오픈소스 프로젝트 분석

---

### 2.5 컨텍스트 관리 및 메모리 ⭐⭐

#### 현재 문제점
대화 기록만 저장하고 있습니다. 장기 메모리, 중요 정보 추출 및 요약 기능이 없어 대화가 길어질수록 컨텍스트가 비효율적으로 증가합니다.

#### 개선 방향

**1. 사용자 프로필 요약 저장**
- 사용자의 습관 패턴, 선호도 등을 주기적으로 요약하여 저장
- 예시: "사용자는 주말에 습관 수행률이 낮고, 운동 카테고리를 선호함"

**2. 습관 패턴 요약**
- 체크인 데이터를 분석하여 패턴 요약
- 예시: "운동 습관은 화요일과 목요일에 성공률이 높음"

**3. 대화 기록 요약/압축**
- 오래된 대화는 요약하여 저장
- 중요 정보만 추출하여 장기 메모리에 저장

**구현 예시:**
```javascript
// 대화 기록이 50개를 넘으면 요약
if (conversations.length > 50) {
  const summary = await summarizeConversations(conversations.slice(0, -20));
  // 요약을 장기 메모리에 저장
  await saveToLongTermMemory(summary);
  // 최근 20개만 유지
  conversations = conversations.slice(-20);
}

// 사용자 프로필 업데이트
const userProfile = {
  preferredCategories: ["exercise", "health"],
  successPatterns: {
    bestDay: "화요일",
    bestTime: "오전"
  },
  challenges: ["주말 지속성", "동기 부족"]
};
```

#### 학습 자료
- LangChain Memory: https://python.langchain.com/docs/modules/memory/
- Mem0 같은 메모리 라이브러리: https://github.com/mem0ai/mem0

---

### 2.6 에러 처리 및 복원력 ⭐

#### 현재 문제점
기본적인 에러 처리만 있고, Retry, Fallback, Circuit Breaker 같은 패턴이 없습니다.

#### 개선 방향

**1. Retry with Exponential Backoff**
```javascript
async function chatWithAIRetry(message, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await chatWithAI(message);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

**2. Fallback 모델 사용**
- OpenAI API 실패 시 Gemini로 자동 전환
- 비용 최적화를 위해 기본은 Gemini, 고급 기능만 OpenAI 사용

**3. Circuit Breaker 패턴**
- 연속 실패 시 일정 시간 동안 API 호출 차단
- 서비스 장애 시 빠른 실패(fast fail)

**4. Graceful Degradation**
- AI 기능이 실패해도 기본 기능은 동작하도록
- 예시: AI 조언이 없어도 습관 체크인은 가능

#### 학습 자료
- Resilience Patterns: https://martinfowler.com/articles/patterns-of-distributed-systems/
- Polly (C#) 또는 Resilience4j (Java) 같은 라이브러리 개념 학습

---

### 2.7 평가 및 모니터링 ⭐

#### 현재 문제점
AI 응답의 품질을 평가하거나 사용자 만족도를 추적하는 시스템이 없습니다.

#### 개선 방향

**1. 응답 품질 메트릭**
- 관련성(Relevance): 사용자 질문과 응답의 관련성
- 유용성(Usefulness): 실제로 도움이 되는지
- 일관성(Consistency): 이전 대화와의 일관성

**2. 사용자 피드백 수집**
- 각 AI 응답에 👍/👎 버튼 추가
- 피드백을 데이터로 수집하여 프롬프트 개선에 활용

**3. A/B 테스트**
- 여러 버전의 프롬프트를 테스트하여 가장 효과적인 버전 찾기
- 예시: "친근한 톤" vs "전문적인 톤"

**4. Cost Tracking**
- 토큰 사용량 모니터링
- 비용 최적화를 위한 분석
- 예시: 어떤 프롬프트가 토큰을 많이 사용하는지

**구현 예시:**
```javascript
// 응답 품질 평가
const qualityMetrics = {
  relevance: calculateRelevance(userQuery, aiResponse),
  usefulness: await getUserFeedback(messageId),
  consistency: checkConsistency(aiResponse, conversationHistory)
};

// A/B 테스트
const promptVersion = user.id % 2 === 0 ? 'friendly' : 'professional';
const response = await chatWithAI(message, promptVersion);
await trackExperiment('prompt_tone', promptVersion, response);
```

#### 학습 자료
- LLM Evaluation: https://python.langchain.com/docs/guides/evaluation/
- A/B Testing for AI: 일반적인 A/B 테스트 방법론 적용

---

## 3. 학습 로드맵 제안

### 3.1 단기 목표 (1-2주)

#### 1주차: 프롬프트 엔지니어링 심화
- [ ] Few-shot learning 적용
- [ ] Chain-of-Thought 패턴 구현
- [ ] 출력 형식 구조화 (JSON 등)
- [ ] 프롬프트 버전 관리 시스템 구축

#### 2주차: Function Calling 구현
- [ ] 습관 생성 함수 구현
- [ ] 습관 수정 함수 구현
- [ ] 통계 조회 함수 구현
- [ ] 체크인 기록 함수 구현
- [ ] AI가 함수를 자동으로 호출하도록 통합

### 3.2 중기 목표 (1-2개월)

#### 3-4주차: RAG 구현
- [ ] 벡터 임베딩 생성 및 저장
- [ ] Supabase Vector Store 설정
- [ ] 관련성 기반 검색 구현
- [ ] 컨텍스트 최적화 (토큰 절약)

#### 5-6주차: Agent 패턴 적용
- [ ] ReAct 패턴 구현
- [ ] Plan-and-Execute 패턴 구현
- [ ] 멀티 스텝 작업 처리 (예: "운동 습관 만들고 오늘 체크인까지 해줘")

#### 7-8주차: 메모리 및 컨텍스트 관리
- [ ] 사용자 프로필 요약 기능
- [ ] 대화 기록 압축/요약
- [ ] 장기 메모리 시스템 구축

### 3.3 장기 목표 (3개월+)

#### 9-12주차: 고급 기능
- [ ] 멀티 에이전트 시스템 (전문 에이전트 분리)
- [ ] 자동화 워크플로우 (예: 주간 리포트 자동 생성)
- [ ] 개인화 모델 (사용자별 프롬프트 최적화)

---

## 4. 추천 학습 자료

### 4.1 책 및 공식 문서
- **"Build LLM Applications"** (LangChain 공식)
- **"Prompt Engineering for Developers"** (DeepLearning.AI)
- **OpenAI API Documentation**: https://platform.openai.com/docs
- **Anthropic Claude Documentation**: https://docs.anthropic.com/

### 4.2 온라인 강의 및 튜토리얼
- **LangChain 튜토리얼**: https://python.langchain.com/docs/get_started/
- **OpenAI Cookbook**: https://cookbook.openai.com/
- **Anthropic Prompt Engineering**: https://docs.anthropic.com/claude/prompt-engineering
- **DeepLearning.AI - ChatGPT Prompt Engineering**: 무료 강의

### 4.3 오픈소스 프로젝트
- **AutoGPT**: https://github.com/Significant-Gravitas/AutoGPT
- **BabyAGI**: https://github.com/yoheinakajima/babyagi
- **LangChain Examples**: https://github.com/langchain-ai/langchain
- **LangGraph**: https://github.com/langchain-ai/langgraph

### 4.4 커뮤니티 및 블로그
- **LangChain Discord**: 활발한 커뮤니티
- **r/LangChain**: Reddit 커뮤니티
- **AI 관련 뉴스레터**: The Batch (DeepLearning.AI)

---

## 5. 다음 단계 제안

### 우선순위 1: 프롬프트 엔지니어링 개선
현재 `createSystemPrompt` 함수를 개선하여 Few-shot learning과 Chain-of-Thought를 적용합니다.

**구현 항목:**
- [ ] Few-shot 예시 추가
- [ ] CoT 패턴 적용
- [ ] 출력 형식 구조화
- [ ] 프롬프트 버전 관리

### 우선순위 2: Function Calling 구현
AI가 실제로 습관을 생성하고 수정할 수 있도록 Function Calling을 구현합니다.

**구현 항목:**
- [ ] 습관 생성 함수 정의
- [ ] 습관 수정 함수 정의
- [ ] 통계 조회 함수 정의
- [ ] OpenAI API에 tools 파라미터 추가
- [ ] 함수 실행 로직 구현

### 우선순위 3: RAG 구현
벡터 검색을 통해 관련 컨텍스트만 선택적으로 주입하도록 개선합니다.

**구현 항목:**
- [ ] Supabase Vector Store 설정
- [ ] 습관 데이터 벡터 임베딩 생성
- [ ] 검색 쿼리 구현
- [ ] 컨텍스트 최적화

---

## 6. 체크리스트

### 프론트엔드 개발자에서 AI Agent 개발자로 전환하기 위한 체크리스트

#### 기본 역량
- [ ] 프롬프트 엔지니어링 기본기 습득
- [ ] LLM API 사용법 숙지 (OpenAI, Anthropic 등)
- [ ] Function Calling 이해 및 구현 가능

#### 중급 역량
- [ ] RAG 패턴 이해 및 구현 가능
- [ ] Agent 패턴 (ReAct, Plan-and-Execute) 이해
- [ ] 벡터 DB 사용법 숙지

#### 고급 역량
- [ ] 멀티 에이전트 시스템 설계 가능
- [ ] LLM 평가 및 최적화 경험
- [ ] 프로덕션 환경에서의 에러 처리 및 모니터링 경험

---

## 7. 참고 사항

### 7.1 비용 관리
- OpenAI API는 토큰 사용량에 따라 과금됩니다
- RAG와 컨텍스트 최적화를 통해 비용 절감 가능
- 무료 티어(Gemini 등)를 적극 활용

### 7.2 보안
- API 키는 절대 클라이언트에 노출하지 않음
- Edge Function을 통해서만 API 호출
- 사용자 데이터는 RLS 정책으로 보호

### 7.3 성능
- 응답 시간 최적화 (캐싱 활용)
- 비동기 처리로 사용자 경험 개선
- Rate Limiting으로 API 제한 관리

---

## 부록

### A. 용어 정의
- **RAG (Retrieval-Augmented Generation)**: 검색을 통해 관련 정보를 가져와 생성에 활용하는 패턴
- **Function Calling**: LLM이 함수를 호출하여 실제 액션을 수행할 수 있게 하는 기능
- **ReAct**: Reasoning + Acting 패턴으로 사고와 행동을 반복하는 Agent 패턴
- **Few-shot Learning**: 몇 가지 예시를 제공하여 원하는 패턴을 학습시키는 방법
- **Chain-of-Thought (CoT)**: 단계별 사고 과정을 유도하여 더 논리적인 응답을 생성하는 방법

### B. 변경 이력
| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0 | 2026-01-XX | 초안 작성 | - |

---

**다음 단계**: 프롬프트 엔지니어링 개선부터 시작하여 점진적으로 고급 기능을 추가합니다. 각 단계마다 테스트와 평가를 통해 품질을 확인하며 진행합니다.
