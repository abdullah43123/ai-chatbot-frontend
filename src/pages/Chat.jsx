import { useState } from 'react';
import Box from '@mui/material/Box';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

export default function Chat() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <ChatWindow onToggleSidebar={() => setMobileOpen(!mobileOpen)} />
    </Box>
  );
}