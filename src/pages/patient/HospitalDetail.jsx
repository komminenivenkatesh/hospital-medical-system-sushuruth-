import { Box, Typography, Grid, Button, Stack, Chip, Divider, Avatar, Card, MenuItem, Select, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, Paper } from '@mui/material';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import { useNavigate, useParams } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import SmartImage from '../../components/SmartImage';
import { scenes, doctorPhotos } from '../../data/assets';
import { tokens } from '../../theme/theme';
import { useState } from 'react';
import useStore from '../../store/useStore';

const DUMMY_HOSPITAL = { 
  id: 1,
  name: 'Apollo Hospitals', 
  city: 'Jubilee Hills, Hyderabad, Telangana', 
  rating: 4.8, 
  type: 'Multi-Specialty', 
  img: scenes.lab, 
  price: '₹110', 
  distance: '56KM', 
  availability: 'Wait: ~15m', 
  reviews: '1.3k',
  description: 'Apollo Hospitals is a premier multi-specialty healthcare facility offering world-class medical services. Equipped with state-of-the-art technology and staffed by internationally trained specialists, we provide comprehensive care across all major disciplines.',
  features: ['24/7 Emergency', 'ICU Facilities', 'Advanced MRI', 'In-house Pharmacy', 'Blood Bank', 'Cafeteria', 'Ambulance', 'Parking']
};

const dates = ['Today, Oct 12', 'Tomorrow, Oct 13', 'Thu, Oct 14', 'Fri, Oct 15'];
const slots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:00 PM'];

