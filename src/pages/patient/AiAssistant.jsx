import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box, Typography, IconButton, InputBase, Avatar, Button, Divider,
  Card, CardContent, Chip, Tooltip, Stack,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded';
import BiotechRoundedIcon from '@mui/icons-material/BiotechRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { aiAPI } from '../../services/api';

const SIDEBAR_W = 270;

const suggestions = [
  { icon: MonitorHeartRoundedIcon, label: 'Check my symptoms', prompt: 'I have a persistent headache and mild fever for the past 2 days. What could it be?' },
  { icon: PersonSearchRoundedIcon, label: 'Find a specialist', prompt: 'Which type of doctor should I see for recurring migraines and dizziness?' },
  { icon: MedicationRoundedIcon, label: 'Drug interactions', prompt: 'Can I take ibuprofen with blood pressure medication?' },
  { icon: BiotechRoundedIcon, label: 'Explain my report', prompt: 'My MRI report says "mild white matter changes". What does that mean?' },
  { icon: FavoriteRoundedIcon, label: 'Heart health tips', prompt: 'What lifestyle changes can help reduce my risk of heart disease and high blood pressure?' },
  { icon: PsychologyRoundedIcon, label: 'Mental wellness', prompt: 'I have been feeling anxious and unable to sleep for the past 2 weeks. What should I do?' },
];

function renderText(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const html = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^> (.+)/, '<span style="display:block;padding:8px 12px;background:rgba(15,82,186,0.06);border-left:3px solid #0F52BA;border-radius:0 8px 8px 0;margin:6px 0">$1</span>');
    return <p key={i} style={{ margin: '3px 0', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />;
  });
}

function TypingDots() {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, py: 0.25 }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.55, delay: i * 0.13, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: '#9CA3AF' }}
        />
      ))}
    </Box>
  );
}

