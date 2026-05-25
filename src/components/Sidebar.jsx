import { Fragment } from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import SmartToyIcon from '@mui/icons-material/SmartToy';

import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const DRAWER_WIDTH = 280;

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const { conversations, activeConversationId, setActiveConversationId, createConversation, deleteConversation } = useChat();

  const handleNewChat = () => {
    createConversation();
    toast.success('New conversation started');
    onClose?.();
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'Delete Conversation?',
      text: `"${title}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: '#111120',
      color: '#e8e8f0',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteConversation(id);
        toast.success('Conversation deleted');
      }
    });
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: 'You will need to sign in again to continue.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sign Out',
      cancelButtonText: 'Stay',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: '#111120',
      color: '#e8e8f0',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        toast.success('Signed out successfully');
      }
    });
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0d0d1a 0%, #111120 100%)',
      }}
    >
      {/* Brand Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(245,158,11,0.3)',
          }}
        >
          <SmartToyIcon sx={{ color: '#000', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
            ABDAI
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            Intelligent Chat Assistant
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* New Chat Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleNewChat}
          sx={{
            borderRadius: 2,
            border: '1px dashed rgba(245,158,11,0.3)',
            justifyContent: 'center',
            gap: 1,
            py: 1.2,
            '&:hover': {
              background: 'rgba(245,158,11,0.08)',
              borderColor: 'rgba(245,158,11,0.5)',
            },
          }}
        >
          <AddIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography sx={{ fontWeight: 600, color: 'primary.main', fontSize: '0.9rem' }}>
            New Chat
          </Typography>
        </ListItemButton>
      </Box>

      {/* Conversation List */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: 2 } }}>
        <Typography variant="caption" sx={{ px: 1, py: 1, color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Conversations
        </Typography>
        <List dense>
          {conversations.length === 0 && (
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', py: 4, fontSize: '0.85rem' }}>
              No conversations yet.
              <br />
              Start a new chat!
            </Typography>
          )}
          {conversations.map((conv) => (
            <ListItem
              key={conv.id}
              disablePadding
              secondaryAction={
                <Tooltip title="Delete" arrow>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(conv.id, conv.title);
                    }}
                    sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444' }, opacity: 0, transition: 'opacity 0.2s', '.MuiListItem-root:hover &': { opacity: 1 } }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              }
              sx={{
                borderRadius: 2,
                mb: 0.5,
                background: activeConversationId === conv.id ? 'rgba(245,158,11,0.1)' : 'transparent',
                border: activeConversationId === conv.id ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                '&:hover': { background: activeConversationId === conv.id ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)' },
                transition: 'all 0.2s',
              }}
            >
              <ListItemButton
                onClick={() => {
                  setActiveConversationId(conv.id);
                  onClose?.();
                }}
                sx={{ borderRadius: 2, py: 1.2 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ChatIcon
                    sx={{
                      fontSize: 18,
                      color: activeConversationId === conv.id ? 'primary.main' : 'text.secondary',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={conv.title}
                  primaryTypographyProps={{
                    fontSize: '0.85rem',
                    fontWeight: activeConversationId === conv.id ? 600 : 400,
                    noWrap: true,
                    color: activeConversationId === conv.id ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* User Profile Section */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.dark',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            {user?.avatar || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }} noWrap>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {user?.email || ''}
            </Typography>
          </Box>
          <Tooltip title="Sign Out" arrow>
            <IconButton size="small" onClick={handleLogout} sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444' } }}>
              <LogoutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  // REMOVED the outer <Box component="nav"> wrapper.
  // Using Fragment instead so the Drawers sit directly in the Chat.jsx flex container.
  return (
    <Fragment>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: DRAWER_WIDTH, 
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: DRAWER_WIDTH, 
            border: 'none',
            boxSizing: 'border-box',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Fragment>
  );
}
