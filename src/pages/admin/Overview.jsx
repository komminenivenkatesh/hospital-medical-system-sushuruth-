import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import SectionCard from '../../components/SectionCard';
import { tokens } from '../../theme/theme';

const metrics = [
  { label: 'Total Users', value: '48,210', icon: GroupRoundedIcon, color: tokens.primary, bg: tokens.primarySoft },
  { label: 'Active Doctors', value: '1,284', icon: MedicalServicesRoundedIcon, color: tokens.teal, bg: tokens.surfaceTintGreen },
  { label: 'Hospitals', value: '96', icon: LocalHospitalRoundedIcon, color: '#7C3AED', bg: '#F3F0FF' },
  { label: 'Appointments Today', value: '3,120', icon: EventAvailableRoundedIcon, color: tokens.warning, bg: tokens.warningSoft },
  { label: 'Revenue Today', value: '₹4.2L', icon: PaymentsRoundedIcon, color: tokens.success, bg: tokens.successSoft },
  { label: 'Pending Verifications', value: '30', icon: VerifiedUserRoundedIcon, color: tokens.danger, bg: tokens.dangerSoft },
];
const chartData = [
  { day: 'Mon', users: 4200, appts: 2800, revenue: 3200 },
  { day: 'Tue', users: 4600, appts: 3100, revenue: 3600 },
  { day: 'Wed', users: 4400, appts: 2900, revenue: 3400 },
  { day: 'Thu', users: 5000, appts: 3400, revenue: 4000 },
  { day: 'Fri', users: 5300, appts: 3600, revenue: 4400 },
  { day: 'Sat', users: 4800, appts: 3000, revenue: 3800 },
  { day: 'Sun', users: 4100, appts: 2600, revenue: 3000 },
];
const seedActivity = [
  { who: 'Dr. Sanjay V.', what: 'submitted verification documents', time: 'just now', color: tokens.primary, bg: tokens.primarySoft },
  { who: 'Apollo Hospital', what: 'added 3 new doctors', time: '2m ago', color: tokens.success, bg: tokens.successSoft },
  { who: 'Meera Sharma', what: 'upgraded to Pro', time: '5m ago', color: tokens.warning, bg: tokens.warningSoft },
];
const pool = [
  { who: 'Dr. Neha K.', what: 'completed 12 consultations', time: 'just now', color: tokens.primary, bg: tokens.primarySoft },
  { who: 'Fortis Hospital', what: 'updated availability', time: 'just now', color: tokens.success, bg: tokens.successSoft },
  { who: 'Rahul M.', what: 'booked an appointment', time: 'just now', color: '#7C3AED', bg: '#F3F0FF' },
];

export default function AdminOverview() {
  const [activity, setActivity] = useState(seedActivity);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    const id = setInterval(() => {
      setActivity((a) => [pool[Math.floor(Math.random() * pool.length)], ...a].slice(0, 6));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <PageTransition>
      <PageHeader title="Platform Overview" subtitle={today} />

      {/* Filled metric cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {metrics.map((m) => (
          <Grid size={{ xs: 6, md: 4 }} key={m.label}>
            <Card sx={{ bgcolor: m.bg, border: `1px solid ${m.color}22` }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: '#fff', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <m.icon sx={{ fontSize: 22, color: m.color }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 24, color: m.color, lineHeight: 1.1 }}>{m.value}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: m.color, opacity: 0.85 }}>{m.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <SectionCard title="Platform Health" arrow>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={tokens.border} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: tokens.textTertiary }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: tokens.textTertiary }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${tokens.border}`, fontFamily: 'Manrope' }} />
                <Legend wrapperStyle={{ fontFamily: 'Manrope', fontSize: 12 }} />
                <Line type="monotone" dataKey="users" stroke={tokens.primary} strokeWidth={2.5} dot={false} name="Users" />
                <Line type="monotone" dataKey="appts" stroke={tokens.success} strokeWidth={2.5} dot={false} name="Appointments" />
                <Line type="monotone" dataKey="revenue" stroke={tokens.warning} strokeWidth={2.5} dot={false} name="Revenue" />
              </ComposedChart>
            </ResponsiveContainer>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard title="Recent Activity" menu>
            <Box>
              <AnimatePresence initial={false}>
                {activity.map((a, i) => (
                  <motion.div key={`${a.who}-${i}`} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: a.bg, color: a.color, fontSize: 13, fontWeight: 700 }}>
                        {a.who[0]}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: 13, lineHeight: 1.4 }}>
                          <b>{a.who}</b> {a.what}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>{a.time}</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          </SectionCard>
        </Grid>
      </Grid>
    </PageTransition>
  );
}
