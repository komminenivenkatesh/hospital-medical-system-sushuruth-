import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, Chip, Button, Rating,
  Grid, Divider, Stack,
} from '@mui/material';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { useParams, useNavigate } from 'react-router-dom';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PageTransition from '../../components/PageTransition';
import SectionCard, { StatGrid } from '../../components/SectionCard';
import { getDoctor } from '../../data/doctors';
import { tokens } from '../../theme/theme';

const slots = ['09:00', '09:30', '10:00', '11:30', '14:00', '14:30', '15:00', '16:30'];
const reviews = [
  { name: 'Karan P.', city: 'Mumbai', date: 'Dec 2024', rating: 5, text: 'Extremely thorough and patient. Explained my condition clearly.' },
  { name: 'Sunita R.', city: 'Pune', date: 'Nov 2024', rating: 5, text: 'Best neurologist I have consulted. Highly recommend.' },
  { name: 'Imran S.', city: 'Hyderabad', date: 'Nov 2024', rating: 4, text: 'Good experience overall, slight wait time at clinic.' },
];

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = getDoctor(id) || getDoctor('d001');
  const [date, setDate] = useState(new Date());
  const [slot, setSlot] = useState(null);
  const [bookingMode, setBookingMode] = useState('video');

  return (
    <PageTransition>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, letterSpacing: '-0.02em' }}>
          Doctor Profile
        </Typography>
        <Typography sx={{ fontSize: 14, color: tokens.textSecondary }}>
          View details and book an appointment
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 8 }}>

          {/* Hero Card — filled */}
          <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22`, mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar src={doctor.photo}
                    sx={{ width: 100, height: 100, borderRadius: 3, border: `3px solid #fff`,
                      bgcolor: tokens.primary, color: '#fff', fontWeight: 800, fontSize: 28 }}>
                    {doctor.initials}
                  </Avatar>
                  {doctor.verified && (
                    <Box sx={{ position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: '50%',
                      bgcolor: tokens.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                      <VerifiedRoundedIcon sx={{ fontSize: 14, color: '#fff' }} />
                    </Box>
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, letterSpacing: '-0.02em', color: tokens.textPrimary, mb: 0.5 }}>
                    {doctor.name}
                  </Typography>
                  <Typography sx={{ fontSize: 15, color: tokens.primary, fontWeight: 600, mb: 1.5 }}>
                    {doctor.specialty}{doctor.subSpecialty ? ` · ${doctor.subSpecialty}` : ''}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip size="small" icon={<LocationOnOutlinedIcon />} label={doctor.hospital}
                      sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: 12,
                        '& .MuiChip-icon': { fontSize: 14, color: tokens.textTertiary } }} />
                    <Chip size="small" icon={<WorkOutlineRoundedIcon />} label={`${doctor.experience} yrs exp`}
                      sx={{ bgcolor: '#fff', fontWeight: 700, fontSize: 12, color: tokens.primary,
                        '& .MuiChip-icon': { fontSize: 14, color: tokens.primary } }} />
                    <Chip size="small" icon={<TranslateRoundedIcon />} label={doctor.languages.join(', ')}
                      sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: 12,
                        '& .MuiChip-icon': { fontSize: 14, color: tokens.textTertiary } }} />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Stats Row — filled cards */}
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 3 }}>
              <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22` }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 24, color: tokens.primary }}>{doctor.experience}</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: tokens.primary }}>Years Exp</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 3 }}>
              <Card sx={{ bgcolor: tokens.successSoft, border: `1px solid ${tokens.success}22` }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 24, color: tokens.success }}>{doctor.rating}</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: tokens.success }}>Rating</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 3 }}>
              <Card sx={{ bgcolor: tokens.warningSoft, border: `1px solid ${tokens.warning}22` }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 24, color: tokens.warning }}>{doctor.reviews}</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: tokens.warning }}>Reviews</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 3 }}>
              <Card sx={{ bgcolor: tokens.surfaceMuted }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 24, color: tokens.textPrimary }}>8K+</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: tokens.textSecondary }}>Patients</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* About */}
          <SectionCard title="About" arrow sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 14, color: tokens.textSecondary, lineHeight: 1.8 }}>
              {doctor.bio}
            </Typography>
          </SectionCard>

          {/* Education */}
          <SectionCard title="Education & Training" arrow sx={{ mb: 3 }}>
            <Stack spacing={2}>
              {doctor.education.map((e, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ pt: 0.25 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: tokens.primarySoft,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SchoolRoundedIcon sx={{ fontSize: 16, color: tokens.primary }} />
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: tokens.textPrimary }}>{e.title}</Typography>
                    <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{e.place} · {e.year}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </SectionCard>

          {/* Reviews */}
          <SectionCard title="Patient Reviews" arrow sx={{ mb: 3 }}>
            {/* Rating summary — filled */}
            <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22`, mb: 2.5 }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 42, color: tokens.primary, lineHeight: 1 }}>{doctor.rating}</Typography>
                <Box>
                  <Rating value={doctor.rating} precision={0.1} readOnly size="small" />
                  <Typography sx={{ fontSize: 13, color: tokens.primary, fontWeight: 600, mt: 0.5 }}>
                    Based on {doctor.reviews} verified reviews
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Stack spacing={0}>
              {reviews.map((r, i) => (
                <Box key={i}>
                  <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: tokens.surfaceMuted, color: tokens.primary, fontWeight: 700, fontSize: 14 }}>
                      {r.name[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{r.name}</Typography>
                        <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>{r.date}</Typography>
                      </Box>
                      <Rating value={r.rating} readOnly size="small" sx={{ fontSize: 14, mb: 0.75 }} />
                      <Typography sx={{ fontSize: 13, color: tokens.textSecondary, lineHeight: 1.5 }}>"{r.text}"</Typography>
                    </Box>
                  </Box>
                  {i < reviews.length - 1 && <Divider />}
                </Box>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        {/* Right Column — Booking Widget */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: 'sticky', top: 90 }}>
            <SectionCard title="Book Appointment" sx={{ mb: 2 }}>
              {/* Mode toggle */}
              <Box sx={{ display: 'flex', bgcolor: tokens.surfaceMuted, p: 0.5, borderRadius: 100, mb: 2.5, gap: 0.5 }}>
                {[
                  { key: 'video', icon: <VideocamRoundedIcon sx={{ fontSize: 16, mr: 0.75 }} />, label: 'Video', fee: doctor.videoFee },
                  { key: 'clinic', icon: <LocalHospitalRoundedIcon sx={{ fontSize: 16, mr: 0.75 }} />, label: 'Clinic', fee: doctor.inClinicFee },
                ].map((m) => (
                  <Box key={m.key} onClick={() => setBookingMode(m.key)}
                    sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1, borderRadius: 100,
                      cursor: 'pointer', fontWeight: bookingMode === m.key ? 700 : 500, fontSize: 13,
                      bgcolor: bookingMode === m.key ? '#fff' : 'transparent',
                      color: bookingMode === m.key ? tokens.primary : tokens.textSecondary,
                      boxShadow: bookingMode === m.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 150ms ease' }}>
                    {m.icon}{m.label}
                  </Box>
                ))}
              </Box>

              {/* Fee card — filled */}
              <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22`, mb: 2.5 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: tokens.primary }}>Consultation Fee</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 22, color: tokens.primary }}>
                    ₹{bookingMode === 'video' ? doctor.videoFee : doctor.inClinicFee}
                  </Typography>
                </CardContent>
              </Card>

              {/* Calendar */}
              <Typography sx={{ fontWeight: 700, mb: 1, fontSize: 13, color: tokens.textSecondary }}>Select Date</Typography>
              <Box sx={{ mx: -1 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateCalendar value={date} onChange={setDate}
                    sx={{ width: '100%', '& .MuiPickersDay-root.Mui-selected': { bgcolor: tokens.primary } }} />
                </LocalizationProvider>
              </Box>

              {/* Time Slots */}
              <Typography sx={{ fontWeight: 700, mb: 1.5, mt: 1, fontSize: 13, color: tokens.textSecondary }}>Available Slots</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {slots.map((s) => (
                  <Box key={s} onClick={() => setSlot(s)}
                    sx={{ py: 1, textAlign: 'center', borderRadius: 2, cursor: 'pointer', fontWeight: 700, fontSize: 13,
                      bgcolor: slot === s ? tokens.primary : tokens.surfaceMuted,
                      color: slot === s ? '#fff' : tokens.textSecondary,
                      border: `1px solid ${slot === s ? tokens.primary : tokens.border}`,
                      transition: 'all 150ms ease',
                      '&:hover': { bgcolor: slot === s ? tokens.primaryDark : tokens.border } }}>
                    {s}
                  </Box>
                ))}
              </Box>

              <Button fullWidth variant="contained" disabled={!slot} sx={{ mt: 3, py: 1.5, borderRadius: 100, fontSize: 15, fontWeight: 800 }}
                onClick={() => navigate(`/booking/${doctor.id}`)}>
                Book Appointment
              </Button>
            </SectionCard>

            {/* Quick info card — filled */}
            <Card sx={{ bgcolor: tokens.successSoft, border: `1px solid ${tokens.success}22` }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 16, color: tokens.success }} />
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: tokens.success }}>Available Today</Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: tokens.textSecondary, lineHeight: 1.6 }}>
                  Next available slot: {doctor.nextSlot || 'Today 2:00 PM'}. Average wait time is under 5 minutes for video consultations.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </PageTransition>
  );
}
