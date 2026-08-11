import { Box, Typography, OutlinedInput, InputAdornment, List, ListItemButton, ListItemAvatar, Avatar, Badge, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ChatWindow from '../../components/ChatWindow';
import UpgradePrompt from '../../components/UpgradePrompt';
import PageTransition from '../../components/PageTransition';
import useStore from '../../store/useStore';
import { tokens } from '../../theme/theme';

const proFeatures = [
  'Real-time chat with your doctor',
  'Share photos and documents',
  'Get quick prescription clarifications',
  'Follow up after appointments',
];

export default function Chat() {
  const isPro = useStore((s) => s.isPro);
  const conversations = useStore((s) => s.conversations);
  const activeId = useStore((s) => s.activeConversationId);
  const setActive = useStore((s) => s.setActiveConversation);
  const active = conversations.find((c) => c.id === activeId);

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

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)', m: { xs: -2, md: -3.5 }, overflow: 'hidden', bgcolor: tokens.canvas }}>
      {/* Sidebar */}
      <Box sx={{ width: 300, flexShrink: 0, borderRight: `1px solid ${tokens.border}`, display: { xs: 'none', sm: 'flex' },
        flexDirection: 'column', bgcolor: tokens.surface }}>
        <Box sx={{ p: 2.5, borderBottom: `1px solid ${tokens.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: tokens.textPrimary }}>Messages</Typography>
            <Button size="small" variant="contained" startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              sx={{ px: 1.5, py: 0.5, fontSize: 12, minWidth: 0 }}>
              New
            </Button>
          </Box>
          <OutlinedInput fullWidth size="small" placeholder="Search conversations..."
            startAdornment={<InputAdornment position="start"><SearchIcon sx={{ color: tokens.textTertiary, fontSize: 18 }} /></InputAdornment>}
            sx={{ bgcolor: tokens.surfaceMuted, '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: tokens.border } }} />
        </Box>

        <List sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 1 }}>
          {conversations.map((c) => (
            <ListItemButton key={c.id} selected={c.id === activeId} onClick={() => setActive(c.id)}
              sx={{ borderRadius: 3, mb: 0.5, px: 1.5, py: 1.25,
                '&.Mui-selected': { bgcolor: tokens.primarySoft, '&:hover': { bgcolor: tokens.primarySoft } },
                '&:hover': { bgcolor: tokens.surfaceMuted } }}>
              <ListItemAvatar sx={{ minWidth: 52 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: tokens.primary, fontWeight: 800, fontSize: 14 }}>
                  {c.initials}
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: tokens.textPrimary }}>{c.doctorName}</Typography>
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

      <ChatWindow conversation={active} />
    </Box>
  );
}
