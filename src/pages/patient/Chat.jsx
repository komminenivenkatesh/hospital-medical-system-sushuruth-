import { useState, useEffect } from 'react';
import { Box, Typography, OutlinedInput, InputAdornment, List, ListItemButton, ListItemAvatar, Avatar, Badge, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ChatWindow from '../../components/ChatWindow';
import UpgradePrompt from '../../components/UpgradePrompt';
import PageTransition from '../../components/PageTransition';
import useStore from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';
import { tokens } from '../../theme/theme';
import { chatAPI } from '../../services/api';

const proFeatures = [
  'Real-time chat with your doctor',
  'Share photos and documents',
  'Get quick prescription clarifications',
  'Follow up after appointments',
];

export default function Chat() {
  const { user } = useAuth();
  const isPro = useStore((s) => s.isPro);
  const storeConversations = useStore((s) => s.conversations);
  const [conversations, setConversations] = useState(storeConversations);
  const [activeId, setActiveId] = useState(storeConversations[0]?.id ?? null);
  const [search, setSearch] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Fetch live backend conversations & auto-poll for sync
  useEffect(() => {
    let mounted = true;
    async function loadApiConversations() {
      try {
        const { data } = await chatAPI.getConversations();
        if (mounted && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((c) => {
            const doctorUser = c.participants?.find((p) => p.role === 'doctor') || c.participants?.[1] || {};
            const docName = doctorUser.name || 'Dr. Arvind Rao';
            const initials = docName.split(' ').map((w) => w[0]).join('').slice(0, 2) || 'DR';
            return {
              id: c._id,
              patientId: user?._id || 'u001',
              doctorId: doctorUser._id || 'd001',
              doctorName: docName,
              initials,
              specialty: doctorUser.specialty || (docName.includes('Priya') ? 'Cardiology' : 'Neurology'),
              online: true,
              unreadCount: 0,
              lastMessage: c.lastMessage || c.messages?.slice(-1)[0]?.content || '',
              messages: (c.messages || []).map((m) => ({
                id: m._id || m.id,
                senderId: m.sender?._id || m.sender,
                senderType: m.senderType || (m.sender === user?._id ? 'patient' : 'doctor'),
                content: m.content,
                timestamp: m.createdAt || new Date().toISOString(),
                read: m.read ?? true,
                type: 'text',
              })),
            };
          });
          // Sort attending physician with active upcoming appointment to the top
          mapped.sort((a, b) => {
            if (a.doctorName?.includes('Arvind')) return -1;
            if (b.doctorName?.includes('Arvind')) return 1;
            return 0;
          });
          setConversations(mapped);
          setActiveId((curr) => {
            if (curr && mapped.some((c) => c.id === curr)) {
              return curr; // preserve current user selection
            }
            return mapped[0]?.id ?? curr;
          });
        }
      } catch (err) {
        // Fallback silently to store conversations
      }
    }
    loadApiConversations();
    const interval = setInterval(loadApiConversations, 3000);
    return () => { mounted = false; clearInterval(interval); };
  }, [user?._id]);

  const active = conversations.find((c) => c.id === activeId) || conversations[0];

  const handleSendMessage = async (convId, text) => {
    const newMsg = {
      id: `patient_msg_${Date.now()}`,
      senderId: user?._id || 'u001',
      senderType: 'patient',
      content: text,
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        return {
          ...c,
          lastMessage: text,
          messages: [...(c.messages || []), newMsg],
        };
      })
    );

    try {
      await chatAPI.sendMessage(convId, text, 'patient');
    } catch (err) {
      // Local fallback handled
    }
  };

  if (!isPro) {
    return (
      <PageTransition>
        {/* Hero locked state */}
        <Box sx={{ maxWidth: 560 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: 4, bgcolor: tokens.primarySoft, display: 'flex', alignItems: 'center',
            justifyContent: 'center', mb: 2.5 }}>
            <LockOutlinedIcon sx={{ fontSize: 30, color: tokens.primary }} />
          </Box>
          <Chip label="Pro Feature" size="small" sx={{ bgcolor: '#FEF6E7', color: '#B45309', fontWeight: 700, mb: 1.5 }} />
          <Typography sx={{ fontWeight: 800, fontSize: 28, color: tokens.textPrimary, letterSpacing: '-0.02em', lineHeight: 1.1, mb: 1 }}>
            Direct Doctor Chat
          </Typography>
          <Typography sx={{ fontSize: 15, color: tokens.textSecondary, mb: 3, lineHeight: 1.6 }}>
            Chat directly with your doctor between appointments. Ask questions, share updates, and follow up on prescriptions — without waiting for your next visit.
          </Typography>

          <Box sx={{ p: 3, bgcolor: tokens.surfaceMuted, borderRadius: 3, mb: 3, border: `1px solid ${tokens.border}` }}>
            {proFeatures.map((f) => (
              <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, '&:last-child': { mb: 0 } }}>
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: tokens.successSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckIcon sx={{ fontSize: 14, color: tokens.success }} />
                </Box>
                <Typography sx={{ fontSize: 14, color: tokens.textPrimary, fontWeight: 500 }}>{f}</Typography>
              </Box>
            ))}
          </Box>

          <UpgradePrompt
            icon={LockOutlinedIcon}
            title="Unlock Direct Doctor Chat"
            description="Upgrade to Pro to message your doctor directly between appointments."
          />
        </Box>
      </PageTransition>
    );
  }

  const filtered = conversations.filter((c) =>
    (c.doctorName || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.specialty || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{
      display: 'flex',
      height: { xs: 'calc(100vh - 140px)', sm: 'calc(100vh - 100px)' },
      m: { xs: -1.5, sm: -2, md: -3.5 },
      overflow: 'hidden',
      bgcolor: tokens.canvas,
      borderRadius: { xs: 0, sm: 3 },
      border: { xs: 'none', sm: `1px solid ${tokens.border}` },
    }}>
      {/* Sidebar (List of conversations) */}
      <Box sx={{
        width: { xs: '100%', sm: 300, md: 320 },
        flexShrink: 0,
        borderRight: { xs: 'none', sm: `1px solid ${tokens.border}` },
        display: { xs: showMobileChat ? 'none' : 'flex', sm: 'flex' },
        flexDirection: 'column',
        bgcolor: tokens.surface,
      }}>
        <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${tokens.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 17, sm: 18 }, color: tokens.textPrimary }}>Messages</Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={() => navigate('/find-doctors')}
              sx={{ px: 1.5, py: 0.5, fontSize: 12, minWidth: 0, borderRadius: 100 }}
            >
              New
            </Button>
          </Box>
          <OutlinedInput
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={<InputAdornment position="start"><SearchIcon sx={{ color: tokens.textTertiary, fontSize: 18 }} /></InputAdornment>}
            sx={{ bgcolor: tokens.surfaceMuted, borderRadius: '10px', '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: tokens.border } }} />
        </Box>

        <List sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 1 }}>
          {filtered.map((c) => (
            <ListItemButton
              key={c.id}
              selected={c.id === activeId}
              onClick={() => {
                setActiveId(c.id);
                setShowMobileChat(true);
              }}
              sx={{
                borderRadius: 3, mb: 0.5, px: 1.5, py: 1.25,
                '&.Mui-selected': { bgcolor: tokens.primarySoft, '&:hover': { bgcolor: tokens.primarySoft } },
                '&:hover': { bgcolor: tokens.surfaceMuted },
              }}
            >
              <ListItemAvatar sx={{ minWidth: 50 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: tokens.primary, fontWeight: 800, fontSize: 14 }}>
                  {c.initials}
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: tokens.textPrimary }} noWrap>{c.doctorName}</Typography>
                  {c.unreadCount > 0 && (
                    <Badge badgeContent={c.unreadCount} color="primary"
                      sx={{ '& .MuiBadge-badge': { position: 'static', transform: 'none', fontSize: 10, minWidth: 18, height: 18 } }} />
                  )}
                </Box>
                <Typography sx={{ fontSize: 11, color: tokens.primary, fontWeight: 600 }}>{c.specialty}</Typography>
                <Typography sx={{ fontSize: 12, color: tokens.textTertiary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.lastMessage}
                </Typography>
              </Box>
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Active Chat Window */}
      <Box sx={{
        flex: 1,
        display: { xs: showMobileChat ? 'flex' : 'none', sm: 'flex' },
        flexDirection: 'column',
        minWidth: 0,
      }}>
        <ChatWindow
          conversation={active}
          onSendMessage={handleSendMessage}
          onBack={() => setShowMobileChat(false)}
        />
      </Box>
    </Box>
  );
}
