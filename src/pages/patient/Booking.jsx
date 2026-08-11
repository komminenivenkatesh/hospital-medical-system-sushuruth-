import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, TextField, Chip, Switch,
  FormControlLabel, RadioGroup, Radio, FormControl, Stack, Avatar,
} from '@mui/material';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import SectionCard from '../../components/SectionCard';
import { PillTabs } from '../../components/SectionCard';
import useStore from '../../store/useStore';
import { getDoctor } from '../../data/doctors';
import { tokens } from '../../theme/theme';

const slots = ['09:00', '09:30', '10:00', '11:30', '14:00', '14:30', '15:00', '16:30'];
const bookedSlots = ['10:00', '14:00'];
const reasonChips = ['Follow-up', 'New symptoms', 'Report review', 'Prescription refill', 'Second opinion'];

export default function Booking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const doctor = getDoctor(doctorId) || getDoctor('d001');
  const { booking, setBooking } = useStore();
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);
  const [date, setDate] = useState(new Date());

  const fee = booking.type === 'clinic' ? doctor.inClinicFee : doctor.videoFee;
  const total = fee ? fee + 40 : 0;

  if (done) {
    return (
      <PageTransition>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Card sx={{ width: 460, maxWidth: '100%' }}>
            <Box sx={{ height: 4, bgcolor: tokens.success }} />
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: tokens.successSoft, mx: 'auto', mb: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleRoundedIcon sx={{ fontSize: 40, color: tokens.success }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 24, mb: 1 }}>Booking Confirmed!</Typography>
              <Typography sx={{ fontSize: 14, color: tokens.textSecondary, mb: 3 }}>
                Your appointment has been scheduled successfully
              </Typography>

              {/* Summary — filled card */}
              <Card sx={{ bgcolor: tokens.surfaceMuted, border: 'none', textAlign: 'left', mb: 3 }}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={doctor.photo} sx={{ width: 40, height: 40, bgcolor: tokens.primary }}>
                        {doctor.initials}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{doctor.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{doctor.specialty}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip size="small" icon={<CalendarTodayOutlinedIcon />} label={date.toLocaleDateString('en-IN')}
                        sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: 12, '& .MuiChip-icon': { fontSize: 14, color: tokens.textTertiary } }} />
                      <Chip size="small" icon={<AccessTimeOutlinedIcon />} label={booking.slot || '14:30'}
                        sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: 12, '& .MuiChip-icon': { fontSize: 14, color: tokens.textTertiary } }} />
                      <Chip size="small" icon={<CurrencyRupeeRoundedIcon />} label={`₹${total}`}
                        sx={{ bgcolor: '#fff', fontWeight: 700, fontSize: 12, '& .MuiChip-icon': { fontSize: 14, color: tokens.textTertiary } }} />
                    </Box>
                    <Chip size="small" label={booking.type === 'clinic' ? 'In-Clinic Visit' : 'Video Consultation'}
                      icon={booking.type === 'clinic' ? <LocalHospitalRoundedIcon /> : <VideocamRoundedIcon />}
                      sx={{ bgcolor: tokens.primarySoft, color: tokens.primary, fontWeight: 600, fontSize: 12, alignSelf: 'flex-start',
                        '& .MuiChip-icon': { fontSize: 14, color: tokens.primary } }} />
                  </Stack>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button fullWidth variant="outlined" startIcon={<EventAvailableRoundedIcon />} sx={{ fontWeight: 700 }}>
                  Add to Calendar
                </Button>
                <Button fullWidth variant="outlined" startIcon={<ShareRoundedIcon />} sx={{ fontWeight: 700 }}>
                  Share
                </Button>
              </Box>
              <Button variant="text" sx={{ mt: 2, fontWeight: 700 }} onClick={() => navigate('/appointments/a001')}>
                View Appointment
              </Button>
            </CardContent>
          </Card>
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, letterSpacing: '-0.02em' }}>
            Book Appointment
          </Typography>
          <Typography sx={{ fontSize: 14, color: tokens.textSecondary }}>
            {doctor.name} · {doctor.specialty}
          </Typography>
        </Box>
      </Box>

      {/* Step indicators — filled chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {['Type', 'Date & Time', 'Reason', 'Confirm & Pay'].map((s, i) => (
          <Chip key={s} label={`${i + 1}. ${s}`} size="small"
            sx={{ fontWeight: active === i ? 700 : 500, fontSize: 12,
              bgcolor: i < active ? tokens.successSoft : active === i ? tokens.primarySoft : tokens.surfaceMuted,
              color: i < active ? tokens.success : active === i ? tokens.primary : tokens.textTertiary,
              border: `1px solid ${i < active ? `${tokens.success}22` : active === i ? `${tokens.primary}22` : 'transparent'}` }} />
        ))}
      </Box>

      {/* Step 0: Type */}
      {active === 0 && (
        <Grid container spacing={2} sx={{ maxWidth: 640 }}>
          {[
            { key: 'video', icon: <VideocamRoundedIcon sx={{ fontSize: 28 }} />, title: 'Video Call',
              lines: ['From anywhere', 'Low-bandwidth friendly'], fee: doctor.videoFee,
              bg: tokens.primarySoft, color: tokens.primary, borderColor: `${tokens.primary}22` },
            { key: 'clinic', icon: <LocalHospitalRoundedIcon sx={{ fontSize: 28 }} />, title: 'In-Clinic Visit',
              lines: [doctor.hospital.split(',')[0], 'Walk-in available'], fee: doctor.inClinicFee,
              bg: tokens.successSoft, color: tokens.success, borderColor: `${tokens.success}22` },
          ].map((opt) => (
            <Grid size={6} key={opt.key}>
              <Card onClick={() => setBooking({ type: opt.key })}
                sx={{ cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  bgcolor: booking.type === opt.key ? opt.bg : 'transparent',
                  borderColor: booking.type === opt.key ? opt.color : tokens.border,
                  borderWidth: booking.type === opt.key ? 2 : 1,
                  transition: 'all 150ms ease',
                  '&:hover': { borderColor: opt.color } }}>
                {booking.type === opt.key && (
                  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: opt.color }} />
                )}
                <CardContent sx={{ p: 3 }}>
                  {booking.type === opt.key && (
                    <CheckCircleRoundedIcon sx={{ position: 'absolute', top: 12, right: 12, color: opt.color, fontSize: 22 }} />
                  )}
                  <Box sx={{ color: opt.color, mb: 1.5 }}>{opt.icon}</Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 0.5 }}>{opt.title}</Typography>
                  {opt.lines.map((l, i) => (
                    <Typography key={i} sx={{ fontSize: 13, color: tokens.textSecondary }}>{l}</Typography>
                  ))}
                  <Typography sx={{ fontWeight: 800, fontSize: 22, mt: 1.5, color: opt.color }}>₹{opt.fee}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Step 1: Date & Time */}
      {active === 1 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <SectionCard title="Select Date">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar value={date} onChange={setDate}
                  sx={{ width: '100%', '& .MuiPickersDay-root.Mui-selected': { bgcolor: tokens.primary } }} />
              </LocalizationProvider>
            </SectionCard>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <SectionCard title="Available Slots">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                {slots.map((s) => {
                  const isBooked = bookedSlots.includes(s);
                  const isSelected = booking.slot === s;
                  return (
                    <Box key={s} onClick={() => !isBooked && setBooking({ slot: s })}
                      sx={{ py: 1.25, textAlign: 'center', borderRadius: 2, fontWeight: 700, fontSize: 14,
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        bgcolor: isSelected ? tokens.primary : isBooked ? tokens.surfaceMuted : '#fff',
                        color: isSelected ? '#fff' : isBooked ? tokens.textTertiary : tokens.textPrimary,
                        border: `1px solid ${isSelected ? tokens.primary : tokens.border}`,
                        opacity: isBooked ? 0.5 : 1,
                        textDecoration: isBooked ? 'line-through' : 'none',
                        transition: 'all 150ms ease',
                        '&:hover': !isBooked ? { bgcolor: isSelected ? tokens.primaryDark : tokens.surfaceMuted } : {} }}>
                      {s}
                    </Box>
                  );
                })}
              </Box>
              {booking.slot && (
                <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22`, mt: 2 }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: tokens.primary }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: tokens.primary }}>
                      Selected: {date.toLocaleDateString('en-IN')} at {booking.slot}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </SectionCard>
          </Grid>
        </Grid>
      )}

      {/* Step 2: Reason */}
      {active === 2 && (
        <Box sx={{ maxWidth: 640 }}>
          <SectionCard title="Reason for Visit">
            <TextField fullWidth multiline rows={4} placeholder="Describe your symptoms or reason for consultation..."
              value={booking.reason} onChange={(e) => setBooking({ reason: e.target.value })}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {reasonChips.map((c) => (
                <Chip key={c} label={c} clickable onClick={() => setBooking({ reason: c })}
                  sx={{ bgcolor: booking.reason === c ? tokens.primarySoft : tokens.surfaceMuted,
                    color: booking.reason === c ? tokens.primary : tokens.textSecondary,
                    fontWeight: booking.reason === c ? 700 : 500, fontSize: 12,
                    border: `1px solid ${booking.reason === c ? `${tokens.primary}22` : 'transparent'}` }} />
              ))}
            </Box>
            <Card sx={{ bgcolor: tokens.surfaceMuted, border: 'none' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <FormControlLabel
                  control={<Switch checked={booking.shareHistory} onChange={(e) => setBooking({ shareHistory: e.target.checked })} />}
                  label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>Share medical history with the doctor</Typography>} />
              </CardContent>
            </Card>
          </SectionCard>
        </Box>
      )}

      {/* Step 3: Confirm & Pay */}
      {active === 3 && (
        <Box sx={{ maxWidth: 560 }}>
          <SectionCard title="Booking Summary">
            {/* Doctor mini-card — filled */}
            <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22`, mb: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={doctor.photo} sx={{ width: 44, height: 44, bgcolor: tokens.primary }}>
                  {doctor.initials}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{doctor.name}</Typography>
                  <Typography sx={{ fontSize: 12, color: tokens.primary, fontWeight: 500 }}>{doctor.specialty}</Typography>
                </Box>
              </CardContent>
            </Card>

            <Stack spacing={1} sx={{ mb: 2 }}>
              <SummaryRow label="Type" value={booking.type === 'clinic' ? 'In-Clinic Visit' : 'Video Call'} />
              <SummaryRow label="Date" value={date.toLocaleDateString('en-IN')} />
              <SummaryRow label="Time" value={booking.slot || '14:30'} />
              <SummaryRow label="Consultation fee" value={`₹${fee}`} />
              <SummaryRow label="Platform fee" value="₹40" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5, borderTop: `1px solid ${tokens.border}` }}>
                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>Total</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 15, color: tokens.primary }}>₹{total}</Typography>
              </Box>
            </Stack>
          </SectionCard>

          <SectionCard title="Payment Method" sx={{ mt: 2 }}>
            <FormControl>
              <RadioGroup defaultValue="upi">
                {[
                  { value: 'upi', label: 'UPI (GPay / PhonePe)' },
                  { value: 'card', label: 'Credit / Debit Card' },
                  { value: 'netbanking', label: 'Net Banking' },
                ].map((pm) => (
                  <FormControlLabel key={pm.value} value={pm.value} control={<Radio size="small" />}
                    label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>{pm.label}</Typography>} />
                ))}
              </RadioGroup>
            </FormControl>

            <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22`, mt: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography sx={{ fontSize: 12, color: tokens.primary, fontWeight: 600 }}>
                  Free cancellation up to 2 hours before the appointment.
                </Typography>
              </CardContent>
            </Card>

            <Button fullWidth variant="contained" size="large" sx={{ mt: 2.5, py: 1.5, borderRadius: 100, fontWeight: 800, fontSize: 15 }}
              onClick={() => setDone(true)}>
              Confirm & Pay ₹{total}
            </Button>
          </SectionCard>
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 1.5, mt: 3, maxWidth: 640 }}>
        {active > 0 && (
          <Button variant="outlined" onClick={() => setActive((a) => a - 1)} sx={{ fontWeight: 700 }}>
            Back
          </Button>
        )}
        {active < 3 && (
          <Button variant="contained"
            disabled={(active === 0 && !booking.type) || (active === 1 && !booking.slot)}
            onClick={() => setActive((a) => a + 1)} sx={{ fontWeight: 700 }}>
            Continue
          </Button>
        )}
      </Box>
    </PageTransition>
  );
}

function SummaryRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}