export default function AiAssistant() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const { data } = await aiAPI.getConversations();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (err) {
      console.warn('Could not fetch AI conversations:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const loadConversation = async (convId) => {
    setActiveConvId(convId);
    setTyping(false);
    try {
      const { data } = await aiAPI.getConversationById(convId);
      if (data.success && data.data) {
        setMessages(data.data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  const newChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await aiAPI.deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      if (activeConvId === convId) {
        newChat();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || typing) return;
    const promptText = text.trim();
    const userMsg = { role: 'user', text: promptText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const { data } = await aiAPI.sendMessage(promptText, activeConvId);
      if (data.success) {
        if (!activeConvId) {
          setActiveConvId(data.conversationId);
          fetchConversations();
        }
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('AI error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I apologize, but I encountered a momentary connection difficulty. Please try your request again.',
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: '"Manrope", sans-serif' }}>
      {/* ── Sidebar ── */}
      <Box
        sx={{
          width: sidebarOpen ? SIDEBAR_W : 0,
          flexShrink: 0,
          overflow: 'hidden',
          bgcolor: '#111827',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 250ms cubic-bezier(0.4,0,0.2,1)',
          borderRight: '1px solid #1F2937',
        }}
      >
        <Box sx={{ minWidth: SIDEBAR_W, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, pt: 2.5, pb: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '9px',
                background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Typography sx={{ fontWeight: 800, color: '#F9FAFB', fontSize: 15, letterSpacing: '-0.01em' }}>
              Sushruth AI
            </Typography>
          </Box>

          {/* New chat */}
          <Box sx={{ px: 1.5, pb: 1.5 }}>
            <Button
              fullWidth
              startIcon={<AddRoundedIcon sx={{ fontSize: 17 }} />}
              onClick={newChat}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 13.5,
                color: '#F9FAFB',
                bgcolor: '#1F2937',
                borderRadius: '10px',
                py: 1.1,
                px: 1.5,
                '&:hover': { bgcolor: '#374151' },
                transition: 'background 150ms',
              }}
            >
              New Consultation
            </Button>
          </Box>

          {/* Conversation history */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 1,
              '&::-webkit-scrollbar': { width: 3 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#374151', borderRadius: 100 },
            }}
          >
            <Typography
              sx={{
                px: 1.5,
                py: 0.5,
                fontSize: 10.5,
                fontWeight: 700,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Consultation History
            </Typography>

            {conversations.length === 0 ? (
              <Box sx={{ px: 1.5, py: 2 }}>
                <Typography sx={{ fontSize: 12.5, color: '#6B7280' }}>
                  No past consultations yet. Start by asking a question!
                </Typography>
              </Box>
            ) : (
              conversations.map((c) => (
                <Box
                  key={c._id}
                  onClick={() => loadConversation(c._id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.5,
                    py: 1,
                    my: 0.25,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    bgcolor: activeConvId === c._id ? '#1F2937' : 'transparent',
                    '&:hover': { bgcolor: '#1F2937', '& .delete-btn': { opacity: 1 } },
                    transition: 'background 120ms',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: activeConvId === c._id ? '#F9FAFB' : '#9CA3AF',
                      fontWeight: activeConvId === c._id ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      pr: 1,
                    }}
                  >
                    {c.title || 'Consultation'}
                  </Typography>
                  <IconButton
                    size="small"
                    className="delete-btn"
                    onClick={(e) => handleDeleteConversation(e, c._id)}
                    sx={{
                      color: '#6B7280',
                      opacity: 0,
                      p: 0.25,
                      '&:hover': { color: '#EF4444' },
                      transition: 'opacity 150ms, color 150ms',
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Box>
              ))
            )}
          </Box>

          <Divider sx={{ borderColor: '#1F2937' }} />

          {/* User + back */}
          <Box sx={{ p: 1.5 }}>
            <Box
              onClick={() => navigate('/dashboard')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.5,
                py: 1,
                borderRadius: '10px',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#1F2937' },
                transition: 'background 150ms',
                mb: 0.5,
              }}
            >
              <ArrowBackRoundedIcon sx={{ fontSize: 17, color: '#6B7280' }} />
              <Typography sx={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>Back to app</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, borderRadius: '10px' }}>
              <Avatar
                src={user?.avatar || ''}
                sx={{ width: 28, height: 28, bgcolor: '#6366F1', fontSize: 12, fontWeight: 700 }}
              >
                {user?.name?.[0] || 'U'}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, color: '#F9FAFB', fontWeight: 600, lineHeight: 1.2 }}>
                  {user?.name || 'Verified Patient'}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#6B7280' }}>
                  {user?.role === 'patient' ? 'Patient Portal' : user?.role || 'Member'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Main area ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff', minWidth: 0, overflow: 'hidden' }}>
        {/* Top bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
          <IconButton
            size="small"
            onClick={() => setSidebarOpen((v) => !v)}
            sx={{ color: '#6B7280', '&:hover': { bgcolor: '#F9FAFB' } }}
          >
            <MenuRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 'auto' }}>
            <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#8B5CF6' }} />
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>Sushruth AI Clinical Engine</Typography>
            <Box sx={{ px: 1, py: 0.25, borderRadius: '6px', bgcolor: '#F3F0FF', border: '1px solid #DDD6FE' }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#7C3AED' }}>Active</Typography>
            </Box>
          </Box>
          <Box sx={{ width: 32 }} />
        </Box>

        {/* Messages / Welcome */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: { xs: 2, md: 0 },
            '&::-webkit-scrollbar': { width: 5 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 100 },
          }}
        >
          <AnimatePresence mode="wait">
            {isEmpty ? (
              /* Welcome screen */
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ maxWidth: 680, margin: '0 auto', padding: '40px 16px 24px' }}
              >
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                    }}
                  >
                    <AutoAwesomeRoundedIcon sx={{ color: '#fff', fontSize: 26 }} />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: 22, md: 28 },
                      color: '#111827',
                      letterSpacing: '-0.02em',
                      mb: 1,
                    }}
                  >
                    How can I help you today?
                  </Typography>
                  <Typography sx={{ fontSize: 15, color: '#6B7280' }}>
                    Ask me about symptoms, medications, reports, or matching with verified specialists.
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1.5 }}>
                  {suggestions.map((s) => {
                    const Icon = s.icon;
                    return (
                      <Box
                        key={s.label}
                        onClick={() => sendMessage(s.prompt)}
                        sx={{
                          p: 2,
                          borderRadius: '14px',
                          border: '1px solid #E5E7EB',
                          cursor: 'pointer',
                          bgcolor: '#FAFAFA',
                          transition: 'all 160ms ease',
                          '&:hover': {
                            border: '1px solid #6366F1',
                            bgcolor: '#F5F3FF',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 16px rgba(99,102,241,0.12)',
                          },
                        }}
                      >
                        <Icon sx={{ fontSize: 22, color: '#8B5CF6', mb: 1.25, display: 'block' }} />
                        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>
                          {s.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </motion.div>
            ) : (
              /* Chat messages */
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 8px' }}
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {msg.role === 'user' ? (
                      /* User message — right aligned pill */
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                        <Box
                          sx={{
                            maxWidth: '75%',
                            px: 2.5,
                            py: 1.75,
                            bgcolor: '#111827',
                            borderRadius: '18px 18px 4px 18px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 14.5,
                              color: '#F9FAFB',
                              lineHeight: 1.65,
                              fontFamily: '"Manrope",sans-serif',
                            }}
                          >
                            {msg.text}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      /* AI message — left, structured */
                      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '8px',
                            flexShrink: 0,
                            background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mt: 0.25,
                          }}
                        >
                          <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: '#fff' }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            component="div"
                            sx={{
                              fontSize: 14.5,
                              color: '#111827',
                              lineHeight: 1.75,
                              fontFamily: '"Manrope",sans-serif',
                              '& strong': { fontWeight: 700 },
                              '& p': { margin: '4px 0' },
                            }}
                          >
                            {renderText(msg.text)}
                          </Typography>

                          {/* Recommended Doctors Card */}
                          {msg.suggestedDoctors && msg.suggestedDoctors.length > 0 && (
                            <Box sx={{ mt: 2.5, p: 2, bgcolor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1E293B', mb: 1.5 }}>
                                Recommended Verified Specialists
                              </Typography>
                              <Stack spacing={1}>
                                {msg.suggestedDoctors.map((doc, idx) => (
                                  <Box
                                    key={idx}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      bgcolor: '#fff',
                                      p: 1.5,
                                      borderRadius: '10px',
                                      border: '1px solid #E2E8F0',
                                    }}
                                  >
                                    <Box>
                                      <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: '#0F172A' }}>
                                        {doc.name}
                                      </Typography>
                                      <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                                        {doc.specialty} · {doc.hospital}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                      <Box sx={{ textAlign: 'right' }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#10B981' }}>
                                          ₹{doc.consultationFee}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                          <StarRoundedIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
                                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>
                                            {doc.rating}
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => navigate('/find-doctors')}
                                        sx={{
                                          textTransform: 'none',
                                          fontSize: 12,
                                          borderRadius: '100px',
                                          px: 1.75,
                                          bgcolor: '#0F52BA',
                                        }}
                                      >
                                        Book
                                      </Button>
                                    </Box>
                                  </Box>
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}
                  </motion.div>
                ))}

                {typing && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '8px',
                          flexShrink: 0,
                          background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: '#fff' }} />
                      </Box>
                      <Box sx={{ pt: 0.5 }}>
                        <TypingDots />
                      </Box>
                    </Box>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Input bar */}
        <Box sx={{ flexShrink: 0, px: { xs: 2, md: 0 }, pb: 3, pt: 1 }}>
          <Box sx={{ maxWidth: 720, mx: 'auto' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
                border: '1.5px solid #E5E7EB',
                borderRadius: '16px',
                px: 2,
                py: 1.25,
                bgcolor: '#fff',
                boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                transition: 'border-color 200ms, box-shadow 200ms',
                '&:focus-within': {
                  borderColor: '#6366F1',
                  boxShadow: '0 2px 20px rgba(99,102,241,0.12)',
                },
              }}
            >
              <InputBase
                inputRef={inputRef}
                fullWidth
                multiline
                maxRows={6}
                placeholder="Message Sushruth AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                sx={{ fontSize: 15, fontFamily: '"Manrope",sans-serif', color: '#111827', flex: 1, py: 0.25 }}
              />
              <IconButton
                onClick={typing ? () => setTyping(false) : () => sendMessage(input)}
                size="small"
                sx={{
                  width: 34,
                  height: 34,
                  flexShrink: 0,
                  mb: 0.25,
                  bgcolor: (input.trim() && !typing) || typing ? '#111827' : '#F3F4F6',
                  borderRadius: '10px',
                  color: (input.trim() && !typing) || typing ? '#fff' : '#9CA3AF',
                  transition: 'all 180ms',
                  '&:hover': { opacity: 0.85 },
                }}
              >
                {typing ? <StopRoundedIcon sx={{ fontSize: 16 }} /> : <SendRoundedIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Box>
            <Typography sx={{ fontSize: 11.5, color: '#9CA3AF', textAlign: 'center', mt: 1.25 }}>
              Sushruth AI can make mistakes. Always consult a qualified doctor for medical decisions.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
