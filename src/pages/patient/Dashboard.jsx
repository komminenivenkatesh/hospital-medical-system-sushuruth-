import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip, Avatar, IconButton,
  OutlinedInput, InputAdornment, Stack, Divider, LinearProgress, CircularProgress,
} from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import BiotechRoundedIcon from '@mui/icons-material/BiotechRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import HeightRoundedIcon from '@mui/icons-material/HeightRounded';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import BedRoundedIcon from '@mui/icons-material/BedRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition, { SectionReveal, containerVariants, itemVariants } from '../../components/PageTransition';
import SmartImage from '../../components/SmartImage';
import SectionCard, { DoctorAttribution } from '../../components/SectionCard';
import { tokens } from '../../theme/theme';
import useStore from '../../store/useStore';
import { scenes, patientPhotos, doctorPhotos } from '../../data/assets';
import { appointments, schedule } from '../../data/appointments';

/* ── Dashboard Hero Banner ─────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const quickActions = [
  { label: 'Book Appointment', icon: CalendarMonthRoundedIcon, color: tokens.primary, path: '/find-doctors' },
  { label: 'AI MRI Analysis', icon: BiotechRoundedIcon, color: '#7C3AED', path: '/mri' },
  { label: 'Health Records', icon: FolderOpenRoundedIcon, color: tokens.success, path: '/health' },
  { label: 'Video Consult', icon: PhoneInTalkOutlinedIcon, color: '#0D9488', path: '/find-doctors' },
];

function DashboardHero({ patient, navigate }) {
  const [healthScore] = useState(82);

  return (
    <SectionReveal>
      <Box
        sx={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0F52BA 0%, #0A3D8F 60%, #0D2E6E 100%)',
          p: { xs: 3, md: 4 },
          mb: 3,
        }}
      >
        {/* Background decorations */}
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: '40%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(13,148,136,0.18)' }} />
        <Box sx={{ position: 'absolute', top: '20%', right: '30%', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', mb: 1 }}>
                {getGreeting()} ☀️
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 28 }, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.2, mb: 1 }}>
                {patient.name}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, mb: 3 }}>
                Your next checkup is in <Box component="span" sx={{ color: '#5EEAD4', fontWeight: 700 }}>3 days</Box>. Stay on track with your health journey.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  onClick={() => navigate('/find-doctors')}
                  sx={{
                    bgcolor: '#fff', color: tokens.primary, fontWeight: 700, fontSize: 13,
                    borderRadius: '10px', px: 2.5, py: 1,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)', transform: 'translateY(-1px)' },
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    transition: 'all 200ms ease',
                  }}
                >
                  Book Now
                </Button>
                <Button
                  onClick={() => navigate('/health')}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, fontSize: 13,
                    borderRadius: '10px', px: 2.5, py: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    transition: 'all 200ms ease',
                  }}
                >
                  View Records
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Health Score Ring */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={3}
                  sx={{ color: 'rgba(255,255,255,0.1)', position: 'absolute' }}
                />
                <CircularProgress
                  variant="determinate"
                  value={healthScore}
                  size={120}
                  thickness={3}
                  sx={{ color: '#5EEAD4' }}
                />
                <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 28, color: '#fff', lineHeight: 1 }}>{healthScore}</Typography>
                  <Typography sx={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Health Score</Typography>
                </Box>
              </Box>
            </motion.div>

            {/* Quick stats next to ring */}
            <Box sx={{ ml: 3, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'Appointments', value: '12', sub: 'this year' },
                { label: 'Doctors Visited', value: '5', sub: 'trusted' },
                { label: 'Reports Stored', value: '24', sub: 'in vault' },
              ].map((stat) => (
                <Box key={stat.label}>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#fff', lineHeight: 1 }}>{stat.value}</Typography>
                  <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{stat.label} · {stat.sub}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Quick Action Pills */}
        <Box sx={{ display: 'flex', gap: 1.5, mt: 3, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {quickActions.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Box
                onClick={() => navigate(a.path)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  px: 2, py: 1,
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 200ms ease',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' },
                }}
              >
                <a.icon sx={{ fontSize: 16, color: '#fff' }} />
                <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>{a.label}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </SectionReveal>
  );
}

/* ─────────────────────────────────────────────── */

const heroArticle = {
  img: scenes.article2,
  title: "Unlock Your Brain's Full Potential with Better Sleep",
};

const latestNews = [
  { tag: 'Neurology', title: 'Discover the Hidden Gems: New Migraine Treatments', desc: 'Embark on a journey beyond the standard treatments. Our handpicked latest therapies promise unique experiences...' },
  { tag: 'Nutrition', title: 'Epicurean Adventures: Diets That Will Satisfy Your Brain', desc: 'Indulge your senses in a culinary exploration like never before. Our brain-boosting foods promise not just delectable dishes but better cognitive health.' }
];

const recommendedArticles = [
  { tag: 'Wellness', date: 'November 23, 2024', title: 'Thrill-Seeker\'s Guide: Adrenaline and Mental Health', desc: 'Calling all adrenaline junkies! Brace yourself for heart-pounding adventures and see how they affect your brain chemistry.', subTags: ['Adventure', 'Nature'] },
  { tag: 'Psychiatry', date: 'September 13, 2024', title: 'Island Hopping: Unwind Your Mind on Pristine Beaches', desc: 'Escape to sun-kissed shores and turquoise waters. Unwind on pristine beaches and explore how nature reduces anxiety.', subTags: ['Ocean', 'Beach'] },
  { tag: 'Lifestyle', date: 'August 12, 2024', title: 'Artistic Wanderlust: Cultural Tours for Cognitive Longevity', desc: 'Embark on a cultural odyssey that celebrates the world\'s artistic tapestry. Dive deep into how art improves neuroplasticity.', subTags: ['Culture', 'Art'] },
  { tag: 'Fitness', date: 'July 05, 2024', title: 'Nature\'s Symphony: Eco-Friendly Workouts for the Brain', desc: 'Join us on a journey where sustainability meets fitness. Explore breathtaking natural trails while improving your memory.', subTags: ['Eco-Travel', 'Nature'] },
];

const hospitals = [
  { id: 'h001', name: 'Apollo Hospitals', city: 'Hyderabad, Telangana', rating: 4.8, type: 'Multi-Specialty', img: scenes.lab, accreditation: 'JCI' },
  { id: 'h002', name: 'Fortis Hospital', city: 'Mumbai, Maharashtra', rating: 4.7, type: 'Super-Specialty', img: scenes.heart, accreditation: 'NABH' },
  { id: 'h003', name: 'AIIMS New Delhi', city: 'New Delhi, NCR', rating: 4.9, type: 'Academic Medical Centre', img: scenes.wellness, accreditation: 'NABL' },
];

const bloodTests = [
  { label: 'CRP', value: '1.8 mg/L', sub: 'Slightly elevated', color: '#F59E0B' },
  { label: 'WBC', value: '8,500/μL', sub: 'No infection', color: tokens.primary },
  { label: 'ESR', value: '12 mm/hr', sub: 'No issues', color: tokens.success },
  { label: 'HGB', value: '15.1 g/dL', sub: 'No anemia', color: tokens.primary },
];

const specialtyCards = [
  { icon: PsychologyRoundedIcon, title: 'Neurology', desc: 'Headaches, migraines', color: tokens.primary },
  { icon: FavoriteRoundedIcon, title: 'Cardiology', desc: 'Heart, blood pressure', color: '#EF4444' },
  { icon: ScienceRoundedIcon, title: 'Dermatology', desc: 'Skin, hair care', color: '#F59E0B' },
  { icon: MedicalServicesRoundedIcon, title: 'Psychiatry', desc: 'Anxiety, mood', color: '#7C3AED' },
];

function AIChatBot({ navigate }) {
  const [messages, setMessages] = useState([
    { id: 0, from: 'ai', text: "Hi Meera! Describe your symptoms and I'll find the right specialist for you." },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const doctors = useStore((s) => s.doctors);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);
  const send = () => {
    const text = input.trim(); if (!text) return;
    const l = text.toLowerCase();
    let response = { text: "Describe your symptoms — e.g. 'headache', 'heart pain' — and I'll find the right doctor.", doctor: null };
    if (l.match(/headache|migraine|brain|neuro/)) response = { text: 'For headaches I recommend Dr. Arvind Rao, Neurology Specialist.', doctor: 'd001' };
    else if (l.match(/heart|chest|cardio|bp/)) response = { text: 'For heart concerns, Dr. Priya Mehta is an excellent Cardiologist.', doctor: 'd002' };
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: 'user', text },
      { id: Date.now() + 1, from: 'ai', text: response.text, doctorId: response.doctor },
    ]);
    setInput('');
  };
  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 1.5, background: tokens.blueGradient, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SmartToyOutlinedIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Sushruth AI</Typography>
        <Box sx={{ ml: 'auto', width: 7, height: 7, borderRadius: '50%', bgcolor: '#4ADE80' }} />
      </Box>
      <Box sx={{ height: 200, overflowY: 'auto', px: 2, py: 1.5, bgcolor: tokens.surfaceMuted }}>
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
              <Box sx={{ maxWidth: '85%' }}>
                <Box sx={{ px: 1.75, py: 1.1,
                  bgcolor: m.from === 'user' ? tokens.primary : '#fff',
                  color: m.from === 'user' ? '#fff' : tokens.textPrimary,
                  borderRadius: 2.5, boxShadow: m.from === 'ai' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>
                  <Typography sx={{ fontSize: 12.5, lineHeight: 1.5 }}>{m.text}</Typography>
                </Box>
                {m.doctorId && (() => {
                  const doc = doctors.find((d) => d.id === m.doctorId);
                  if (!doc) return null;
                  return (
                    <Box sx={{ mt: 0.75, p: 1.25, bgcolor: '#fff', borderRadius: 2, border: `1px solid ${tokens.border}`,
                      display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                      onClick={() => navigate(`/booking/${doc.id}`)}>
                      <Avatar src={doc.photo} sx={{ width: 30, height: 30 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 11.5 }} noWrap>{doc.name}</Typography>
                        <Typography sx={{ fontSize: 10.5, color: tokens.textSecondary }}>{doc.specialty}</Typography>
                      </Box>
                      <Button size="small" variant="contained" sx={{ px: 1.25, py: 0.2, fontSize: 10, minWidth: 0 }}>Book</Button>
                    </Box>
                  );
                })()}
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </Box>
      <Box sx={{ p: 1.25, borderTop: `1px solid ${tokens.border}`, bgcolor: '#fff' }}>
        <OutlinedInput fullWidth size="small" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
          placeholder="Describe your symptoms..."
          sx={{ bgcolor: tokens.surfaceMuted, '& fieldset': { borderColor: 'transparent' }, fontSize: 12.5 }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={send} size="small"
                sx={{ bgcolor: tokens.primary, color: '#fff', '&:hover': { bgcolor: tokens.primaryDark }, width: 28, height: 28 }}>
                <SendRoundedIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const patient = useStore((s) => s.patient);
  const doctors = useStore((s) => s.doctors);

  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');

  return (
    <PageTransition>
      {/* ── HERO BANNER ── */}
      <DashboardHero patient={patient} navigate={navigate} />

      <Grid container spacing={2}>

        {/* ─── LEFT COLUMN ─── */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={2}>

            {/* Patient card — like reference */}
            <SectionCard title="Patient" arrow action={() => navigate('/profile')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Avatar src={patientPhotos.meera}
                  sx={{ width: 48, height: 48, bgcolor: tokens.primarySoft, color: tokens.primary, fontWeight: 800, border: `2px solid ${tokens.primary}` }}>
                  MS
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{patient.name}</Typography>
                  <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{patient.gender}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {[
                  { icon: PersonOutlineRoundedIcon, label: 'Age', value: `${patient.age} years` },
                  { icon: MonitorWeightOutlinedIcon, label: 'Weight', value: '58 kg' },
                  { icon: HeightRoundedIcon, label: 'Height', value: '163 cm' },
                  { icon: BloodtypeOutlinedIcon, label: 'Blood', value: patient.bloodGroup },
                ].map((f) => (
                  <Box key={f.label} sx={{ p: 1.25, bgcolor: tokens.surfaceMuted, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <f.icon sx={{ fontSize: 16, color: tokens.textTertiary }} />
                    <Box>
                      <Typography sx={{ fontSize: 10, color: tokens.textTertiary, lineHeight: 1.1 }}>{f.label}</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{f.value}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </SectionCard>

            {/* Appointments — like reference with active highlight */}
            <SectionCard title="Appointments" arrow action={() => navigate('/appointments')}>
              <Stack spacing={0.5}>
                {upcomingAppointments.map((a, i) => {
                  const isFirst = i === 0;
                  return (
                    <Box key={a.id} onClick={() => navigate(`/appointments/${a.id}`)}
                      sx={{ p: 1.5, borderRadius: 2.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5,
                        bgcolor: isFirst ? tokens.primary : 'transparent',
                        '&:hover': { bgcolor: isFirst ? tokens.primary : tokens.surfaceMuted } }}>
                      <Avatar src={a.photo} sx={{ width: 36, height: 36 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 11, color: isFirst ? 'rgba(255,255,255,0.7)' : tokens.textTertiary }}>
                          {a.date}
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: 13, color: isFirst ? '#fff' : tokens.textPrimary }} noWrap>
                          {a.reason}
                        </Typography>
                      </Box>
                      {!isFirst && <ArrowForwardRoundedIcon sx={{ fontSize: 16, color: tokens.textTertiary }} />}
                    </Box>
                  );
                })}
              </Stack>
            </SectionCard>

            {/* Latest blood test — like reference */}
            <SectionCard title="Latest blood test" arrow action={() => navigate('/health')}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {bloodTests.map((b) => (
                  <Box key={b.label} sx={{ p: 1.25, bgcolor: tokens.surfaceMuted, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                      <Chip label={b.label} size="small"
                        sx={{ bgcolor: `${b.color}18`, color: b.color, fontWeight: 700, fontSize: 10, height: 20 }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 700, ml: 'auto' }}>{b.value}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 10, color: tokens.textTertiary }}>{b.sub}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <DoctorAttribution photo={doctorPhotos.rajesh} name="Dr. Rajesh Kumar" date="April 28, 2026" small />
              </Box>
            </SectionCard>
          </Stack>
        </Grid>

        {/* ─── CENTER COLUMN ─── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>

            {/* Quick stats row */}
            <Grid container spacing={1.5}>
              {[
                { icon: CalendarMonthRoundedIcon, label: 'Appointments', value: upcomingAppointments.length, sub: 'upcoming', color: tokens.primary },
                { icon: BiotechRoundedIcon, label: 'MRI Reports', value: '3', sub: 'analysed', color: tokens.success },
                { icon: FolderOpenRoundedIcon, label: 'Documents', value: '13', sub: 'stored', color: '#7C3AED' },
              ].map((s) => (
                <Grid key={s.label} size={4}>
                  <Card sx={{ cursor: 'pointer', '&:hover': { borderColor: s.color } }}
                    onClick={() => navigate(s.label === 'Appointments' ? '/appointments' : s.label === 'MRI Reports' ? '/mri' : '/health')}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: `${s.color}12`, mx: 'auto', mb: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <s.icon sx={{ fontSize: 20, color: s.color }} />
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 28, color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                      <Typography sx={{ fontSize: 11, color: tokens.textSecondary, fontWeight: 600 }}>{s.sub}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Schedule timeline — clean version */}
            <SectionCard title="This Week's Schedule" arrow action={() => navigate('/appointments')}>
              <Stack spacing={0}>
                {schedule.map((s, i) => (
                  <Box key={s.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5,
                    borderBottom: i < schedule.length - 1 ? `1px solid ${tokens.border}` : 'none' }}>
                    <Box sx={{ width: 52, textAlign: 'center', flexShrink: 0 }}>
                      <Typography sx={{ fontSize: 11, color: tokens.textTertiary, fontWeight: 500 }}>
                        {new Date(s.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                      </Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 800, color: tokens.textPrimary }}>
                        {new Date(s.date).getDate()}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 1.5, bgcolor: s.chipColor === 'primary' ? tokens.primarySoft : tokens.successSoft,
                      borderRadius: 2, borderLeft: `3px solid ${s.chipColor === 'primary' ? tokens.primary : tokens.success}` }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.25 }}>{s.title}</Typography>
                      <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{s.subtitle} · {s.time}</Typography>
                    </Box>
                    <Chip label={s.chipLabel} size="small"
                      sx={{ bgcolor: s.chipColor === 'primary' ? tokens.primarySoft : tokens.successSoft,
                        color: s.chipColor === 'primary' ? tokens.primary : tokens.success,
                        fontWeight: 700, fontSize: 10, height: 22 }} />
                  </Box>
                ))}
              </Stack>
            </SectionCard>

            {/* AI Symptom Checker */}
            <SectionCard title="AI Symptom Checker" arrow>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <AIChatBot navigate={navigate} />
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Grid container spacing={1.5}>
                    {specialtyCards.map(({ icon: Icon, title, desc, color }) => (
                      <Grid key={title} size={6}>
                        <Card sx={{ cursor: 'pointer', '&:hover': { borderColor: color, transform: 'translateY(-2px)' },
                          transition: 'all 200ms ease', height: '100%' }}
                          onClick={() => navigate('/find-doctors')}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: `${color}12`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                              <Icon sx={{ fontSize: 20, color }} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 0.25 }}>{title}</Typography>
                            <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{desc}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </SectionCard>
          </Stack>
        </Grid>

        {/* ─── RIGHT COLUMN ─── */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={2}>

            {/* Quick Actions */}
            <SectionCard title="Quick Actions" arrow>
              <Stack spacing={0.75}>
                {[
                  { label: 'Book Appointment', path: '/find-doctors', primary: true },
                  { label: 'Upload MRI Scan', path: '/mri' },
                  { label: 'View Documents', path: '/health' },
                  { label: 'Message Doctor', path: '/chat' },
                ].map(({ label, path, primary }) => (
                  <Box key={label} onClick={() => navigate(path)}
                    sx={{ px: 1.75, py: 1.1, borderRadius: 2, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      bgcolor: primary ? tokens.primary : tokens.surfaceMuted,
                      '&:hover': { bgcolor: primary ? tokens.primaryDark : tokens.border },
                      transition: 'background 150ms ease' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: primary ? '#fff' : tokens.textPrimary }}>
                      {label}
                    </Typography>
                    <EastRoundedIcon sx={{ fontSize: 14, color: primary ? 'rgba(255,255,255,0.7)' : tokens.textTertiary }} />
                  </Box>
                ))}
              </Stack>
            </SectionCard>

            {/* Next Appointment card */}
            <SectionCard title="Next Appointment" arrow action={() => navigate('/appointments')}>
              {upcomingAppointments[0] && (() => {
                const a = upcomingAppointments[0];
                return (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar src={a.photo} sx={{ width: 48, height: 48, border: `2px solid ${tokens.border}` }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{a.doctorName}</Typography>
                        <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{a.specialty}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                      <Box sx={{ p: 1.25, bgcolor: tokens.surfaceMuted, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: tokens.textTertiary }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{a.date}</Typography>
                      </Box>
                      <Box sx={{ p: 1.25, bgcolor: tokens.surfaceMuted, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeRoundedIcon sx={{ fontSize: 14, color: tokens.textTertiary }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{a.time}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button fullWidth variant="contained" size="small" sx={{ fontWeight: 700 }}
                        onClick={() => navigate(`/consult/${a.id}`)}>
                        Join Call
                      </Button>
                      <Button fullWidth variant="outlined" size="small" sx={{ fontWeight: 700 }}
                        onClick={() => navigate(`/appointments/${a.id}`)}>
                        Details
                      </Button>
                    </Box>
                  </>
                );
              })()}
            </SectionCard>

            {/* Today's queue */}
            <SectionCard title="Today's Queue" arrow action={() => navigate('/appointments')}>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {[
                  { time: '11:00 AM', name: 'Dr. Arvind Rao', spec: 'Neurology', photo: doctorPhotos.arvind },
                  { time: '1:00 PM', name: 'Dr. Priya Mehta', spec: 'Cardiology', photo: doctorPhotos.priya },
                ].map((q) => (
                  <Grid key={q.time} size={6}>
                    <Box sx={{ p: 1.5, bgcolor: tokens.surfaceMuted, borderRadius: 2.5, cursor: 'pointer',
                      '&:hover': { bgcolor: tokens.primarySoft }, transition: 'background 150ms ease' }}
                      onClick={() => navigate('/appointments')}>
                      <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{q.time}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75 }}>
                        <Avatar src={q.photo} sx={{ width: 24, height: 24 }} />
                        <Box>
                          <Typography sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2 }} noWrap>
                            {q.name.split(' ').slice(-1)[0]}
                          </Typography>
                          <Typography sx={{ fontSize: 10, color: tokens.textTertiary }}>{q.spec}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => navigate('/chat')}
                  sx={{ width: 40, height: 40, bgcolor: tokens.textPrimary, color: '#fff', '&:hover': { bgcolor: '#1f2937' } }}>
                  <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton sx={{ width: 40, height: 40, border: `1.5px solid ${tokens.border}`, color: tokens.textSecondary }}>
                  <PhoneInTalkOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Button fullWidth variant="contained" endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => navigate('/find-doctors')}
                  sx={{ height: 40, borderRadius: 100, fontWeight: 700, fontSize: 13 }}>
                  Book Now
                </Button>
              </Box>
            </SectionCard>

          </Stack>
        </Grid>
      </Grid>

      {/* ══ PARTNER HOSPITALS ══ */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
              Trusted Hospitals, Nationwide
            </Typography>
            <Typography sx={{ fontSize: 13, color: tokens.textSecondary, mt: 0.25 }}>
              Book at accredited hospitals with verified specialists
            </Typography>
          </Box>
          <Button variant="outlined" endIcon={<EastRoundedIcon />} onClick={() => navigate('/hospitals')}
            sx={{ borderRadius: 100, px: 2.5, fontWeight: 700 }}>
            View All
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {hospitals.map((h, i) => (
            <Card key={h.name} onClick={() => navigate(`/hospitals/${h.id}`)}
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                bgcolor: '#fff',
                borderRadius: 4,
                boxShadow: 'none',
                border: `1px solid ${tokens.border}`,
                cursor: 'pointer',
                '&:hover': { borderColor: tokens.primary, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' },
                transition: 'all 200ms ease',
                p: 2
              }}>
              
              {/* Left Image Area */}
              <Box sx={{ position: 'relative', width: { xs: '100%', md: 320 }, height: { xs: 200, md: 'auto' }, minHeight: 220, flexShrink: 0, borderRadius: 3, overflow: 'hidden' }}>
                <SmartImage src={h.img} alt={h.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <Button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/hospitals/${h.id}`); }}
                  sx={{ position: 'absolute', bottom: 12, left: 12, bgcolor: '#fff', color: '#1A1A1A', fontSize: 12, fontWeight: 700, borderRadius: 6, px: 2.5, py: 0.5, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { bgcolor: '#f0f0f0' }, textTransform: 'none' }}>
                  More details
                </Button>
              </Box>

              {/* Middle Content Area */}
              <Box sx={{ flex: 1, px: { xs: 0, md: 4 }, py: { xs: 3, md: 1 }, display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 500, color: tokens.textPrimary, mb: 1.5 }}>
                  {h.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: tokens.primarySoft, color: tokens.primary, px: 1.5, py: 0.5, borderRadius: 6 }}>
                    <LocalHospitalRoundedIcon sx={{ fontSize: 14 }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{h.type}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.textPrimary }}>
                    <BedRoundedIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{i === 0 ? 500 : i === 1 ? 350 : 800}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.textPrimary }}>
                    <PeopleRoundedIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{i === 0 ? 150 : i === 1 ? 120 : 250}</Typography>
                  </Box>
                </Box>

                <Grid container spacing={1.5} sx={{ mb: 'auto' }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: tokens.textSecondary }}>
                      <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>24/7 Emergency</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: tokens.textSecondary }}>
                      <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>ICU Facilities</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: tokens.textSecondary }}>
                      <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Advanced MRI</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: tokens.textSecondary }}>
                      <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>In-house Pharmacy</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: tokens.textPrimary, mt: 3, pt: 2, borderTop: `1px solid ${tokens.border}` }}>
                  <VerifiedUserRoundedIcon sx={{ fontSize: 16, color: tokens.primary }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                    Insurance accepted from major providers.
                  </Typography>
                </Box>
              </Box>

              {/* Right Area */}
              <Box sx={{ width: { xs: '100%', md: 220 }, borderLeft: { xs: 'none', md: `1px solid ${tokens.border}` }, borderTop: { xs: `1px solid ${tokens.border}`, md: 'none' }, pt: { xs: 3, md: 1 }, pl: { xs: 0, md: 4 }, pr: { xs: 0, md: 1 }, display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontSize: 12, color: tokens.textSecondary, mb: 0.5, fontWeight: 500 }}>Consultation Fee</Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 800, color: tokens.textPrimary, mb: 2.5 }}>
                  {i === 0 ? '₹110' : i === 1 ? '₹85' : '₹150'} <Typography component="span" sx={{ fontSize: 13, fontWeight: 500, color: tokens.textSecondary }}>(General)</Typography>
                </Typography>
                <Button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/hospitals/${h.id}`); }}
                  variant="contained" 
                  sx={{ bgcolor: tokens.primary, color: '#fff', textTransform: 'none', borderRadius: 6, fontWeight: 600, py: 1.2, '&:hover': { bgcolor: tokens.primaryDark }, mb: 'auto' }}>
                  Select
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, color: tokens.textPrimary, mt: 3 }}>
                  <DiscountOutlinedIcon sx={{ fontSize: 16, mt: 0.2, color: tokens.primary }} />
                  <Typography sx={{ fontSize: 11, lineHeight: 1.5, fontWeight: 500 }}>
                    We offer 10% off on complete health checkups when paid in full at the time of booking.
                  </Typography>
                </Box>
              </Box>

            </Card>
          ))}
        </Box>
      </Box>

      {/* ══ FIND YOUR SPECIALIST ══ */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 20 }}>Find your specialist</Typography>
          <Button 
            onClick={() => navigate('/find-doctors')}
            sx={{ color: tokens.primary, fontWeight: 700, fontSize: 13, textTransform: 'none', p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
            endIcon={<EastRoundedIcon sx={{ fontSize: 15 }} />}
          >
            See all
          </Button>
        </Box>
        <motion.div variants={containerVariants} initial="initial" animate="animate">
          <Box className="no-scrollbar" sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, px: 0.5, pt: 6 }}>
            {doctors.map((d) => (
              <motion.div key={d.id} variants={itemVariants} style={{ flex: '0 0 auto' }}>
                <Card sx={{ 
                  width: 240, 
                  cursor: 'pointer', 
                  overflow: 'visible',
                  bgcolor: '#F3F4F6', // light gray background from image
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  borderRadius: 1,
                  textAlign: 'center',
                  '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.08)' },
                  transition: 'all 200ms ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                  onClick={() => navigate(`/doctors/${d.id}`)}>
                  
                  {/* Overlapping Avatar */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: -6 }}>
                    <Avatar 
                      src={d.photo}
                      sx={{ 
                        width: 110, 
                        height: 110, 
                        borderRadius: '50%',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        border: '3px solid #fff',
                        bgcolor: '#E5E7EB',
                        fontSize: 24,
                        fontWeight: 800,
                        color: '#666',
                      }} 
                    >
                      {d.initials}
                    </Avatar>
                  </Box>

                  <CardContent sx={{ pt: 2, pb: 3, px: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 16, color: '#111827', mb: 0.5 }}>
                      {d.name.replace('Dr. ', 'Dr.')}
                    </Typography>

                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#4B5563', mb: 2 }}>
                      {d.specialty}
                    </Typography>

                    <Typography sx={{ fontSize: 11, color: '#6B7280', lineHeight: 1.6, mb: 3, flex: 1 }}>
                      {d.bio || `${d.experience || '8'}+ years experience in ${d.specialty}. Specialises in ${d.subSpecialty || d.specialty.toLowerCase()} at ${d.hospital?.split(',')[0] || 'leading hospitals'}.`}
                    </Typography>

                    {/* Availability and Booking */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #E5E7EB', mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: d.availableToday ? '#10B981' : '#9CA3AF' }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: d.availableToday ? '#10B981' : '#6B7280' }}>
                          {d.availableToday ? 'Available' : 'Booked'}
                        </Typography>
                      </Box>
                      <Button 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          borderRadius: 1, 
                          px: 1.5, 
                          py: 0.5,
                          fontWeight: 700, 
                          fontSize: 11,
                          borderColor: '#D1D5DB',
                          color: '#4B5563',
                          textTransform: 'none',
                          '&:hover': { borderColor: '#9CA3AF', bgcolor: '#F9FAFB' }
                        }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/booking/${d.id}`); }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* ══ HEALTH INSIGHTS ══ */}
      <Box sx={{ mt: 5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 20, mb: 2 }}>Health insights for you</Typography>
        <Card sx={{ 
          p: { xs: 2, md: 4 }, 
          borderRadius: 4, 
          border: '1px solid #E5E7EB', 
          boxShadow: 'none',
          bgcolor: '#fff'
        }}>
          {/* Top Section: Hero + Latest News */}
          <Grid container spacing={4} sx={{ mb: 5 }}>
            {/* Left: Hero Image */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ 
                position: 'relative', 
                height: { xs: 300, md: 400 }, 
                borderRadius: 4, 
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover img': { transform: 'scale(1.05)' }
              }} onClick={() => navigate('/article/1')}>
                <SmartImage 
                  src={heroArticle.img} 
                  alt="Hero" 
                  sx={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 400ms ease'
                  }} 
                />
                {/* Gradient overlay for text readability */}
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.6) 100%)',
                }} />
                {/* Overlay Content */}
                <Box sx={{ position: 'absolute', top: 32, left: 32, right: 32 }}>
                  <Typography sx={{ 
                    color: '#fff', 
                    fontWeight: 800, 
                    fontSize: { xs: 28, md: 36 }, 
                    lineHeight: 1.2,
                    maxWidth: 500,
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                  }}>
                    {heroArticle.title}
                  </Typography>
                </Box>
                <Box sx={{ position: 'absolute', bottom: 32, left: 32 }}>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      bgcolor: '#fff', 
                      color: '#111827', 
                      fontWeight: 700, 
                      borderRadius: 100, 
                      px: 3, 
                      py: 1,
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#F3F4F6' }
                    }}
                    onClick={(e) => { e.stopPropagation(); navigate('/articles'); }}
                  >
                    See all articles
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Right: Latest News */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#4B5563', mb: 2 }}>
                Latest news
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={3}>
                {latestNews.map((news, idx) => (
                  <Box key={idx} sx={{ cursor: 'pointer', '&:hover h6': { color: tokens.primary } }} onClick={() => navigate(`/article/${idx+2}`)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <FiberManualRecordIcon sx={{ fontSize: 10, color: '#9CA3AF' }} />
                      <Typography sx={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{news.tag}</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 16, color: '#111827', mb: 1, lineHeight: 1.3, transition: 'color 200ms ease' }}>
                      {news.title}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>
                      {news.desc}
                    </Typography>
                    {idx < latestNews.length - 1 && <Divider sx={{ mt: 3 }} />}
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>

          {/* Bottom Section: Recommended */}
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#4B5563', mb: 3 }}>
            Recommended for you
          </Typography>
          
          <Grid container spacing={2}>
            {recommendedArticles.map((rec, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Box 
                  sx={{ 
                    bgcolor: '#F9FAFB', 
                    borderRadius: 3, 
                    p: 2.5, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    '&:hover': { bgcolor: '#F3F4F6', transform: 'translateY(-2px)' }
                  }}
                  onClick={() => navigate(`/article/${idx+4}`)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FiberManualRecordIcon sx={{ fontSize: 10, color: '#9CA3AF' }} />
                      <Typography sx={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{rec.tag}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />
                      <Typography sx={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{rec.date}</Typography>
                    </Box>
                  </Box>
                  
                  <Typography sx={{ fontWeight: 800, fontSize: 15, color: '#111827', mb: 1.5, lineHeight: 1.3 }}>
                    {rec.title}
                  </Typography>
                  
                  <Typography sx={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, mb: 3, flex: 1 }}>
                    {rec.desc}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {rec.subTags.map(tag => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        variant="outlined" 
                        sx={{ 
                          height: 22, 
                          fontSize: 10, 
                          fontWeight: 600, 
                          color: '#4B5563', 
                          borderColor: '#D1D5DB' 
                        }} 
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Box>

      {/* ══ CARE TEAM + FAMILY ══ */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="Your care team" arrow action={() => navigate('/family')}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {doctors.slice(0, 4).map((d, i) => (
                  <Avatar key={d.id} src={d.photo}
                    sx={{ width: 40, height: 40, ml: i ? -1 : 0, border: '2px solid #fff', cursor: 'pointer' }}
                    onClick={() => navigate(`/doctors/${d.id}`)} />
                ))}
                <Typography sx={{ ml: 1.5, fontSize: 13, color: tokens.textSecondary }}>
                  {doctors.length} specialists
                </Typography>
              </Box>
              <Button variant="outlined" size="small" endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate('/family')} sx={{ fontWeight: 700 }}>
                Manage
              </Button>
            </Box>
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ bgcolor: tokens.primary, border: 'none' }}>
            <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Manage Family Health</Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  Book for parents, kids, or partner
                </Typography>
              </Box>
              <Button variant="contained"
                sx={{ bgcolor: '#fff', color: tokens.primary, fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                startIcon={<AddCircleRoundedIcon />}
                onClick={() => navigate('/family')}>
                Add Member
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </PageTransition>
  );
}
