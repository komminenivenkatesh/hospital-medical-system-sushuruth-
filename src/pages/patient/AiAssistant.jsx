import { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, InputBase, Avatar, Button, Tooltip, Divider } from '@mui/material';
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
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';

const SIDEBAR_W = 260;

const pastConversations = [
  { id: 'c1', title: 'Migraine symptoms explained', time: 'Today' },
  { id: 'c2', title: 'Blood pressure medication', time: 'Yesterday' },
  { id: 'c3', title: 'Sleep and anxiety management', time: 'Yesterday' },
  { id: 'c4', title: 'Heart health tips', time: 'Mon' },
  { id: 'c5', title: 'Understanding MRI report', time: 'Mon' },
  { id: 'c6', title: 'Diabetes diet plan', time: 'Last week' },
  { id: 'c7', title: 'Back pain exercises', time: 'Last week' },
];

const suggestions = [
  { icon: MonitorHeartRoundedIcon, label: 'Check my symptoms', prompt: 'I have a persistent headache and mild fever for the past 2 days. What could it be?' },
  { icon: PersonSearchRoundedIcon, label: 'Find a specialist', prompt: 'Which type of doctor should I see for recurring migraines?' },
  { icon: MedicationRoundedIcon, label: 'Drug interactions', prompt: 'Can I take ibuprofen with blood pressure medication?' },
  { icon: BiotechRoundedIcon, label: 'Explain my report', prompt: 'My MRI report says "mild white matter changes". What does that mean?' },
  { icon: FavoriteRoundedIcon, label: 'Heart health tips', prompt: 'What lifestyle changes can help reduce my risk of heart disease?' },
  { icon: PsychologyRoundedIcon, label: 'Mental wellness', prompt: 'I have been feeling anxious and unable to sleep. What should I do?' },
];

