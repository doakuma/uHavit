import { useState, useRef, useEffect } from 'react';
import { useAIChat } from '@hooks/useAIChat';
import styles from './Chat.module.css';

function Chat() {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const {
    messages,
    sendMessage,
    isLoading,
    error,
    sessions,
    currentSessionId,
    switchSession,
    createNewSession,
    deleteCurrentSession,
    isCreatingSession,
    isDeletingSession,
  } = useAIChat();

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage;
    setInputMessage('');
    await sendMessage(message);
  };

  // 빠른 선택지 버튼 클릭 핸들러
  const handleQuickAction = async (message) => {
    if (isLoading) return;
    await sendMessage(message);
  };

  // 새 세션 생성 핸들러
  const handleNewSession = async () => {
    try {
      await createNewSession();
    } catch (error) {
      console.error('세션 생성 오류:', error);
    }
  };

  // 세션 삭제 핸들러
  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    if (window.confirm('이 대화를 삭제하시겠습니까?')) {
      try {
        await deleteCurrentSession(sessionId);
      } catch (error) {
        console.error('세션 삭제 오류:', error);
      }
    }
  };

  // 빠른 선택지 질문 목록
  const quickActions = [
    { id: 'motivation', label: '오늘의 동기부여 메시지 줘', message: '오늘의 동기부여 메시지를 보여줘' },
    { id: 'weekly-analysis', label: '이번 주 진행 상황 분석해줘', message: '이번 주 진행 상황을 분석해줘' },
    { id: 'failure-analysis', label: '습관 실패 원인 분석해줘', message: '습관 실패 원인을 분석해줘' },
    { id: 'habit-suggestion', label: '새 습관 추천해줘', message: '나에게 맞는 새 습관을 추천해줘' },
  ];

  // 초기 환영 메시지 (대화 기록이 없을 때만)
  const displayMessages =
    messages.length === 0
      ? [
          {
            id: 'welcome',
            type: 'assistant',
            content: '안녕하세요! 습관 형성을 도와드리는 AI 코치입니다. 어떤 도움이 필요하신가요?',
            createdAt: new Date().toISOString(),
          },
        ]
      : messages;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>AI 채팅</h1>
            <p className={styles.subtitle}>AI 코치와 대화하며 습관을 형성해보세요</p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.newSessionButton}
              onClick={handleNewSession}
              disabled={isCreatingSession}
            >
              {isCreatingSession ? '생성 중...' : '+ 새 대화'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.chatWrapper}>
        {/* 세션 목록 사이드바 - 항상 표시 */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>대화 목록</h2>
          </div>
            <div className={styles.sidebarContent}>
              {sessions.length === 0 ? (
                <div className={styles.emptySessions}>아직 대화가 없습니다.</div>
              ) : (
                <div className={styles.sessionList}>
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`${styles.sessionItem} ${
                        currentSessionId === session.id ? styles.active : ''
                      }`}
                      onClick={() => {
                        switchSession(session.id);
                      }}
                    >
                      <div className={styles.sessionTitle}>{session.title || '새 대화'}</div>
                      <div className={styles.sessionMeta}>
                        {new Date(session.updated_at || session.created_at).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      {currentSessionId === session.id && (
                        <button
                          className={styles.deleteSessionButton}
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          disabled={isDeletingSession}
                          aria-label="삭제"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {displayMessages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.assistantMessage}`}
            >
              <div className={styles.messageContent}>{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.assistantMessage}`}>
              <div className={styles.messageContent}>
                <span className={styles.typingIndicator}>AI가 입력 중...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 빠른 선택지 버튼 (메시지가 없거나 적을 때만 표시) */}
        {messages.length === 0 && !isLoading && (
          <div className={styles.quickActions}>
            <div className={styles.quickActionsTitle}>💡 빠른 질문</div>
            <div className={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className={styles.quickActionButton}
                  onClick={() => handleQuickAction(action.message)}
                  disabled={isLoading}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className={styles.errorNotice}>
            <div className={styles.errorTitle}>⚠️ 오류가 발생했습니다</div>
            <div className={styles.errorMessage}>
              {error.message?.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              )) || '알 수 없는 오류가 발생했습니다.'}
            </div>
            {error.message?.includes('할당량') && (
              <div className={styles.errorHelp}>
                💡 도움말: OpenAI 계정에 결제 정보를 추가하거나 할당량을 확인해주세요.
              </div>
            )}
          </div>
        )}

        <div className={styles.inputArea}>
          <form onSubmit={handleSubmit} className={styles.inputContainer}>
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
              className={styles.input}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? '전송 중...' : '전송'}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Chat;
