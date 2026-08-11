import { useState, useEffect } from 'react';
import { Box, Paper, IconButton, Fab, Typography, Drawer, OutlinedInput, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CallEndIcon from '@mui/icons-material/CallEnd';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

export default function ConsultRoom() {
  const navigate = useNavigate();
  const isPro = useStore((s) => s.isPro);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [lockDialog, setLockDialog] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const onChatClick = () => (isPro ? setChatOpen(true) : setLockDialog(true));

  return (
    <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#0F172A', display: 'flex' }}>
      <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ position: 'absolute', top: 20, left: 24, color: '#fff', fontWeight: 700, fontSize: 20 }}>{mm}:{ss}</Typography>

        {/* Main video */}
        <Box sx={{ width: '78%', height: '74%', borderRadius: '8px', bgcolor: '#1E293B',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ width: 88, height: 88, borderRadius: '50%', bgcolor: '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 30 }}>AR</Box>
          <Typography sx={{ color: '#fff', fontWeight: 600 }}>Dr. Arvind Rao</Typography>
          <Typography sx={{ color: '#64748B', fontSize: 13 }}>Neurology · connected</Typography>
        </Box>

        {/* Self PiP */}
        <Box sx={{ position: 'absolute', bottom: 100, right: 40, width: 140, height: 100, borderRadius: '8px',
          bgcolor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #475569' }}>
          <Typography sx={{ color: '#94A3B8', fontSize: 12 }}>{cam ? 'You' : 'Camera off'}</Typography>
        </Box>

        {/* Controls */}
        <Paper sx={{ position: 'absolute', bottom: 24, bgcolor: '#1E293B', borderRadius: '100px',
          px: 2.5, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => setMic((m) => !m)} sx={{ color: '#fff' }}>{mic ? <MicNoneIcon /> : <MicOffIcon sx={{ color: '#EF4444' }} />}</IconButton>
          <IconButton onClick={() => setCam((c) => !c)} sx={{ color: '#fff' }}>{cam ? <VideocamIcon /> : <VideocamOffIcon sx={{ color: '#EF4444' }} />}</IconButton>
          <IconButton sx={{ color: '#fff' }}><HeadsetMicOutlinedIcon /></IconButton>
          <IconButton onClick={onChatClick} sx={{ color: '#fff' }}><ChatBubbleOutlineIcon /></IconButton>
          <IconButton sx={{ color: '#fff' }}><FullscreenIcon /></IconButton>
          <Fab color="error" size="medium" sx={{ ml: 1, boxShadow: 'none' }} onClick={() => navigate(-1)}><CallEndIcon /></Fab>
        </Paper>
      </Box>

      {/* Chat drawer (Pro) */}
      <Drawer anchor="right" variant="persistent" open={chatOpen}
        sx={{ '& .MuiDrawer-paper': { width: 320, bgcolor: '#fff', position: 'relative' } }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
          <Typography sx={{ fontWeight: 700 }}>Chat with Dr. Arvind Rao</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
          <Box sx={{ bgcolor: '#EFF6FF', color: '#2563EB', p: 1.25, borderRadius: '12px', mb: 1, maxWidth: '85%' }}>
            <Typography sx={{ fontSize: 13 }}>Hello Meera, can you describe the symptoms?</Typography>
          </Box>
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid #E5E7EB' }}>
          <OutlinedInput fullWidth placeholder="Type a message..."
            endAdornment={<InputAdornment position="end"><IconButton size="small" sx={{ bgcolor: 'primary.main', color: '#fff' }}><SendIcon fontSize="small" /></IconButton></InputAdornment>} />
        </Box>
      </Drawer>

      {/* Free-tier lock dialog */}
      <Dialog open={lockDialog} onClose={() => setLockDialog(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Chat is a Pro feature</DialogTitle>
        <DialogContent><Typography variant="body2" sx={{ color: '#6B7280' }}>Chat with your doctor is a Pro feature. Upgrade to access direct messaging.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLockDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { setLockDialog(false); navigate('/profile'); }}>Upgrade to Pro</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
