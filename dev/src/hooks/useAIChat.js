import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatWithAI, getConversations } from '@services/supabase/ai';

/**
 * AI 채팅 Hook
 * @returns {Object} { messages, sendMessage, isLoading, error }
 */
export function useAIChat() {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([]);

  // 대화 기록 조회
  const { data: conversations = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['ai-conversations'],
    queryFn: () => getConversations(100),
    staleTime: 1000 * 60 * 5, // 5분
    onSuccess: (data) => {
      // 대화 기록을 메시지 형식으로 변환
      const formattedMessages = data.map((conv) => ({
        id: conv.id,
        type: conv.message_type,
        content: conv.content,
        createdAt: conv.created_at,
      }));
      setMessages(formattedMessages);
    },
  });

  // AI 메시지 전송 Mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, conversationHistory }) => {
      return await chatWithAI(message, conversationHistory);
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

      // 임시 사용자 메시지를 실제 ID로 교체
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

      // 대화 기록 쿼리 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
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
      });
    },
    [messages, sendMessageMutation]
  );

  return {
    messages,
    sendMessage,
    isLoading: sendMessageMutation.isPending || isLoadingHistory,
    error: sendMessageMutation.error,
  };
}