const aiReplies = {
  'I have a persistent headache and mild fever for the past 2 days. What could it be?':
    `Based on your symptoms — headache and mild fever lasting 2 days — here are the most common possibilities:\n\n**Viral infection (most likely):** A common cold or flu often presents this way. Rest, hydration, and paracetamol usually help.\n\n**Sinusitis:** If the headache is around your forehead or cheeks, sinus inflammation could be the cause.\n\n**Tension headache with early infection:** Stress combined with an oncoming infection can trigger this pattern.\n\n> ⚠️ **See a doctor if:** fever exceeds 39°C, headache is severe or sudden, you have neck stiffness, or symptoms worsen after 72 hours.\n\nWould you like me to help you find a General Physician nearby?`,
  'Which type of doctor should I see for recurring migraines?':
    `For recurring migraines, you should consult a **Neurologist** — specifically one who specialises in headache disorders.\n\n**Why a Neurologist?**\n- They can accurately diagnose migraine type (with or without aura)\n- Prescribe preventive medications (topiramate, propranolol, amitriptyline)\n- Rule out other neurological causes\n\n**First step:** Start with a General Physician who can refer you. For frequent migraines (more than 4 per month), go directly to a Neurologist.\n\nWe have **3 highly-rated Neurologists** available this week on Sushruth. Would you like me to show their profiles?`,
  'Can I take ibuprofen with blood pressure medication?':
    `It depends on which blood pressure medication you're taking, but generally **ibuprofen and BP medications can interact negatively**.\n\n**Known interactions:**\n- **ACE inhibitors / ARBs** (lisinopril, losartan): NSAIDs like ibuprofen can reduce their effectiveness and raise BP\n- **Diuretics** (furosemide): Reduced efficacy and possible kidney stress\n- **Beta-blockers:** Some reduction in BP-lowering effect\n\n**Safer alternatives for pain:**\n- ✓ Paracetamol (acetaminophen) — generally safe with most BP medications\n- ✓ Short-term low-dose ibuprofen if no kidney issues and BP is controlled\n\nAlways consult your prescribing doctor before combining medications. Would you like to speak to a doctor now?`,
  'My MRI report says "mild white matter changes". What does that mean?':
    `"Mild white matter changes" (also called white matter hyperintensities) are areas seen on MRI scans where the brain tissue appears slightly different.\n\n**What they are:**\nSmall areas in the brain's white matter that appear brighter on MRI. They're very common — found in 60–80% of adults over 60.\n\n**Common causes:**\n- Normal aging process\n- Chronic high blood pressure\n- Migraines with aura\n- High cholesterol or diabetes\n\n**"Mild" changes:**\nUsually not a cause for immediate alarm, but worth monitoring. Addressing underlying risk factors (BP, cholesterol, blood sugar) is recommended.\n\n> 📋 **Next step:** Share this report with a Neurologist for proper interpretation in the context of your symptoms and medical history. Shall I help you book a consultation?`,
  'What lifestyle changes can help reduce my risk of heart disease?':
    `Here are evidence-based lifestyle changes that significantly reduce heart disease risk:\n\n**Diet**\n- Follow a Mediterranean-style diet: olive oil, fish, nuts, legumes, vegetables\n- Limit saturated fats, processed foods, and sodium\n- Reduce added sugar intake\n\n**Physical activity**\n- 150 minutes per week of moderate activity (brisk walking, cycling, swimming)\n- Include strength training 2 times per week\n\n**Habits**\n- Quit smoking — risk halves within 1 year of stopping\n- Limit alcohol to 1–2 units per day\n- Manage chronic stress with yoga, meditation, or therapy\n- Sleep 7–9 hours consistently\n\n**Regular monitoring**\n- Check blood pressure, cholesterol, and blood sugar at least once a year\n\nWould you like a personalised wellness plan or a referral to a cardiologist?`,
  'I have been feeling anxious and unable to sleep. What should I do?':
    `Anxiety and sleep difficulties often go hand-in-hand and are very common. Here is what can help:\n\n**Immediate steps to try:**\n- **Sleep hygiene:** Fixed sleep and wake times, no screens 1 hour before bed, keep the room cool and dark\n- **Breathing exercises:** Box breathing (inhale 4 counts, hold 4, exhale 4, hold 4) reduces acute anxiety quickly\n- **Progressive muscle relaxation:** Tense and release each muscle group from feet upward\n- **Reduce stimulants:** Avoid caffeine after 2 PM\n\n**When to seek professional help:**\nIf this has lasted more than 2 weeks or is affecting your work, relationships, or daily functioning.\n\n**Options available:**\n- **Psychiatrist** — can evaluate and prescribe medication if needed\n- **Psychologist or therapist** — CBT (Cognitive Behavioural Therapy) is highly effective for anxiety and insomnia\n- **General Physician** — good first step for assessment and referral\n\nYou are not alone — anxiety and sleep issues are among the most treatable conditions. Would you like me to connect you with a mental health specialist on Sushruth?`,
};

const defaultReply = (q) =>
  `Thank you for your question about: **"${q}"**\n\nWhile I can provide general health information and guidance, for an accurate diagnosis and personalised treatment plan, a consultation with one of our qualified doctors is recommended.\n\nHere is how I can help:\n- Find the right specialist for your concern\n- Explain medical terms or test results\n- Provide evidence-based health information\n- Help you prepare for your appointment\n\nWould you like me to help you find the right doctor, or do you have a more specific health question I can answer?`;

