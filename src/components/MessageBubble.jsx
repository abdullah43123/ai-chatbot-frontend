import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function MessageBubble({ message, isStreaming = false }) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const messageRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      ref={messageRef}
      sx={{
        display: 'flex',
        gap: 1.5,
        flexDirection: isUser ? 'row-reverse' : 'row',
        mb: 3,
        animation: 'fadeInUp 0.4s ease-out',
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: 34,
          height: 34,
          fontSize: '0.8rem',
          fontWeight: 700,
          flexShrink: 0,
          mt: 0.5,
          ...(isUser
            ? { bgcolor: '#6366f1', color: '#fff' }
            : { bgcolor: 'rgba(245,158,11,0.15)', color: 'primary.main' }),
        }}
      >
        {isUser ? user?.avatar || 'U' : <SmartToyIcon sx={{ fontSize: 18 }} />}
      </Avatar>

      {/* Message Content */}
      <Box
        sx={{
          maxWidth: { xs: '85%', sm: '75%', md: '65%' },
          position: 'relative',
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            position: 'relative',
            ...(isUser
              ? {
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  borderTopRightRadius: 6,
                  boxShadow: '0 4px 15px rgba(99,102,241,0.2)',
                }
              : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderTopLeftRadius: 6,
                  color: 'text.primary',
                }),
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '0.92rem',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              '& strong': { fontWeight: 700, color: isUser ? '#fbbf24' : 'primary.main' },
              '& code': {
                background: isUser ? 'rgba(0,0,0,0.2)' : 'rgba(245,158,11,0.1)',
                px: 0.8,
                py: 0.2,
                borderRadius: 1,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.85em',
              },
            }}
          >
            {message.content}
            {isStreaming && (
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 2,
                  height: 16,
                  bgcolor: isUser ? '#fff' : 'primary.main',
                  ml: 0.5,
                  animation: 'blink 1s step-end infinite',
                  '@keyframes blink': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0 },
                  },
                  verticalAlign: 'middle',
                }}
              />
            )}
          </Typography>
        </Box>

        {/* Meta row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5,
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            px: 0.5,
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
          {!isUser && !isStreaming && (
            <Tooltip title="Copy" arrow>
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, p: 0.3 }}
              >
                {copied ? <CheckIcon sx={{ fontSize: 13, color: '#10b981' }} /> : <ContentCopyIcon sx={{ fontSize: 13 }} />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
}