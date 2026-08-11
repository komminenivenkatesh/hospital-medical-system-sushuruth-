import { Box, Card, CardContent, Typography, Chip, Button, Grid, Stack, Avatar, Divider } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import VideoCameraFrontRoundedIcon from '@mui/icons-material/VideoCameraFrontRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import SectionCard from '../../components/SectionCard';
import useQueue from '../../hooks/useQueue';
import { getAppointment } from '../../data/appointments';
import { tokens } from '../../theme/theme';

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appt = getAppointment(id) || getAppointment('a001');
  const { position, total, estMinutes, canJoin, countdown } = useQueue();
  const isUpcoming = appt.status === 'Upcoming';
  const isVideo = appt.mode === 'Video';

  return (
    <PageTransition>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, letterSpacing: '-0.02em' }}>
            Appointment Details
          </Typography>
          <Typography sx={{ fontSize: 14, color: tokens.textSecondary }}>
            {appt.doctorName} · {appt.specialty}
          </Typography>
        </Box>
        <Chip label={appt.status} size="small"
          sx={{ bgcolor: isUpcoming ? tokens.primarySoft : tokens.successSoft,
            color: isUpcoming ? tokens.primary : tokens.success,
            fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.03em' }} />
      </Box>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 7 }}>

          {/* Doctor card — filled */}
          <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22`, mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 }, '&:last-child': { pb: 3 } }}>
              <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                <Avatar src={appt.photo} sx={{ width: 64, height: 64, border: '2px solid #fff',
                  bgcolor: tokens.primary, color: '#fff', fontWeight: 700, fontSize: 20 }}>
                  {appt.doctorName.split(' ').slice(1).map(w => w[0]).join('')}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 0.25 }}>{appt.doctorName}</Typography>
                  <Typography sx={{ fontSize: 14, color: tokens.primary, fontWeight: 500, mb: 1 }}>{appt.specialty}</Typography>
                  <Chip size="small"
                    icon={isVideo ? <VideocamRoundedIcon /> : <LocationOnOutlinedIcon />}
                    label={`${appt.mode} Consultation`}
                    sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: 12,
                      color: isVideo ? tokens.primary : tokens.success,
                      '& .MuiChip-icon': { fontSize: 14 } }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Info strip — filled cards */}
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ bgcolor: tokens.surfaceMuted }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: tokens.textTertiary, mb: 0.5 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{appt.date}</Typography>
                  <Typography sx={{ fontSize: 10, color: tokens.textTertiary }}>Date</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ bgcolor: tokens.surfaceMuted }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                  <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: tokens.textTertiary, mb: 0.5 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{appt.time}</Typography>
                  <Typography sx={{ fontSize: 10, color: tokens.textTertiary }}>Time</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ bgcolor: tokens.surfaceMuted }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                  <CurrencyRupeeRoundedIcon sx={{ fontSize: 18, color: tokens.textTertiary, mb: 0.5 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>₹{appt.fee || 600}</Typography>
                  <Typography sx={{ fontSize: 10, color: tokens.textTertiary }}>Fee</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ bgcolor: tokens.surfaceMuted }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                  <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: tokens.textTertiary, mb: 0.5 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{appt.duration || '30 min'}</Typography>
                  <Typography sx={{ fontSize: 10, color: tokens.textTertiary }}>Duration</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Reason & Notes */}
          {appt.reason && (
            <SectionCard title="Visit Details" arrow sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: tokens.primarySoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <NoteAltOutlinedIcon sx={{ fontSize: 16, color: tokens.primary }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 0.25 }}>{appt.reason}</Typography>
                  {appt.notes && (
                    <Typography sx={{ fontSize: 13, color: tokens.textSecondary, lineHeight: 1.5 }}>{appt.notes}</Typography>
                  )}
                </Box>
              </Box>
            </SectionCard>
          )}

          {/* Hospital info */}
          {appt.hospital && (
            <SectionCard title="Location" arrow sx={{ mb: 3 }}>
              <Card sx={{ bgcolor: tokens.successSoft, border: `1px solid ${tokens.success}22` }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 18, color: tokens.success }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{appt.hospital}</Typography>
                    <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>Directions available on Google Maps</Typography>
                  </Box>
                </CardContent>
              </Card>
            </SectionCard>
          )}
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* Queue Widget */}
          {isUpcoming && (
            <SectionCard title="Your Queue Position" sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{ width: 110, height: 110, borderRadius: '50%', bgcolor: tokens.primarySoft,
                  border: `3px solid ${tokens.primary}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AnimatePresence mode="popLayout">
                    <motion.div key={position} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 52, color: tokens.primary, lineHeight: 1 }}>{position}</Typography>
                    </motion.div>
                  </AnimatePresence>
                </Box>
              </Box>

              {position === 1 ? (
                <Card sx={{ bgcolor: tokens.successSoft, border: `1px solid ${tokens.success}22` }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <CheckCircleRoundedIcon sx={{ color: tokens.success, fontSize: 20 }} />
                    <Typography sx={{ color: tokens.success, fontWeight: 700, fontSize: 13 }}>
                      You're next! Please proceed to Room 204, Floor 2
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Typography sx={{ textAlign: 'center', color: tokens.textSecondary, fontSize: 13, fontWeight: 500 }}>
                  #{position} in queue · ~{estMinutes} min estimated wait
                </Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 2.5 }}>
                {Array.from({ length: total }).map((_, i) => (
                  <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%',
                    bgcolor: i < (total - position + 1) ? tokens.primary : tokens.border,
                    transition: 'background-color 300ms ease' }} />
                ))}
              </Box>
              <Typography sx={{ textAlign: 'center', fontSize: 11, color: tokens.textTertiary, mt: 1.5 }}>
                Queue updates automatically
              </Typography>
            </SectionCard>
          )}

          {/* Connection Test — filled */}
          {isVideo && isUpcoming && (
            <SectionCard title="Connection Test" sx={{ mb: 3 }}>
              <Stack spacing={1.25} sx={{ mb: 2.5 }}>
                {[
                  { label: 'Camera', icon: <VideoCameraFrontRoundedIcon sx={{ fontSize: 16 }} />, status: 'Ready' },
                  { label: 'Microphone', icon: <MicRoundedIcon sx={{ fontSize: 16 }} />, status: 'Ready' },
                  { label: 'Internet', icon: <WifiRoundedIcon sx={{ fontSize: 16 }} />, status: 'Strong' },
                ].map((item) => (
                  <Card key={item.label} sx={{ bgcolor: tokens.successSoft, border: `1px solid ${tokens.success}22` }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ color: tokens.success }}>{item.icon}</Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{item.label}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: tokens.success }} />
                        <Typography sx={{ fontSize: 12, color: tokens.success, fontWeight: 700 }}>{item.status}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>

              <Button fullWidth variant="contained" size="large" startIcon={<VideocamRoundedIcon />}
                disabled={!canJoin} onClick={() => navigate(`/consult/${appt.id}`)}
                sx={{ py: 1.5, borderRadius: 100, fontWeight: 800, fontSize: 15 }}>
                Join Video Call
              </Button>
              {!canJoin && (
                <Typography sx={{ textAlign: 'center', fontSize: 12, color: tokens.textTertiary, mt: 1.5, fontWeight: 500 }}>
                  Starts in {countdown}
                </Typography>
              )}
            </SectionCard>
          )}

          {/* Actions */}
          <Stack spacing={1.5}>
            <Button fullWidth variant="outlined" sx={{ fontWeight: 700 }} onClick={() => navigate('/appointments')}>
              Back to Appointments
            </Button>
            {isUpcoming && (
              <Button fullWidth variant="outlined" sx={{ fontWeight: 700, color: tokens.danger, borderColor: `${tokens.danger}44`,
                '&:hover': { borderColor: tokens.danger, bgcolor: tokens.dangerSoft } }}>
                Cancel Appointment
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </PageTransition>
  );
}
