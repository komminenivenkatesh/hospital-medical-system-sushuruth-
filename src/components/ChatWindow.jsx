import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Avatar, IconButton, OutlinedInput, InputAdornment, Alert, Chip } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { tokens } from '../theme/theme';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatWindow({ conversation }) {
  const sendMessage = useStore((s) => s.sendMessage);
  const disclaimerDismissed = useStore((s) => s.chatDisclaimerDismissed);
  const dismissDisclaimer = useStore((s) => s.dismissChatDisclaimer);
  const [draft, setDraft] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length, conversation?.id]);

  if (!conversation) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: tokens.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: tokens.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: '#fff', fontSize: 20 }}>+</Typography>
          </Box>
        </Box>
        <Typography sx={{ color: tokens.textSecondary, fontWeight: 600 }}>Select a conversation</Typography>
        <Typography sx={{ color: tokens.textTertiary, fontSize: 13 }}>Choose a doctor to start messaging</Typography>
      </Box>
    );
  }

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    sendMessage(conversation.id, text);
    setDraft('');
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, bgcolor: '#fff' }}>
      {/* Header — iOS style */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 2.5, py: 1.25, borderBottom: `1px solid ${tokens.border}`, bgcolor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar sx={{ width: 42, height: 42, bgcolor: tokens.primary, fontWeight: 800, fontSize: 15 }}>
              {conversation.initials}
            </Avatar>
            {conversation.online && (
              <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%',
                bgcolor: '#4ADE80', border: '2px solid #fff' }} />
            )}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: tokens.textPrimary }}>{conversation.doctorName}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{ fontSize: 12, color: conversation.online ? tokens.success : tokens.textTertiary, fontWeight: 600 }}>
                {conversation.online ? 'Active now' : 'Last seen 2h ago'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[PhoneOutlinedIcon, VideocamOutlinedIcon, InfoOutlinedIcon].map((Icon, i) => (
            <IconButton key={i} size="small" sx={{ width: 36, height: 36, color: tokens.primary }}>
              <Icon sx={{ fontSize: 20 }} />
            </IconButton>
          ))}
        </Box>
      </Box>

      {/* Messages — iOS bubble style */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2,
        bgcolor: tokens.canvas,
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(47,107,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(47,107,255,0.03) 0%, transparent 50%)' }}>
        {!disclaimerDismissed && (
          <Alert severity="info" onClose={dismissDisclaimer}
            sx={{ mb: 2, borderRadius: 3, bgcolor: tokens.primarySoft, color: tokens.primary, border: `1px solid ${tokens.primary}22`,
              '& .MuiAlert-icon': { color: tokens.primary } }}>
            This chat is for non-urgent medical follow-ups only. For emergencies, call 112.
          </Alert>
        )}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Chip label={`${conversation.doctorName.split(' ').slice(0, 2).join(' ')} typically responds within 2 hours`}
            size="small" sx={{ bgcolor: 'rgba(255,255,255,0.8)', color: tokens.textTertiary, fontSize: 11, fontWeight: 600 }} />
        </Box>
        <AnimatePresence initial={false}>
          {conversation.messages.map((m) => {
            const mine = m.senderType === 'patient';
            return (
              <motion.div key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
                <Box sx={{ maxWidth: '72%' }}>
                  <Box sx={{
                    px: 2, py: 1.25,
                    bgcolor: mine ? tokens.primary : '#fff',
                    color: mine ? '#fff' : tokens.textPrimary,
                    borderRadius: '20px',
                    borderBottomRightRadius: mine ? 6 : 20,
                    borderBottomLeftRadius: mine ? 20 : 6,
                    boxShadow: mine ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
                  }}>
                    <Typography sx={{ fontSize: 14, lineHeight: 1.5 }}>{m.content}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25,
                    justifyContent: mine ? 'flex-end' : 'flex-start', px: 0.75 }}>
                    <Typography sx={{ fontSize: 10, color: tokens.textTertiary }}>{formatTime(m.timestamp)}</Typography>
                    {mine && <DoneAllIcon sx={{ fontSize: 12, color: m.read ? tokens.primary : tokens.textTertiary }} />}
                  </Box>
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={endRef} />
      </Box>

      {/* Input — iOS style */}
      <Box sx={{ px: 2, py: 1.5, borderTop: `1px solid ${tokens.border}`, bgcolor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            <IconButton size="small" sx={{ color: tokens.primary }}><CameraAltOutlinedIcon sx={{ fontSize: 22 }} /></IconButton>
            <IconButton size="small" sx={{ color: tokens.primary }}><AttachFileOutlinedIcon sx={{ fontSize: 20 }} /></IconButton>
          </Box>
          <OutlinedInput
            fullWidth multiline maxRows={4} value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Message..."
            sx={{ bgcolor: tokens.surfaceMuted, '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: tokens.border },
              '& .MuiOutlinedInput-input': { py: 1, fontSize: 14 } }}
          />
          {draft.trim() ? (
            <IconButton onClick={handleSend}
              sx={{ bgcolor: tokens.primary, color: '#fff', '&:hover': { bgcolor: tokens.primaryDark }, width: 38, height: 38 }}>
              <SendRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          ) : (
            <IconButton sx={{ color: tokens.primary, width: 38, height: 38 }}>
              <MicNoneOutlinedIcon sx={{ fontSize: 22 }} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}
