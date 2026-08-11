import {
  Box, Grid, Card, CardContent, Typography, Select, MenuItem, Chip, List, ListItemButton,
  ListItemText, ListItemIcon, Avatar, Button, IconButton, Stack,
} from '@mui/material';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutlineOutlined';
import EastIcon from '@mui/icons-material/East';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import SectionCard from '../../components/SectionCard';
import useStore from '../../store/useStore';
import { tokens } from '../../theme/theme';
import { patientPhotos } from '../../data/assets';

const queue = [
  { time: '10:00 AM', name: 'Meera Sharma', age: 34, type: 'Video', photo: patientPhotos.meera, current: true },
  { time: '10:30 AM', name: 'Rohan Sharma', age: 37, type: 'In-Clinic', photo: patientPhotos.rohan, current: false },
  { time: '11:15 AM', name: 'Aanya Iyer', age: 28, type: 'Video', photo: patientPhotos.aanya, current: false },
];
const pending = [
  { icon: EditNoteOutlinedIcon, text: '2 prescriptions to sign', action: 'Review' },
  { icon: PsychologyOutlinedIcon, text: '1 MRI to review', action: 'Review Now', badge: true },
  { icon: StarOutlineIcon, text: '3 reviews to respond', action: 'Respond' },
];

const stats = [
  { label: "Today's Patients", value: 8, icon: GroupRoundedIcon, color: tokens.primary, bg: tokens.primarySoft },
  { label: 'Your Rating', value: '4.8', icon: StarRoundedIcon, color: tokens.warning, bg: tokens.warningSoft },
  { label: 'Week Earnings', value: '₹24,400', icon: PaymentsRoundedIcon, color: tokens.success, bg: tokens.successSoft },
  { label: 'Pending Actions', value: 3, icon: PendingActionsRoundedIcon, color: '#7C3AED', bg: '#F3F0FF' },
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const status = useStore((s) => s.doctorStatus);
  const setStatus = useStore((s) => s.setDoctorStatus);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <PageTransition>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, letterSpacing: '-0.02em' }}>
            Good morning, Dr. Arvind Rao
          </Typography>
          <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>Neurologist · Apollo Hospital · {today}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} size="small"
            sx={{ borderRadius: '100px', fontWeight: 700, fontSize: 13,
              color: status === 'Available' ? tokens.success : status === 'Busy' ? tokens.warning : tokens.textSecondary,
              '& fieldset': { borderColor: status === 'Available' ? tokens.success : tokens.border } }}>
            <MenuItem value="Available">🟢 Available</MenuItem>
            <MenuItem value="Busy">🟡 Busy</MenuItem>
            <MenuItem value="Offline">⚪ Offline</MenuItem>
          </Select>
          <Chip icon={<VerifiedRoundedIcon sx={{ fontSize: 14, color: '#fff !important' }} />} label="Verified"
            sx={{ bgcolor: tokens.primary, color: '#fff', fontWeight: 700 }} />
        </Box>
      </Box>

      {/* Filled stat cards */}
      <Grid container spacing={2} sx={{ mb: 1 }}>
        {stats.map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ bgcolor: s.bg, border: `1px solid ${s.color}22` }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: '#fff', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                  <s.icon sx={{ fontSize: 20, color: s.color }} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: 26, color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: s.color, opacity: 0.85 }}>{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {/* Queue */}
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard
            title="Today's Queue"
            action={() => navigate('/doctor/patients')}
            menu
          >
            <Stack spacing={0.5}>
              {queue.map((q) => (
                <Box key={q.name}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: 2,
                    bgcolor: q.current ? tokens.primarySoft : 'transparent',
                    border: q.current ? `1px solid ${tokens.primary}22` : '1px solid transparent' }}>
                  <Avatar src={q.photo} sx={{ width: 38, height: 38 }}>{q.name[0]}</Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{q.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {q.type === 'Video'
                        ? <VideocamRoundedIcon sx={{ fontSize: 13, color: tokens.textTertiary }} />
                        : null}
                      <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{q.time} · {q.type}</Typography>
                    </Box>
                  </Box>
                  {q.current
                    ? <Button size="small" variant="contained" onClick={() => navigate('/doctor/consult/a001')}
                        sx={{ fontWeight: 700, fontSize: 12 }}>Start</Button>
                    : <Chip label="Waiting" size="small" sx={{ bgcolor: tokens.surfaceMuted, color: tokens.textTertiary, fontWeight: 600, fontSize: 10 }} />}
                </Box>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        {/* This Week */}
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard title="This Week" arrow action={() => navigate('/doctor/availability')}>
            <Stack spacing={0.5}>
              {[['Mon 18', 6], ['Tue 19', 8], ['Wed 20', 5], ['Thu 21', 7], ['Fri 22', 9]].map(([d, n]) => {
                const pct = (n / 9) * 100;
                return (
                  <Box key={d} sx={{ py: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{d}</Typography>
                      <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{n} patients</Typography>
                    </Box>
                    <Box sx={{ height: 6, borderRadius: 100, bgcolor: tokens.surfaceMuted, overflow: 'hidden' }}>
                      <Box sx={{ width: `${pct}%`, height: '100%', borderRadius: 100, bgcolor: tokens.primary }} />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </SectionCard>
        </Grid>

        {/* Pending Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard title="Pending Actions">
            <List disablePadding>
              {pending.map((p, i) => {
                const Icon = p.icon;
                return (
                  <ListItemButton key={i} sx={{ borderRadius: 2, px: 1.5, py: 1.25 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: p.badge ? tokens.dangerSoft : tokens.surfaceMuted }}>
                        <Icon sx={{ fontSize: 17, color: p.badge ? tokens.danger : tokens.textSecondary }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={p.text} slotProps={{ primary: { fontSize: 13.5, fontWeight: 600 } }} />
                    <EastIcon sx={{ fontSize: 16, color: tokens.textTertiary }} />
                  </ListItemButton>
                );
              })}
            </List>
          </SectionCard>
        </Grid>
      </Grid>
    </PageTransition>
  );
}
