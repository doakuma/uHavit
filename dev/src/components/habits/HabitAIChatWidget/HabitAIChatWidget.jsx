import { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '@services/supabase/ai';
import { Button } from '@components/common/Button';
import styles from './HabitAIChatWidget.module.css';

/**
 * 습관별 AI 채팅 위젯
 * @param {Object} props
 * @param {Object} props.habit - 습관 데이터
 * @param {Object} props.stats - 습관 통계 데이터
 * @param {Array} props.checkins - 체크인 배열
 */
export function HabitAIChatWidget({ habit, stats, checkins }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 위젯이 열릴 때 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // 습관 컨텍스트를 포함한 프롬프트 생성
  const createContextPrompt = (userMessage) => {
    const contextInfo = `
다음 습관에 대해 질문하고 있어요:

습관 정보:
- 이름: ${habit.name}
${habit.description ? `- 설명: ${habit.description}` : ''}
- 카테고리: ${habit.category || '없음'}
- 빈도: ${habit.frequency_type} ${habit.frequency_value}회
${habit.target_value ? `- 목표: ${habit.target_value} ${habit.target_unit || ''}` : ''}

통계:
${stats ? `- 성공률: ${stats.successRate}%
- 연속 일수: ${stats.streak}일
- 최고 연속 일수: ${stats.maxStreak}일
- 주간 성공률: ${stats.weeklySuccessRate}%` : '통계 데이터 없음'}

이 습관에 대한 질문이나 조언을 요청하고 있어요. 위 정보를 참고해서 답변해주세요.
`;

    return `${contextInfo}\n\n사용자: ${userMessage}`;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setError('');

    // 사용자 메시지 추가
    const userMsg = {
      id: `temp-user-${Date.now()}`,
      type: 'user',
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setIsLoading(true);

    try {
      // 컨텍스트를 포함한 메시지 생성
      const contextMessage = createContextPrompt(userMessage);
      
      // 대화 기록 생성 (최근 10개만)
      const conversationHistory = messages
        .slice(-10)
        .map((msg) => ({
          message_type: msg.type,
          content: msg.content,
        }));

      const result = await chatWithAI(contextMessage, conversationHistory, null);

      // AI 응답 추가
      const assistantMsg = {
        id: `temp-assistant-${Date.now()}`,
        type: 'assistant',
        content: result.response,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => {
        // 임시 사용자 메시지를 실제 ID로 교체
        const updated = prev.map((msg) =>
          msg.id === userMsg.id ? { ...msg, id: result.userMessageId } : msg
        );
        return [...updated, { ...assistantMsg, id: result.assistantMessageId }];
      });
    } catch (err) {
      setError(err.message || '메시지 전송 중 오류가 발생했습니다.');
      // 에러 발생 시 사용자 메시지 제거
      setMessages((prev) => prev.filter((msg) => msg.id !== userMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (question) => {
    setInputMessage(question);
    // 약간의 지연 후 전송 (UI 업데이트를 위해)
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSend(fakeEvent);
    }, 100);
  };

  const quickQuestions = [
    { label: '이 습관 개선 방법 알려줘', question: '이 습관을 더 잘 지킬 수 있는 방법을 알려줘' },
    { label: '실패 원인 분석해줘', question: '이 습관을 실패하는 원인을 분석해줘' },
    { label: '목표 조정 제안해줘', question: '이 습관의 목표를 조정해야 할까? 제안해줘' },
  ];

  return (
    <div className={styles.widget}>
      {!isOpen ? (
        <Button
          variant="primary"
          onClick={() => setIsOpen(true)}
          className={styles.openButton}
        >
          💬 이 습관에 대해 물어보기
        </Button>
      ) : (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h3 className={styles.chatTitle}>AI 코치와 대화하기</h3>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="닫기"
            >
              ×
            </button>
          </div>

          <div className={styles.messages}>
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <p>안녕하세요! "{habit.name}" 습관에 대해 무엇이든 물어보세요.</p>
                <div className={styles.quickQuestions}>
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      className={styles.quickQuestionButton}
                      onClick={() => handleQuickQuestion(q.question)}
                      disabled={isLoading}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${styles[msg.type]}`}
              >
                <div className={styles.messageContent}>{msg.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageContent}>
                  <span className={styles.typing}>AI가 입력 중...</span>
                </div>
              </div>
            )}

            {error && (
              <div className={styles.error}>
                <p>{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className={styles.inputForm}>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className={styles.input}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !inputMessage.trim()} size="sm">
              전송
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