export default function HospitalDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const h = DUMMY_HOSPITAL;
  const allDoctors = useStore((s) => s.doctors);
  const hospitalDoctors = allDoctors.slice(0, 4);

  const [bookingType, setBookingType] = useState('general');
  const [selectedDoctor, setSelectedDoctor] = useState(hospitalDoctors[0].id);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(2);

  const currentDoctor = hospitalDoctors.find(d => d.id === selectedDoctor);
  const finalPrice = bookingType === 'specialist' && currentDoctor ? `₹${currentDoctor.fee}` : h.price;

  return (
    <PageTransition>
      <Box sx={{ pb: 10 }}>
        {/* Back button */}
        <Button 
          startIcon={<ArrowBackRoundedIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: tokens.textSecondary, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: tokens.surface } }}
        >
          Back to Hospitals
        </Button>

        <Grid container spacing={4}>
          {/* Left Column: Details */}
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Box sx={{ width: '100%', height: { xs: 250, md: 400 }, borderRadius: 4, overflow: 'hidden', mb: 4, position: 'relative' }}>
              <SmartImage src={h.img} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <Box sx={{ position: 'absolute', bottom: 16, left: 16, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', px: 2, py: 1, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapRoundedIcon sx={{ color: tokens.primary, fontSize: 18 }} />
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: tokens.textPrimary }}>{h.city}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Chip icon={<LocalHospitalRoundedIcon sx={{ fontSize: 16 }} />} label={h.type} sx={{ bgcolor: tokens.primarySoft, color: tokens.primary, fontWeight: 700, borderRadius: 2 }} size="small" />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#F5A623' }}>
                <StarRoundedIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontWeight: 700, color: tokens.textPrimary }}>{h.rating}</Typography>
                <Typography sx={{ color: tokens.textSecondary, fontSize: 13 }}>({h.reviews} reviews)</Typography>
              </Box>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, color: tokens.textPrimary, mb: 1, fontFamily: 'Georgia, serif' }}>
              {h.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.textSecondary, mb: 4 }}>
              <LocationOnRoundedIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontWeight: 500 }}>{h.city} • {h.distance} away from your location</Typography>
            </Box>

            <Divider sx={{ my: 4, borderColor: tokens.border }} />

            <Typography variant="h5" sx={{ fontWeight: 700, color: tokens.textPrimary, mb: 2 }}>
              Why book here?
            </Typography>
            <Typography sx={{ color: tokens.textSecondary, lineHeight: 1.7, fontSize: 15, mb: 4 }}>
              {h.description}
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 700, color: tokens.textPrimary, mb: 2 }}>
              Facilities & Amenities
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {h.features.map(f => (
                <Grid size={{ xs: 6, sm: 4 }} key={f}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineRoundedIcon sx={{ fontSize: 20, color: tokens.primary }} />
                    <Typography sx={{ fontWeight: 500, color: tokens.textPrimary }}>{f}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 4, borderColor: tokens.border }} />

            <Typography variant="h5" sx={{ fontWeight: 700, color: tokens.textPrimary, mb: 3 }}>
              Meet the Specialists
            </Typography>
            <Typography sx={{ color: tokens.textSecondary, fontSize: 14, mb: 3 }}>
              You can select a specific doctor during the booking process on the right.
            </Typography>
            <Grid container spacing={3}>
              {hospitalDoctors.map(doc => (
                <Grid size={{ xs: 12, sm: 6 }} key={doc.id}>
                  <Card sx={{ p: 2, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: `1px solid ${tokens.border}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={doc.image} sx={{ width: 56, height: 56 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{doc.name}</Typography>
                        <Typography sx={{ fontSize: 13, color: tokens.primary, fontWeight: 600 }}>{doc.specialty}</Typography>
                        <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>Fee: ₹{doc.fee}</Typography>
                      </Box>
                    </Box>
                    <Button 
                      onClick={() => window.open(`/doctors/${doc.id}`, '_blank')}
                      variant="outlined" 
                      size="small" 
                      sx={{ borderRadius: 6, textTransform: 'none', fontWeight: 600, borderColor: tokens.border, color: tokens.textPrimary }}
                    >
                      View Profile
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>

          </Grid>

          {/* Right Column: Intelligent Booking Flow */}
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)', border: `1px solid ${tokens.border}` }}>
                <Typography sx={{ fontSize: 20, fontWeight: 800, color: tokens.textPrimary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentRoundedIcon sx={{ color: tokens.primary }} />
                  Setup your Appointment
                </Typography>

                {/* Step 1: What are you booking? */}
                <Typography sx={{ fontWeight: 700, mb: 1.5, fontSize: 14, color: tokens.textSecondary }}>1. What do you need?</Typography>
                <RadioGroup 
                  value={bookingType} 
                  onChange={(e) => setBookingType(e.target.value)}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}
                >
                  <Paper variant="outlined" sx={{ p: 1, borderRadius: 3, borderColor: bookingType === 'general' ? tokens.primary : tokens.border, bgcolor: bookingType === 'general' ? tokens.primarySoft : 'transparent', transition: 'all 0.2s' }}>
                    <FormControlLabel value="general" control={<Radio size="small" />} label={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>General Checkup</Typography>} sx={{ m: 0, width: '100%' }} />
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 1, borderRadius: 3, borderColor: bookingType === 'specialist' ? tokens.primary : tokens.border, bgcolor: bookingType === 'specialist' ? tokens.primarySoft : 'transparent', transition: 'all 0.2s' }}>
                    <FormControlLabel value="specialist" control={<Radio size="small" />} label={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>Specialist Consultation</Typography>} sx={{ m: 0, width: '100%' }} />
                  </Paper>
                </RadioGroup>

                {/* Step 2: Who is taking care of you? (Only if Specialist) */}
                {bookingType === 'specialist' && (
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontWeight: 700, mb: 1.5, fontSize: 14, color: tokens.textSecondary }}>2. Select a Specialist</Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        sx={{ borderRadius: 3, fontWeight: 600 }}
                      >
                        {hospitalDoctors.map(doc => (
                          <MenuItem key={doc.id} value={doc.id} sx={{ py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar src={doc.image} sx={{ width: 28, height: 28 }} />
                              <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{doc.name}</Typography>
                                <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{doc.specialty} • ₹{doc.fee}</Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button 
                      onClick={() => window.open(`/doctors/${currentDoctor?.id}`, '_blank')}
                      sx={{ mt: 1, textTransform: 'none', fontSize: 13, fontWeight: 600, p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                    >
                      View Doctor Profile (Opens in new tab)
                    </Button>
                  </Box>
                )}

                {/* Step 3: When? */}
                <Typography sx={{ fontWeight: 700, mb: 1.5, fontSize: 14, color: tokens.textSecondary }}>
                  {bookingType === 'specialist' ? '3.' : '2.'} Choose Date & Time
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1, mb: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
                  {dates.map((date, i) => (
                    <Box key={i} onClick={() => setSelectedDate(i)}
                      sx={{ 
                        flexShrink: 0,
                        px: 2, py: 1.5, 
                        borderRadius: 3, 
                        border: `1px solid ${selectedDate === i ? tokens.primary : tokens.border}`,
                        bgcolor: selectedDate === i ? tokens.primary : 'transparent',
                        color: selectedDate === i ? '#fff' : tokens.textPrimary,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{date.split(',')[0]}</Typography>
                      <Typography sx={{ fontSize: 11, opacity: 0.8 }}>{date.split(',')[1]}</Typography>
                    </Box>
                  ))}
                </Stack>

                <Grid container spacing={1} sx={{ mb: 4 }}>
                  {slots.map((slot, i) => (
                    <Grid size={{ xs: 4 }} key={i}>
                      <Box onClick={() => setSelectedSlot(i)}
                        sx={{
                          py: 1,
                          borderRadius: 2,
                          border: `1px solid ${selectedSlot === i ? tokens.primary : tokens.border}`,
                          bgcolor: selectedSlot === i ? tokens.primarySoft : 'transparent',
                          color: selectedSlot === i ? tokens.primary : tokens.textPrimary,
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: 12,
                          transition: 'all 0.2s'
                        }}>
                        {slot}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Final Summary */}
                <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: 3, mb: 3 }}>
                  <Typography sx={{ fontSize: 12, color: tokens.textSecondary, mb: 0.5 }}>Estimated Total</Typography>
                  <Typography sx={{ fontSize: 24, fontWeight: 800, color: tokens.textPrimary }}>
                    {finalPrice}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <VerifiedUserRoundedIcon sx={{ fontSize: 14, color: tokens.primary }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: tokens.textSecondary }}>Insurance applicable</Typography>
                  </Box>
                </Box>

                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate('/chat')}
                  sx={{ 
                    bgcolor: tokens.primary, 
                    color: '#fff', 
                    py: 2, 
                    borderRadius: 3, 
                    fontSize: 16, 
                    fontWeight: 700, 
                    textTransform: 'none',
                    boxShadow: `0 8px 24px ${tokens.primary}40`,
                    '&:hover': { bgcolor: tokens.primaryDark, boxShadow: `0 12px 32px ${tokens.primary}60` } 
                  }}
                >
                  Confirm Appointment
                </Button>
                <Typography sx={{ textAlign: 'center', fontSize: 12, color: tokens.textSecondary, mt: 2 }}>
                  You will pay directly at the hospital.
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PageTransition>
  );
}
