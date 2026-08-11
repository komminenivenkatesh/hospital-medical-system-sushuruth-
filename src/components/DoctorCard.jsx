import { Box, Card, CardContent, Typography, Avatar, Button, Rating, Chip, Stack, Grid } from '@mui/material';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../theme/theme';

function getRatingColor(rating) {
  if (rating >= 4.8) return tokens.success;
  if (rating >= 4.5) return '#F59E0B';
  if (rating >= 4.0) return '#F97316';
  return '#EF4444';
}

export function DoctorMiniCard({ doctor }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ width: 170, flexShrink: 0, transition: 'all 0.2s',
      '&:hover': { borderColor: tokens.primary, boxShadow: tokens.cardShadowHover } }}>
      <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
        <Box sx={{ position: 'relative', width: 60, height: 60, mx: 'auto', mb: 1 }}>
          <Avatar src={doctor.photo} sx={{ width: 60, height: 60, bgcolor: tokens.primary, fontWeight: 700, fontSize: 18, border: `2px solid ${tokens.border}` }}>
            {doctor.initials}
          </Avatar>
          {doctor.verified && (
            <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: '50%',
              bgcolor: tokens.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
              <VerifiedRoundedIcon sx={{ fontSize: 12, color: '#fff' }} />
            </Box>
          )}
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2, mb: 0.25 }}>{doctor.name}</Typography>
        <Typography sx={{ fontSize: 11, color: tokens.textSecondary, mb: 0.75 }}>{doctor.specialty}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
          <Rating value={doctor.rating} precision={0.1} readOnly size="small" sx={{ fontSize: 13 }} />
          <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>({doctor.reviews})</Typography>
        </Box>
        {doctor.availableToday && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
            <AccessTimeRoundedIcon sx={{ fontSize: 12, color: tokens.success }} />
            <Typography sx={{ fontSize: 12, color: tokens.success, fontWeight: 600 }}>{doctor.nextSlot}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 14 }}>₹{doctor.videoFee}</Typography>
          <Button size="small" variant="contained" onClick={() => navigate(`/booking/${doctor.id}`)}
            sx={{ minWidth: 0, px: 2, py: 0.4, fontSize: 12, fontWeight: 700 }}>Book</Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export function DoctorGridCard({ doctor }) {
  const navigate = useNavigate();
  const ratingColor = getRatingColor(doctor.rating);
  const tags = doctor.tags || [];
  const visibleTags = tags.slice(0, 3);
  const extraTags = tags.length - visibleTags.length;
  const consultations = doctor.consultations || doctor.reviews * 5;
  const consultLabel = consultations >= 1000 ? `${(consultations / 1000).toFixed(consultations % 1000 === 0 ? 0 : 1)}k+` : `${consultations}+`;

  return (
    <Card
      onClick={() => navigate(`/doctors/${doctor.id}`)}
      sx={{
        height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column',
        borderRadius: 3, transition: 'all 200ms ease',
        '&:hover': { borderColor: tokens.primary, boxShadow: tokens.cardShadowHover, transform: 'translateY(-3px)' },
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 2.5 } }}>
        {/* Header: avatar + name + specialty */}
        <Box sx={{ display: 'flex', gap: 1.75, mb: 1.75 }}>
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar src={doctor.photo}
              sx={{ width: 56, height: 56, bgcolor: tokens.primarySoft, color: tokens.primary, fontWeight: 800, fontSize: 18 }}>
              {doctor.initials}
            </Avatar>
            {doctor.verified && (
              <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%',
                bgcolor: tokens.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                <VerifiedRoundedIcon sx={{ fontSize: 10, color: '#fff' }} />
              </Box>
            )}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: tokens.textPrimary, lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doctor.name}
            </Typography>
            <Typography sx={{ fontSize: 13, color: tokens.textSecondary, fontWeight: 500 }}>
              {doctor.specialty}
            </Typography>
          </Box>
        </Box>

        {/* Rating pill + location */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, bgcolor: ratingColor, borderRadius: 100, px: 0.9, py: 0.3 }}>
            <StarRoundedIcon sx={{ fontSize: 13, color: '#fff' }} />
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{doctor.rating}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, minWidth: 0 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 14, color: tokens.textTertiary, flexShrink: 0 }} />
            <Typography sx={{ fontSize: 12, color: tokens.textSecondary, fontWeight: 500,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doctor.city || doctor.hospital.split(',').pop().trim()}, India
            </Typography>
          </Box>
        </Box>

        {/* Experience + consultations */}
        <Box sx={{ mb: 1.5 }}>
          <Typography sx={{ fontSize: 12.5, color: tokens.textSecondary, lineHeight: 1.6 }}>
            {doctor.experience} yrs of exp.
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: tokens.textSecondary, lineHeight: 1.6 }}>
            {consultLabel} consultations
          </Typography>
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2, minHeight: 26 }}>
          {visibleTags.map((tag) => (
            <Chip key={tag} label={tag} size="small"
              sx={{ height: 26, fontSize: 11, fontWeight: 600, bgcolor: tokens.surfaceMuted, color: tokens.textSecondary, borderRadius: 100 }} />
          ))}
          {extraTags > 0 && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 26, minWidth: 26, px: 0.75,
              borderRadius: 100, bgcolor: tokens.surfaceMuted, color: tokens.textTertiary, fontSize: 11, fontWeight: 700,
              border: `1px solid ${tokens.border}` }}>
              +{extraTags}
            </Box>
          )}
        </Box>

        {/* Price + Book */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 'auto', pt: 1.5,
          borderTop: `1px solid ${tokens.border}` }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 17, color: tokens.textPrimary, lineHeight: 1.2 }}>
              ₹{doctor.videoFee}<Typography component="span" sx={{ fontSize: 12, fontWeight: 600, color: tokens.textTertiary }}>/visit</Typography>
            </Typography>
            <Typography sx={{ fontSize: 11, color: tokens.textTertiary, fontWeight: 500 }}>
              {doctor.mode || (doctor.availableToday ? 'Online/Offline' : 'Offline')}
            </Typography>
          </Box>
          <Button variant="contained"
            onClick={(e) => { e.stopPropagation(); navigate(`/booking/${doctor.id}`); }}
            sx={{ px: 2.25, py: 1, borderRadius: 100, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
            Book Consultation
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export function DoctorRowCard({ doctor }) {
  const navigate = useNavigate();
  const booked = !doctor.availableToday;
  return (
    <Card sx={{ overflow: 'hidden', transition: 'all 0.2s',
      '&:hover': { borderColor: tokens.primary, boxShadow: tokens.cardShadowHover } }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ height: 4, bgcolor: booked ? tokens.textTertiary : tokens.primary }} />

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar src={doctor.photo} sx={{ width: 72, height: 72, bgcolor: tokens.primary, fontWeight: 800, fontSize: 24,
                    border: `2px solid ${tokens.border}` }}>
                    {doctor.initials}
                  </Avatar>
                  {doctor.verified && (
                    <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: '50%',
                      bgcolor: tokens.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                      <VerifiedRoundedIcon sx={{ fontSize: 13, color: '#fff' }} />
                    </Box>
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 18 }}>{doctor.name}</Typography>
                  </Box>
                  <Typography sx={{ color: tokens.textSecondary, fontSize: 14, fontWeight: 500, mb: 1 }}>
                    {doctor.specialty}{doctor.subSpecialty ? ` · ${doctor.subSpecialty}` : ''}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip size="small" icon={<LocationOnOutlinedIcon />} label={doctor.hospital}
                      sx={{ height: 24, fontSize: 12, fontWeight: 500, bgcolor: tokens.surfaceMuted, color: tokens.textSecondary,
                        '& .MuiChip-icon': { fontSize: 14, color: tokens.textTertiary } }} />
                    <Chip size="small" icon={<WorkOutlineRoundedIcon />} label={`${doctor.experience} yrs exp`}
                      sx={{ height: 24, fontSize: 12, fontWeight: 600, bgcolor: tokens.primarySoft, color: tokens.primary,
                        '& .MuiChip-icon': { fontSize: 14, color: tokens.primary } }} />
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 3.5 }}>
              <Stack spacing={0.75}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Rating value={doctor.rating} precision={0.1} readOnly size="small" sx={{ fontSize: 15 }} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: tokens.textPrimary }}>
                    {doctor.rating}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: tokens.textTertiary }}>
                    ({doctor.reviews} reviews)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TranslateRoundedIcon sx={{ fontSize: 14, color: tokens.textTertiary }} />
                  <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>
                    {doctor.languages.join(', ')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip size="small" icon={<VideocamRoundedIcon />} label={`₹${doctor.videoFee}`}
                    sx={{ height: 22, fontSize: 11, fontWeight: 700, bgcolor: tokens.primarySoft, color: tokens.primary,
                      '& .MuiChip-icon': { fontSize: 13, color: tokens.primary } }} />
                  <Chip size="small" icon={<LocalHospitalRoundedIcon />} label={`₹${doctor.inClinicFee}`}
                    sx={{ height: 22, fontSize: 11, fontWeight: 700, bgcolor: tokens.successSoft, color: tokens.success,
                      '& .MuiChip-icon': { fontSize: 13, color: tokens.success } }} />
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 3.5 }}>
              <Stack spacing={1} sx={{ alignItems: { xs: 'stretch', md: 'flex-end' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: booked ? tokens.textTertiary : tokens.success,
                    boxShadow: booked ? 'none' : `0 0 0 3px ${tokens.success}30` }} />
                  <Typography sx={{ fontSize: 12, color: booked ? tokens.textTertiary : tokens.success, fontWeight: 700 }}>
                    {booked ? 'Fully booked today' : `Next: ${doctor.nextSlot.replace('Today ', '')}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, maxWidth: 260 }}>
                  <Button variant="outlined" fullWidth onClick={() => navigate(`/doctors/${doctor.id}`)}
                    sx={{ fontWeight: 700, borderRadius: 2 }}>
                    Profile
                  </Button>
                  <Button variant="contained" fullWidth onClick={() => navigate(`/booking/${doctor.id}`)}
                    sx={{ fontWeight: 700, borderRadius: 2 }}>
                    {booked ? 'Waitlist' : 'Book Now'}
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
