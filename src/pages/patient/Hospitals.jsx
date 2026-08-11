import { Box, Typography, Grid, Card, Button, Stack } from '@mui/material';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import BedRoundedIcon from '@mui/icons-material/BedRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import SmartImage from '../../components/SmartImage';
import { scenes } from '../../data/assets';
import { tokens } from '../../theme/theme';

const hospitals = [
  { name: 'Apollo Hospitals', city: 'HYDERABAD, TELANGANA, INDIA', rating: 4.8, type: 'Multi-Specialty', img: scenes.lab, price: '₹110', distance: '56KM', availability: 'Wait: ~15m', reviews: '1.3k' },
  { name: 'Fortis Hospital', city: 'MUMBAI, MAHARASHTRA, INDIA', rating: 4.7, type: 'Super-Specialty', img: scenes.heart, price: '₹85', distance: '12KM', availability: 'Open 24/7', reviews: '2.1k' },
  { name: 'AIIMS New Delhi', city: 'NEW DELHI, NCR, INDIA', rating: 4.9, type: 'Academic Medical Centre', img: scenes.wellness, price: '₹150', distance: '8KM', availability: 'Open 24/7', reviews: '5.6k' },
  { name: 'Manipal Hospital', city: 'BENGALURU, KARNATAKA, INDIA', rating: 4.6, type: 'Multi-Specialty', img: scenes.article2, price: '₹95', distance: '120KM', availability: 'Wait: ~30m', reviews: '800' },
  { name: 'Max Super Speciality', city: 'GURUGRAM, HARYANA, INDIA', rating: 4.7, type: 'Super-Specialty', img: scenes.nutrition, price: '₹120', distance: '22KM', availability: 'Open 24/7', reviews: '3.2k' },
  { name: 'Lilavati Hospital', city: 'MUMBAI, MAHARASHTRA, INDIA', rating: 4.5, type: 'Multi-Specialty', img: scenes.lab, price: '₹100', distance: '18KM', availability: 'Wait: ~5m', reviews: '1.5k' },
];

export default function Hospitals() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', mb: 1 }}>
            Trusted Hospitals, Nationwide
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#6B7280' }}>
            Book at accredited hospitals with verified specialists and world-class facilities.
          </Typography>
        </Box>

        <Stack spacing={3}>
          {hospitals.map((h, i) => (
            <Card key={i} onClick={() => navigate('/hospitals/1')}
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
                  onClick={(e) => { e.stopPropagation(); navigate('/hospitals/1'); }}
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
                  {h.price} <Typography component="span" sx={{ fontSize: 13, fontWeight: 500, color: tokens.textSecondary }}>(General)</Typography>
                </Typography>
                <Button 
                  onClick={(e) => { e.stopPropagation(); navigate('/hospitals/1'); }}
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
        </Stack>
      </Box>
    </PageTransition>
  );
}
