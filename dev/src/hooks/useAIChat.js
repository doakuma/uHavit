import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  chatWithAI, 
  getConversations, 
  getSessions, 
  createSession, 
  deleteSession 
} from '@services/supabase/ai';

/**
 * AI 채팅 Hook
 * @param {string} sessionId - 현재 세션 ID (선택사항)
 * @returns {Object} { messages, sendMessage, isLoading, error, sessions, currentSessionId, switchSession, createNewSession, deleteCurrentSession }
 */
export function useAIChat(sessionId = null) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);

  // 세션 목록 조회
  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery({
    queryKey: ['ai-chat-sessions'],
    queryFn: () => getSessions(),
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 대화 기록 조회 (세션별)
  const { data: conversations = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['ai-conversations', currentSessionId],
    queryFn: () => getConversations(currentSessionId, 100),
    enabled: !!currentSessionId || currentSessionId === null, // 세션이 없어도 조회 가능 (기존 호환)
    staleTime: 1000 * 60 * 5, // 5분
  });

  // conversations 데이터가 변경될 때마다 메시지 업데이트
  useEffect(() => {
    if (!conversations || conversations.length === 0) {
      // 대화 기록이 없으면 임시 메시지만 유지
      setMessages((prev) => prev.filter((m) => m.id && m.id.startsWith('temp-')));
      return;
    }

    // 대화 기록을 메시지 형식으로 변환
    const formattedMessages = conversations.map((conv) => ({
      id: conv.id,
      type: conv.message_type,
      content: conv.content,
      createdAt: conv.created_at,
    }));

    // 현재 세션의 메시지 ID 추출
    const currentSessionMessageIds = formattedMessages.map((m) => m.id);

    setMessages((prev) => {
      // 임시 메시지들 추출 (전송 중인 메시지)
      const tempMessages = prev.filter((m) => m.id && m.id.startsWith('temp-'));

      // 세션이 변경되었는지 확인 (이전 메시지 중 현재 세션에 속하지 않는 메시지가 있으면 세션 변경)
      const hasOldMessages = prev.some(
        (m) => !m.id.startsWith('temp-') && !currentSessionMessageIds.includes(m.id)
      );

      if (hasOldMessages) {
        // 세션이 변경되었으므로 현재 세션 메시지만 표시 (임시 메시지 포함)
        return [...formattedMessages, ...tempMessages].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA - dateB;
        });
      }

      // 같은 세션이면 기존 메시지와 병합 (임시 메시지와 새로 추가된 메시지 유지)
      const newMessages = prev.filter(
        (m) => !m.id.startsWith('temp-') && !formattedMessages.find((fm) => fm.id === m.id)
      );

      // DB 메시지 + 새로 추가된 메시지 + 임시 메시지 병합
      const merged = [...formattedMessages, ...newMessages, ...tempMessages];

      // createdAt 기준으로 정렬
      return merged.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateA - dateB;
      });
    });
  }, [conversations]);

  // AI 메시지 전송 Mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, conversationHistory, sessionId }) => {
      return await chatWithAI(message, conversationHistory, sessionId);
    },
    onMutate: async ({ message }) => {
      // 낙관적 업데이트: 사용자 메시지 즉시 추가
      const userMessage = {
        id: `temp-${Date.now()}`,
        type: 'user',
        content: message,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      return { userMessage };
    },
    onSuccess: (data, variables, context) => {
      // AI 응답 추가
      const assistantMessage = {
        id: data.assistantMessageId,
        type: 'assistant',
        content: data.response,
        createdAt: new Date().toISOString(),
      };

      // 임시 사용자 메시지를 실제 ID로 교체하고 AI 응답 추가
      setMessages((prev) => {
        const updated = [...prev];
        const tempIndex = updated.findIndex((m) => m.id === context.userMessage.id);
        if (tempIndex !== -1) {
          updated[tempIndex] = {
            ...updated[tempIndex],
            id: data.userMessageId,
          };
        }
        return [...updated, assistantMessage];
      });

      // 쿼리 데이터를 직접 업데이트하여 DB와 동기화 (재요청 없이)
      // setQueryData는 onSuccess를 트리거하지 않으므로, 메시지 상태는 이미 업데이트됨
      queryClient.setQueryData(['ai-conversations', currentSessionId], (oldData = []) => {
        // 이미 추가된 메시지인지 확인
        const userExists = oldData.some((msg) => msg.id === data.userMessageId);
        const assistantExists = oldData.some((msg) => msg.id === data.assistantMessageId);
        
        if (userExists && assistantExists) {
          return oldData; // 이미 있으면 업데이트하지 않음
        }
        
        const newMessages = [];
        if (!userExists) {
          newMessages.push({
            id: data.userMessageId,
            user_id: oldData[0]?.user_id || null, // 기존 데이터에서 user_id 가져오기
            message_type: 'user',
            content: variables.message,
            created_at: new Date().toISOString(),
          });
        }
        if (!assistantExists) {
          newMessages.push({
            id: data.assistantMessageId,
            user_id: oldData[0]?.user_id || null, // 기존 데이터에서 user_id 가져오기
            message_type: 'assistant',
            content: data.response,
            created_at: new Date().toISOString(),
          });
        }
        
        // created_at 기준으로 정렬하여 반환
        return [...oldData, ...newMessages].sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateA - dateB;
        });
      });
      
      // 쿼리 데이터 업데이트 후, 메시지 상태도 동기화하기 위해 수동으로 onSuccess 로직 실행
      // 하지만 이미 setMessages로 업데이트했으므로 불필요할 수 있음
      // 대신 다음에 getConversations가 실행될 때 자동으로 동기화됨
    },
    onError: (error, variables, context) => {
      // 에러 발생 시 임시 메시지 제거
      setMessages((prev) => prev.filter((m) => m.id !== context.userMessage.id));
      console.error('AI 채팅 오류:', error);
    },
  });

  /**
   * 메시지 전송
   * @param {string} message - 전송할 메시지
   */
  const sendMessage = useCallback(
    async (message) => {
      if (!message.trim()) return;

      // 현재 대화 기록을 메시지 형식으로 변환
      const conversationHistory = messages
        .filter((m) => m.id && !m.id.startsWith('temp-'))
        .map((m) => ({
          message_type: m.type,
          content: m.content,
        }));

      await sendMessageMutation.mutateAsync({
        message: message.trim(),
        conversationHistory,
        sessionId: currentSessionId,
      });
    },
    [messages, sendMessageMutation, currentSessionId]
  );

  // 세션 전환
  const switchSession = useCallback((newSessionId) => {
    setCurrentSessionId(newSessionId);
    // 메시지는 conversations 데이터가 변경되면 useEffect에서 자동으로 업데이트됨
  }, []);

  // 새 세션 생성
  const createNewSession = useMutation({
    mutationFn: async (title) => {
      const newSession = await createSession(title);
      // 세션 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['ai-chat-sessions'] });
      return newSession;
    },
    onSuccess: (newSession) => {
      setCurrentSessionId(newSession.id);
      setMessages([]);
    },
  });

  // 현재 세션 삭제
  const deleteCurrentSession = useMutation({
    mutationFn: async (sessionIdToDelete) => {
      const targetSessionId = sessionIdToDelete || currentSessionId;
      if (!targetSessionId) return;
      await deleteSession(targetSessionId);
      // 세션 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['ai-chat-sessions'] });
      // 대화 기록 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
      return targetSessionId;
    },
    onSuccess: (deletedSessionId) => {
      // 삭제된 세션이 현재 세션이면 다른 세션으로 전환
      if (deletedSessionId === currentSessionId) {
        // 세션 목록을 다시 가져와서 최신 세션으로 전환
        queryClient.invalidateQueries({ queryKey: ['ai-chat-sessions'] });
        setCurrentSessionId(null);
        setMessages([]);
      }
    },
  });

  // 세션이 변경되면 쿼리 무효화하여 새로 로드
  useEffect(() => {
    if (currentSessionId !== null) {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations', currentSessionId] });
    }
  }, [currentSessionId, queryClient]);

  // 첫 세션 자동 선택 (세션이 없고 세션 목록이 있을 때)
  useEffect(() => {
    if (!currentSessionId && sessions.length > 0 && !isLoadingSessions) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [sessions, currentSessionId, isLoadingSessions]);

  return {
    messages,
    sendMessage,
    isLoading: sendMessageMutation.isPending || isLoadingHistory || isLoadingSessions,
    error: sendMessageMutation.error,
    sessions,
    currentSessionId,
    switchSession,
    createNewSession: createNewSession.mutateAsync,
    deleteCurrentSession: deleteCurrentSession.mutateAsync,
    isCreatingSession: createNewSession.isPending,
    isDeletingSession: deleteCurrentSession.isPending,
  };
}