function renderText(text) {
  return text.split('\n').map((line, i) => {
    const html = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^> (.+)/, '<span style="display:block;padding:8px 12px;background:rgba(15,82,186,0.06);border-left:3px solid #0F52BA;border-radius:0 8px 8px 0;margin:4px 0">$1</span>');
    return <p key={i} style={{ margin: '3px 0', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />;
  });
}

function TypingDots() {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, py: 0.25 }}>
      {[0, 1, 2].map((i) => (
        <motion.div key={i}
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim() || typing) return;
    const userMsg = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = aiReplies[text.trim()] || defaultReply(text.trim());
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    }, 1200 + Math.random() * 800);
  };

  const newChat = () => {
    setMessages([]);
    setActiveConv(null);
    setInput('');
    inputRef.current?.focus();
  };

  const isEmpty = messages.length === 0;
  const groups = ['Today', 'Yesterday', 'Mon', 'Last week'];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: '"Manrope", sans-serif' }}>

      {/* ── Sidebar ── */}
      <Box sx={{
        width: sidebarOpen ? SIDEBAR_W : 0,
        flexShrink: 0,
        overflow: 'hidden',
        bgcolor: '#111827',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 250ms cubic-bezier(0.4,0,0.2,1)',
        borderRight: '1px solid #1F2937',
      }}>
        <Box sx={{ minWidth: SIDEBAR_W, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, pt: 2.5, pb: 1.5 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: '9px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#fff' }} />
            </Box>
            <Typography sx={{ fontWeight: 800, color: '#F9FAFB', fontSize: 15, letterSpacing: '-0.01em' }}>
              Sushruth AI
            </Typography>
          </Box>

          {/* New chat */}
          <Box sx={{ px: 1.5, pb: 1 }}>
            <Button fullWidth startIcon={<AddRoundedIcon sx={{ fontSize: 17 }} />} onClick={newChat}
              sx={{
                justifyContent: 'flex-start', textTransform: 'none', fontWeight: 600, fontSize: 13.5,
                color: '#F9FAFB', bgcolor: '#1F2937', borderRadius: '10px', py: 1.1, px: 1.5,
                '&:hover': { bgcolor: '#374151' }, transition: 'background 150ms',
              }}>
              New chat
            </Button>
          </Box>

          {/* Conversation history */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 1,
            '&::-webkit-scrollbar': { width: 3 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#374151', borderRadius: 100 },
          }}>
            {groups.map((group) => {
              const items = pastConversations.filter((c) => c.time === group);
              if (!items.length) return null;
              return (
                <Box key={group} sx={{ mb: 1.5 }}>
                  <Typography sx={{ px: 1.5, py: 0.5, fontSize: 10.5, fontWeight: 700, color: '#6B7280',
                    textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {group}
                  </Typography>
                  {items.map((c) => (
                    <Box key={c.id} onClick={() => { setActiveConv(c.id); setMessages([]); }}
                      sx={{
                        px: 1.5, py: 0.85, borderRadius: '8px', cursor: 'pointer',
                        bgcolor: activeConv === c.id ? '#1F2937' : 'transparent',
                        '&:hover': { bgcolor: '#1F2937' }, transition: 'background 120ms',
                      }}>
                      <Typography sx={{
                        fontSize: 13.5, color: activeConv === c.id ? '#F9FAFB' : '#9CA3AF',
                        fontWeight: activeConv === c.id ? 600 : 400,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {c.title}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ borderColor: '#1F2937' }} />

          {/* User + back */}
          <Box sx={{ p: 1.5 }}>
            <Box onClick={() => navigate('/dashboard')}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, borderRadius: '10px',
                cursor: 'pointer', '&:hover': { bgcolor: '#1F2937' }, transition: 'background 150ms', mb: 0.5 }}>
              <ArrowBackRoundedIcon sx={{ fontSize: 17, color: '#6B7280' }} />
              <Typography sx={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>Back to app</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, borderRadius: '10px' }}>
              <Avatar src="https://randomuser.me/api/portraits/women/65.jpg" sx={{ width: 28, height: 28 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, color: '#F9FAFB', fontWeight: 600, lineHeight: 1.2 }}>Meera Sharma</Typography>
                <Typography sx={{ fontSize: 11, color: '#6B7280' }}>Free plan</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Main area ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff', minWidth: 0, overflow: 'hidden' }}>

        {/* Top bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
          <IconButton size="small" onClick={() => setSidebarOpen((v) => !v)}
            sx={{ color: '#6B7280', '&:hover': { bgcolor: '#F9FAFB' } }}>
            <MenuRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 'auto' }}>
            <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#8B5CF6' }} />
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>Sushruth AI</Typography>
            <Box sx={{ px: 1, py: 0.25, borderRadius: '6px', bgcolor: '#F3F0FF', border: '1px solid #DDD6FE' }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#7C3AED' }}>Beta</Typography>
            </Box>
          </Box>
          <Box sx={{ width: 32 }} />
        </Box>

        {/* Messages / Welcome */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 0 },
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 100 },
        }}>
          <AnimatePresence mode="wait">
            {isEmpty ? (
              /* Welcome screen */
              <motion.div key="welcome"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ maxWidth: 680, margin: '0 auto', padding: '40px 16px 24px' }}>
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                  <Box sx={{ width: 52, height: 52, borderRadius: '16px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
                    boxShadow: '0 6px 20px rgba(99,102,241,0.35)' }}>
                    <AutoAwesomeRoundedIcon sx={{ color: '#fff', fontSize: 26 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 28 }, color: '#111827', letterSpacing: '-0.02em', mb: 1 }}>
                    How can I help you today?
                  </Typography>
                  <Typography sx={{ fontSize: 15, color: '#6B7280' }}>
                    Ask me about symptoms, medications, reports, or finding the right doctor.
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1.5 }}>
                  {suggestions.map((s) => {
                    const Icon = s.icon;
                    return (
                      <Box key={s.label} onClick={() => sendMessage(s.prompt)}
                        sx={{
                          p: 2, borderRadius: '14px', border: '1px solid #E5E7EB',
                          cursor: 'pointer', bgcolor: '#FAFAFA',
                          transition: 'all 160ms ease',
                          '&:hover': { border: '1px solid #6366F1', bgcolor: '#F5F3FF', transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(99,102,241,0.12)' },
                        }}>
                        <Icon sx={{ fontSize: 22, color: '#8B5CF6', mb: 1.25, display: 'block' }} />
                        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>{s.label}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </motion.div>
            ) : (
              /* Chat messages */
              <motion.div key="chat"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 8px' }}>
                {messages.map((msg, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}>
                    {msg.role === 'user' ? (
                      /* User message — right aligned pill */
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                        <Box sx={{
                          maxWidth: '75%', px: 2.5, py: 1.75,
                          bgcolor: '#111827', borderRadius: '18px 18px 4px 18px',
                        }}>
                          <Typography sx={{ fontSize: 14.5, color: '#F9FAFB', lineHeight: 1.65, fontFamily: '"Manrope",sans-serif' }}>
                            {msg.text}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      /* AI message — left, no bubble */
                      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        <Box sx={{
                          width: 28, height: 28, borderRadius: '8px', flexShrink: 0,
                          background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.25,
                        }}>
                          <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: '#fff' }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography component="div" sx={{
                            fontSize: 14.5, color: '#111827', lineHeight: 1.75,
                            fontFamily: '"Manrope",sans-serif',
                            '& strong': { fontWeight: 700 },
                            '& p': { margin: '4px 0' },
                          }}>
                            {renderText(msg.text)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </motion.div>
                ))}

                {typing && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                      <Box sx={{ width: 28, height: 28, borderRadius: '8px', flexShrink: 0,
                        background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <Box sx={{
              display: 'flex', alignItems: 'flex-end', gap: 1,
              border: '1.5px solid #E5E7EB',
              borderRadius: '16px',
              px: 2, py: 1.25,
              bgcolor: '#fff',
              boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
              transition: 'border-color 200ms, box-shadow 200ms',
              '&:focus-within': {
                borderColor: '#6366F1',
                boxShadow: '0 2px 20px rgba(99,102,241,0.12)',
              },
            }}>
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
                  width: 34, height: 34, flexShrink: 0, mb: 0.25,
                  bgcolor: (input.trim() && !typing) || typing ? '#111827' : '#F3F4F6',
                  borderRadius: '10px',
                  color: (input.trim() && !typing) || typing ? '#fff' : '#9CA3AF',
                  transition: 'all 180ms',
                  '&:hover': { opacity: 0.85 },
                }}
              >
                {typing
                  ? <StopRoundedIcon sx={{ fontSize: 16 }} />
                  : <SendRoundedIcon sx={{ fontSize: 16 }} />}
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
