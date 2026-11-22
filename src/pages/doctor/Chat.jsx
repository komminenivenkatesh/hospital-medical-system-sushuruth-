import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  OutlinedInput,
  InputAdornment,
  Button,
  Chip,
  Badge,
  Stack,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Tooltip,
  Drawer,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import { tokens } from '../../theme/theme';
import { chatAPI } from '../../services/api';
import useStore from '../../store/useStore';

// Initial clinical quick replies
const QUICK_REPLIES = [
  '💊 Take prescribed dose with food and water.',
  '🧪 Please upload your latest blood report or MRI scan.',
  '📅 Let us schedule a follow-up video consultation.',
  '✅ Your reports look stable. Continue current medication.',
  '⚠️ If symptoms intensify, visit the nearest emergency room immediately.',
];

// Fallback patient data for doctor view
const DEFAULT_PATIENT_CONVERSATIONS = [
  {
    id: 'conv_001',
    patient: {
      id: 'u001',
      name: 'Meera Sharma',
      age: 28,
      gender: 'Female',
      bloodGroup: 'O+',
      condition: 'Migraine with Aura',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      phone: '+91 98765 43210',
      email: 'meera.sharma@example.com',
      lastVisit: 'May 28, 2026',
      nextAppointment: 'June 10, 2026 · 14:30',
      activeMedications: ['Amitriptyline 10mg (Bedtime)', 'Sumatriptan 50mg (PRN)'],
    },
    online: true,
    unreadCount: 1,
    messages: [
      { id: 'm1', senderType: 'patient', content: "Dr. Rao, I've been having headaches again since yesterday.", timestamp: '10:30 AM', read: true },
      { id: 'm2', senderType: 'doctor', content: "Hello Meera, I'm sorry to hear that. Are the headaches similar to before, or different in character?", timestamp: '11:00 AM', read: true },
      { id: 'm3', senderType: 'patient', content: 'Similar, but the aura lasts a bit longer this time.', timestamp: '11:05 AM', read: true },
      { id: 'm4', senderType: 'doctor', content: "Thank you for the detail. Continue the Amitriptyline and let's review in our next session. If it worsens, please use the Sumatriptan as discussed.", timestamp: '11:20 AM', read: true },
      { id: 'm5', senderType: 'patient', content: 'Understood Doctor. Should I get a repeat MRI done before our next video session?', timestamp: '11:45 AM', read: false },
    ],
  },
  {
    id: 'conv_002',
    patient: {
      id: 'u002',
      name: 'Rahul Varma',
      age: 45,
      gender: 'Male',
      bloodGroup: 'B+',
      condition: 'Cervical Spondylosis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      phone: '+91 91234 56789',
      email: 'rahul.varma@example.com',
      lastVisit: 'May 14, 2026',
      nextAppointment: 'June 18, 2026 · 11:00',
      activeMedications: ['Pregabalin 75mg', 'Physiotherapy exercises daily'],
    },
    online: false,
    unreadCount: 0,
    messages: [
      { id: 'm20', senderType: 'patient', content: 'Doctor, the neck stiffness has reduced by 50% after physiotherapy.', timestamp: 'Yesterday', read: true },
      { id: 'm21', senderType: 'doctor', content: 'Excellent progress Rahul! Keep up the posture exercises and avoid heavy weight lifting.', timestamp: 'Yesterday', read: true },
    ],
  },
  {
    id: 'conv_003',
    patient: {
      id: 'u003',
      name: 'Ananya Sen',
      age: 34,
      gender: 'Female',
      bloodGroup: 'A+',
      condition: 'Epilepsy (Stable)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      phone: '+91 99887 76655',
      email: 'ananya.sen@example.com',
      lastVisit: 'April 20, 2026',
      nextAppointment: 'July 02, 2026 · 16:00',
      activeMedications: ['Levetiracetam 500mg BID'],
    },
    online: true,
    unreadCount: 0,
    messages: [
      { id: 'm30', senderType: 'patient', content: 'Sharing my latest EEG report link as requested.', timestamp: 'June 1', read: true },
      { id: 'm31', senderType: 'doctor', content: 'Received. Background rhythm looks healthy with no spike-wave discharges. We are good to continue same dosage.', timestamp: 'June 1', read: true },
    ],
  },
];

