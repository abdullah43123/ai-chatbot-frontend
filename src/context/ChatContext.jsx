import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const createConversation = useCallback(() => {
    const id = Date.now().toString();
    const conv = {
      id,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConversationId(id);
    return id;
  }, []);

  const deleteConversation = useCallback((id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveConversationId((prev) => (prev === id ? null : prev));
  }, []);

  const addMessage = useCallback((conversationId, message) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;

        // Replace entire content of existing message (e.g. API response replacing placeholder)
        if (message.replace) {
          const updatedMessages = conv.messages.map((m) =>
            m.id === message.id
              ? { ...m, content: message.content, timestamp: message.timestamp }
              : m
          );
          return { ...conv, messages: updatedMessages };
        }

        // Append chunk to existing message (for streaming)
        if (message.append) {
          const updatedMessages = conv.messages.map((m) =>
            m.id === message.id ? { ...m, content: m.content + message.content } : m
          );
          return { ...conv, messages: updatedMessages };
        }

        // Add new message
        const updatedMessages = [...conv.messages, message];

        const title =
          conv.messages.length === 0 && message.role === 'user'
            ? message.content.slice(0, 35) +
              (message.content.length > 35 ? '...' : '')
            : conv.title;

        return { ...conv, messages: updatedMessages, title };
      })
    );
  }, []);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        setActiveConversationId,
        createConversation,
        deleteConversation,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};