import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MessageBubble from './MessageBubble';
import { useChat } from '../context/ChatContext';
import toast from 'react-hot-toast';

const API_URL =  import.meta.env.VITE_API_URL;

export default function ChatWindow({ onToggleSidebar }) {
  const {
    activeConversation,
    activeConversationId,
    createConversation,
    addMessage,
  } = useChat();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages?.length, activeConversation?.messages?.[activeConversation.messages.length - 1]?.content]);

  // Focus input when conversation changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeConversationId]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation();
    }

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addMessage(convId, userMsg);
    setInput('');
    setIsLoading(true);

    // Add empty AI placeholder message
    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };
    addMessage(convId, aiMsg);
    setStreamingId(aiMsgId);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();

      const aiContent = data.reply || JSON.stringify(data);

      addMessage(convId, {
        id: aiMsgId,
        role: 'assistant',
        content: aiContent,
        timestamp: new Date().toISOString(),
        append: false,
        replace: true,
      });
    } catch (err) {
      console.error('API Error:', err);

      // Put error content in the placeholder
      addMessage(convId, {
        id: aiMsgId,
        role: 'assistant',
        content: 'Sorry, I could not reach the server.g',
        timestamp: new Date().toISOString(),
        append: false,
        replace: true,
      });

      toast.error('Failed to get response from server');
    } finally {
      setIsLoading(false);
      setStreamingId(null);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const messages = activeConversation?.messages || [];

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#08080f',
        minWidth: 0,
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(8,8,15,0.9)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={onToggleSidebar}
          sx={{ display: { md: 'none' }, mr: 1, color: 'text.secondary' }}
        >
          <MenuIcon />
        </IconButton>
        <AutoAwesomeIcon sx={{ fontSize: 18, color: 'primary.main', mr: 1 }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {activeConversation?.title || 'ABDAI'}
        </Typography>
        {isLoading && (
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.5 },
                '50%': { opacity: 1 },
              },
            }}
          >
            Thinking...
          </Typography>
        )}
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: { xs: 2, sm: 4, md: 6 },
          py: 3,
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 2,
          },
        }}
      >
        {/* Empty State */}
        {messages.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '70%',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 4,
                background:
                  'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
                border: '1px solid rgba(245,158,11,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <SmartToyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              How can I help you?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', maxWidth: 420, mb: 4 }}
            >
              Start a conversation with ABDAI. Ask me anything — coding,
              design, architecture, debugging, or just chat.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: 'center',
                maxWidth: 500,
              }}
            >
              {[
                'Explain async/await in JS',
                'Build a REST API',
                'CSS Grid vs Flexbox',
                'Debug my React code',
              ].map((suggestion) => (
                <Box
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'rgba(245,158,11,0.3)',
                      background: 'rgba(245,158,11,0.05)',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: '0.82rem', color: 'text.secondary' }}
                  >
                    {suggestion}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Render Messages */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={streamingId === msg.id && isLoading}
          />
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          py: 2,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(8,8,15,0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1.5,
            maxWidth: 860,
            mx: 'auto',
          }}
        >
          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'rgba(245,158,11,0.3)',
                },
                '&.Mui-focused': {
                  borderColor: 'rgba(245,158,11,0.5)',
                  boxShadow: '0 0 20px rgba(245,158,11,0.08)',
                },
              },
            }}
          />
          <Tooltip title="Send message" arrow>
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: input.trim()
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'rgba(255,255,255,0.04)',
                color: input.trim() ? '#000' : 'text.secondary',
                boxShadow: input.trim()
                  ? '0 4px 15px rgba(245,158,11,0.3)'
                  : 'none',
                transition: 'all 0.3s',
                '&:hover': {
                  background: input.trim()
                    ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                    : 'rgba(255,255,255,0.06)',
                  transform: input.trim() ? 'scale(1.05)' : 'none',
                },
                '&:disabled': {
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.15)',
                },
              }}
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1,
            color: 'text.secondary',
            opacity: 0.5,
            fontSize: '0.68rem',
          }}
        >
          ABDAI can make mistakes. Verify important information.
        </Typography>
      </Box>
    </Box>
  );
}