export default function DoctorChat() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(DEFAULT_PATIENT_CONVERSATIONS);
  const [activeId, setActiveId] = useState(DEFAULT_PATIENT_CONVERSATIONS[0].id);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const attachInputRef = useRef(null);

  const handleDoctorAttach = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSend(`[Prescription / Clinical Attachment: ${file.name}]`);
      e.target.value = '';
    }
  };
  const [showPatientInfo, setShowPatientInfo] = useState(true);
  const [sending, setSending] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const endRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];

  // Try fetching live backend conversations if available
  useEffect(() => {
    let mounted = true;
    async function loadApiConversations() {
      try {
        const { data } = await chatAPI.getConversations();
        if (mounted && Array.isArray(data) && data.length > 0) {
          // Map backend conversations to clinical structure
          const mapped = data.map((c) => {
            const patientUser = c.participants?.find((p) => p.role === 'patient') || c.participants?.[0] || {};
            return {
              id: c._id,
              patient: {
                id: patientUser._id,
                name: patientUser.name || 'Meera Sharma',
                email: patientUser.email || 'meera@example.com',
                age: 28,
                gender: 'Female',
                bloodGroup: 'O+',
                condition: 'Migraine with Aura',
                avatar: patientUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
                lastVisit: 'May 28, 2026',
                nextAppointment: 'June 10, 2026 · 14:30',
                activeMedications: ['Amitriptyline 10mg (Bedtime)', 'Sumatriptan 50mg (PRN)'],
              },
              online: true,
              unreadCount: 0,
              messages: (c.messages || []).map((m) => ({
                id: m._id || m.id,
                senderType: m.senderType || (m.sender?._id === patientUser._id || m.sender === patientUser._id ? 'patient' : 'doctor'),
                content: m.content,
                timestamp: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                read: m.read ?? true,
              })),
            };
          });
          setConversations(mapped);
          setActiveId((curr) => {
            if (curr && mapped.some((c) => c.id === curr)) {
              return curr; // preserve current doctor selection
            }
            return mapped[0]?.id ?? curr;
          });
        }
      } catch (err) {
        // Fallback silently to seeded conversations
        console.info('Using doctor clinical seed conversations');
      }
    }
    loadApiConversations();
    const timer = setInterval(loadApiConversations, 3000);
    return () => { mounted = false; clearInterval(timer); };
  }, [activeId]);

  // Scroll to bottom on message change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages.length, activeId]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || draft).trim();
    if (!text) return;

    const newMsg = {
      id: `doc_msg_${Date.now()}`,
      senderType: 'doctor',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    // Update UI state immediately
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        return {
          ...c,
          messages: [...c.messages, newMsg],
        };
      })
    );
    setDraft('');

    // Attempt backend sync
    try {
      setSending(true);
      await chatAPI.sendMessage(activeId, text, 'doctor');
    } catch (err) {
      // Local state already updated
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.patient.name.toLowerCase().includes(search.toLowerCase()) ||
    c.patient.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <Box sx={{
        display: 'flex',
        height: { xs: 'calc(100vh - 130px)', md: 'calc(100vh - 84px)' },
        mx: { xs: -1.5, sm: -2, md: -3.5 },
        my: { xs: -2, md: -3.5 },
        bgcolor: tokens.canvas,
        overflow: 'hidden',
        borderTop: `1px solid ${tokens.border}`,
      }}>

        {/* ================= LEFT: Patients Inbox ================= */}
        <Box sx={{
          width: { xs: '100%', md: 320 },
          flexShrink: 0,
          borderRight: { xs: 'none', md: `1px solid ${tokens.border}` },
          bgcolor: tokens.surface,
          display: { xs: mobileShowChat ? 'none' : 'flex', md: 'flex' },
          flexDirection: 'column',
        }}>
          {/* Inbox Header */}
          <Box sx={{ p: 2.5, borderBottom: `1px solid ${tokens.border}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 18, color: tokens.textPrimary }}>
                Patient Messages
              </Typography>
              <Chip
                label={`${conversations.length} Active`}
                size="small"
                sx={{ bgcolor: tokens.primarySoft, color: tokens.primary, fontWeight: 700, fontSize: 11 }}
              />
            </Box>

            <OutlinedInput
              fullWidth
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient or diagnosis..."
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: tokens.textTertiary, fontSize: 18 }} />
                </InputAdornment>
              }
              sx={{
                bgcolor: tokens.surfaceMuted,
                borderRadius: '10px',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: tokens.border },
                '& .MuiOutlinedInput-input': { py: 1, fontSize: 13 },
              }}
            />
          </Box>

          {/* Conversations List */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
            <Stack spacing={0.75}>
              {filteredConversations.map((c) => {
                const isSelected = c.id === activeId;
                const lastMsg = c.messages[c.messages.length - 1];
                return (
                  <Box
                    key={c.id}
                    onClick={() => {
                      setActiveId(c.id);
                      setMobileShowChat(true);
                    }}
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      bgcolor: isSelected ? tokens.primarySoft : 'transparent',
                      border: `1px solid ${isSelected ? `${tokens.primary}44` : 'transparent'}`,
                      transition: 'all 150ms ease',
                      '&:hover': {
                        bgcolor: isSelected ? tokens.primarySoft : tokens.surfaceMuted,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          src={c.patient.avatar}
                          sx={{
                            width: 44,
                            height: 44,
                            bgcolor: tokens.primary,
                            fontWeight: 800,
                            fontSize: 15,
                            border: `2px solid ${isSelected ? tokens.primary : '#fff'}`,
                          }}
                        >
                          {c.patient.name.split(' ').map((n) => n[0]).join('')}
                        </Avatar>
                        {c.online && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: 11,
                              height: 11,
                              borderRadius: '50%',
                              bgcolor: tokens.success,
                              border: '2px solid #fff',
                            }}
                          />
                        )}
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: tokens.textPrimary }} noWrap>
                            {c.patient.name}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>
                            {lastMsg?.timestamp || ''}
                          </Typography>
                        </Box>

                        <Typography sx={{ fontSize: 11.5, color: tokens.primary, fontWeight: 600, mb: 0.5 }} noWrap>
                          {c.patient.condition}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: isSelected ? tokens.textPrimary : tokens.textSecondary,
                              fontWeight: c.unreadCount > 0 ? 700 : 400,
                            }}
                            noWrap
                          >
                            {lastMsg?.senderType === 'doctor' ? 'You: ' : ''}{lastMsg?.content || 'No messages yet'}
                          </Typography>
                          {c.unreadCount > 0 && (
                            <Badge
                              badgeContent={c.unreadCount}
                              color="primary"
                              sx={{
                                ml: 1,
                                '& .MuiBadge-badge': {
                                  position: 'static',
                                  transform: 'none',
                                  fontSize: 10,
                                  minWidth: 18,
                                  height: 18,
                                  fontWeight: 800,
                                },
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Box>

        {/* ================= MIDDLE: Active Chat ================= */}
        <Box sx={{
          flex: 1,
          display: { xs: mobileShowChat ? 'flex' : 'none', md: 'flex' },
          flexDirection: 'column',
          bgcolor: '#FFFFFF',
          minWidth: 0,
        }}>
          {/* Chat Header */}
          <Box sx={{
            px: { xs: 1.5, sm: 3 },
            py: 1.75,
            borderBottom: `1px solid ${tokens.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(10px)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <IconButton
                size="small"
                onClick={() => setMobileShowChat(false)}
                sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: -0.5, color: tokens.textPrimary }}
                aria-label="Back to patient list"
              >
                <ArrowBackRoundedIcon sx={{ fontSize: 22 }} />
              </IconButton>
              <Avatar
                src={activeConv?.patient.avatar}
                sx={{ width: 40, height: 40, bgcolor: tokens.primary, fontWeight: 800, fontSize: 16 }}
              >
                {activeConv?.patient.name.split(' ').map((n) => n[0]).join('')}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 16, color: tokens.textPrimary }}>
                    {activeConv?.patient.name}
                  </Typography>
                  <Chip
                    label={activeConv?.patient.condition}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 10.5,
                      fontWeight: 700,
                      bgcolor: tokens.primarySoft,
                      color: tokens.primary,
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: 12, color: activeConv?.online ? tokens.success : tokens.textTertiary, fontWeight: 600 }}>
                  {activeConv?.online ? '● Active now' : '○ Offline'} · {activeConv?.patient.gender}, {activeConv?.patient.age} yrs
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<VideocamRoundedIcon />}
                onClick={() => {
                  const targetRoom = activeConv?.appointmentId || (activeConv?.patient?.name?.includes('Meera') ? 'a001' : activeConv?.id || 'a001');
                  navigate(`/doctor/consult/${targetRoom}`, {
                    state: {
                      patientName: activeConv?.patient?.name || 'Meera Sharma',
                      patientId: activeConv?.patient?.id || 'u001',
                    },
                  });
                }}
                sx={{
                  borderRadius: 100,
                  fontWeight: 700,
                  fontSize: 12.5,
                  textTransform: 'none',
                  px: 2,
                }}
              >
                Start Video Call
              </Button>
              <Tooltip title={showPatientInfo ? 'Hide Patient Medical Details' : 'Show Patient Medical Details'}>
                <IconButton
                  onClick={() => setShowPatientInfo(!showPatientInfo)}
                  sx={{
                    border: `1px solid ${tokens.border}`,
                    bgcolor: showPatientInfo ? tokens.primarySoft : 'transparent',
                    color: showPatientInfo ? tokens.primary : tokens.textSecondary,
                  }}
                >
                  <FolderSharedOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Clinical Banner */}
          <Box sx={{
            px: 3,
            py: 0.75,
            bgcolor: '#F8FAFC',
            borderBottom: `1px solid ${tokens.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedUserOutlinedIcon sx={{ fontSize: 15, color: tokens.teal }} />
              <Typography sx={{ fontSize: 11.5, color: tokens.textSecondary, fontWeight: 500 }}>
                End-to-End Encrypted Teleconsultation · HIPAA & NABH Compliant Clinical Record
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 11.5, color: tokens.textTertiary }}>
              Last visit: {activeConv?.patient.lastVisit}
            </Typography>
          </Box>

          {/* Messages Stream */}
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            bgcolor: tokens.canvas,
            backgroundImage:
              'radial-gradient(circle at 10% 20%, rgba(47,107,255,0.02) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(47,107,255,0.02) 0%, transparent 40%)',
          }}>
            <AnimatePresence initial={false}>
              {activeConv?.messages.map((m) => {
                const isDoc = m.senderType === 'doctor';
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: 'flex',
                      justifyContent: isDoc ? 'flex-end' : 'flex-start',
                      marginBottom: 12,
                    }}
                  >
                    <Box sx={{ maxWidth: '70%' }}>
                      <Box
                        sx={{
                          px: 2.25,
                          py: 1.5,
                          borderRadius: '18px',
                          borderBottomRightRadius: isDoc ? 4 : 18,
                          borderBottomLeftRadius: isDoc ? 18 : 4,
                          bgcolor: isDoc ? tokens.primary : '#FFFFFF',
                          color: isDoc ? '#FFFFFF' : tokens.textPrimary,
                          boxShadow: isDoc ? '0 2px 8px rgba(47,107,255,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
                          border: isDoc ? 'none' : `1px solid ${tokens.border}`,
                        }}
                      >
                        <Typography sx={{ fontSize: 13.5, lineHeight: 1.55 }}>
                          {m.content}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mt: 0.4,
                          justifyContent: isDoc ? 'flex-end' : 'flex-start',
                          px: 0.5,
                        }}
                      >
                        <Typography sx={{ fontSize: 10.5, color: tokens.textTertiary }}>
                          {m.timestamp}
                        </Typography>
                        {isDoc && (
                          <DoneAllIcon sx={{ fontSize: 13, color: tokens.primary }} />
                        )}
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={endRef} />
          </Box>

          {/* Quick Replies Toolbar */}
          <Box sx={{
            px: 2.5,
            py: 1,
            borderTop: `1px solid ${tokens.border}`,
            bgcolor: '#FFFFFF',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            display: 'flex',
            gap: 1,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: tokens.border, borderRadius: 2 },
          }}>
            {QUICK_REPLIES.map((reply, i) => (
              <Chip
                key={i}
                label={reply}
                size="small"
                onClick={() => handleSendMessage(reply)}
                sx={{
                  bgcolor: tokens.surfaceMuted,
                  color: tokens.textSecondary,
                  fontSize: 11.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderRadius: 100,
                  border: `1px solid ${tokens.border}`,
                  '&:hover': {
                    bgcolor: tokens.primarySoft,
                    color: tokens.primary,
                    borderColor: tokens.primary,
                  },
                }}
              />
            ))}
          </Box>

          {/* Message Input Box */}
          <Box sx={{
            p: 2,
            borderTop: `1px solid ${tokens.border}`,
            bgcolor: '#FFFFFF',
          }}>
            <input
              type="file"
              ref={attachInputRef}
              style={{ display: 'none' }}
              onChange={handleDoctorAttach}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Tooltip title="Attach Prescription or Clinical Note">
                <IconButton
                  onClick={() => attachInputRef.current?.click()}
                  sx={{ color: tokens.primary, border: `1px solid ${tokens.border}` }}
                >
                  <AttachFileOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>

              <OutlinedInput
                fullWidth
                multiline
                maxRows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Reply to ${activeConv?.patient.name}... (Press Enter to send)`}
                sx={{
                  bgcolor: tokens.surfaceMuted,
                  borderRadius: '14px',
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: tokens.border },
                  '& .MuiOutlinedInput-input': { py: 1.25, fontSize: 13.5 },
                }}
              />

              <Button
                variant="contained"
                disabled={!draft.trim() || sending}
                onClick={() => handleSendMessage()}
                sx={{
                  height: 44,
                  minWidth: 44,
                  borderRadius: '12px',
                  px: 2.5,
                  fontWeight: 700,
                  bgcolor: tokens.primary,
                  '&:hover': { bgcolor: tokens.primaryDark },
                }}
              >
                {sending ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <SendRoundedIcon sx={{ fontSize: 18 }} />}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ================= RIGHT: Patient Clinical Profile ================= */}
        {showPatientInfo && activeConv && (
          <Box sx={{
            width: { xs: 280, lg: 320 },
            flexShrink: 0,
            borderLeft: `1px solid ${tokens.border}`,
            bgcolor: tokens.surface,
            p: 2.5,
            overflowY: 'auto',
            display: { xs: 'none', md: 'block' },
          }}>
            <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 2, color: tokens.textPrimary }}>
              Patient Clinical Overview
            </Typography>

            {/* Patient Header Card */}
            <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22`, mb: 2.5 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                <Avatar
                  src={activeConv.patient.avatar}
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 1.5,
                    border: '3px solid #fff',
                    bgcolor: tokens.primary,
                    fontWeight: 800,
                    fontSize: 22,
                  }}
                >
                  {activeConv.patient.name.split(' ').map((n) => n[0]).join('')}
                </Avatar>
                <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
                  {activeConv.patient.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: tokens.textSecondary, mb: 1 }}>
                  {activeConv.patient.email}
                </Typography>
                <Chip
                  label={activeConv.patient.condition}
                  size="small"
                  sx={{ bgcolor: '#fff', color: tokens.primary, fontWeight: 700, fontSize: 11 }}
                />
              </CardContent>
            </Card>

            {/* Vitals Summary Strip */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2.5 }}>
              <Box sx={{ p: 1.25, bgcolor: tokens.surfaceMuted, borderRadius: 2, textAlign: 'center' }}>
                <PersonOutlineRoundedIcon sx={{ fontSize: 16, color: tokens.textTertiary, mb: 0.25 }} />
                <Typography sx={{ fontSize: 10, color: tokens.textTertiary }}>Age</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{activeConv.patient.age} yrs</Typography>
              </Box>
              <Box sx={{ p: 1.25, bgcolor: tokens.surfaceMuted, borderRadius: 2, textAlign: 'center' }}>
                <BloodtypeOutlinedIcon sx={{ fontSize: 16, color: tokens.danger, mb: 0.25 }} />
                <Typography sx={{ fontSize: 10, color: tokens.textTertiary }}>Blood</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{activeConv.patient.bloodGroup}</Typography>
              </Box>
              <Box sx={{ p: 1.25, bgcolor: tokens.surfaceMuted, borderRadius: 2, textAlign: 'center' }}>
                <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: tokens.teal, mb: 0.25 }} />
                <Typography sx={{ fontSize: 10, color: tokens.textTertiary }}>Gender</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{activeConv.patient.gender}</Typography>
              </Box>
            </Box>

            {/* Next Appointment Card */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: tokens.textSecondary, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Upcoming Session
              </Typography>
              <Card sx={{ bgcolor: tokens.surfaceMuted, border: `1px solid ${tokens.border}` }}>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CalendarMonthOutlinedIcon sx={{ color: tokens.primary, fontSize: 22 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                      {activeConv.patient.nextAppointment}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>
                      Video Teleconsultation
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Active Medications */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: tokens.textSecondary, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Prescriptions
              </Typography>
              <Stack spacing={1}>
                {activeConv.patient.activeMedications.map((med, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      bgcolor: tokens.surfaceMuted,
                      border: `1px solid ${tokens.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <MedicalServicesOutlinedIcon sx={{ fontSize: 16, color: tokens.teal }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: tokens.textPrimary }}>
                      {med}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Fast Action Buttons */}
            <Stack spacing={1.25}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<NoteAltOutlinedIcon />}
                onClick={() => navigate('/doctor/patients')}
                sx={{
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: 12.5,
                  textTransform: 'none',
                  py: 1,
                }}
              >
                View Full Patient Record
              </Button>
            </Stack>
          </Box>
        )}

      </Box>
    </PageTransition>
  );
}
