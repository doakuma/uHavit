import { useState } from 'react';
import styles from './Chat.module.css';

function Chat() {
  const [messages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: '안녕하세요! 습관 형성을 도와드리는 AI 코치입니다. 어떤 도움이 필요하신가요?',
    },
    {
      id: 2,
      type: 'user',
      content: '운동 습관을 만들고 싶어요',
    },
    {
      id: 3,
      type: 'assistant',
      content:
        '좋은 습관이네요! 운동 습관을 만들 때는 작은 목표부터 시작하는 것이 좋습니다. 예를 들어, 처음에는 주 3회 20분씩 시작해서 점진적으로 늘려가는 방식이 효과적입니다. 어떤 종류의 운동을 생각하고 계신가요?',
    },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI 채팅</h1>
        <p className={styles.subtitle}>AI 코치와 대화하며 습관을 형성해보세요</p>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.assistantMessage}`}
            >
              <div className={styles.messageContent}>{message.content}</div>
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <div className={styles.dummyNotice}>
            🧪 더미 모드: AI 채팅 기능은 Supabase Edge Functions와 OpenAI API 연동 후 사용 가능합니다.
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
              className={styles.input}
              disabled
            />
            <button className={styles.sendButton} disabled>
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
