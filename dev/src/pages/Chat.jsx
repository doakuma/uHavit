import { useState, useRef, useEffect } from 'react';
import { useAIChat } from '@hooks/useAIChat';
import styles from './Chat.module.css';

function Chat() {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, sendMessage, isLoading, error } = useAIChat();

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
        <h1 className={styles.title}>AI 채팅</h1>
        <p className={styles.subtitle}>AI 코치와 대화하며 습관을 형성해보세요</p>
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
  );
}

export default Chat;
