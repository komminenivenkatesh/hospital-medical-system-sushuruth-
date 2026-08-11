import { Box, Card, CardContent, Typography, Avatar, Chip, Button, Grid, Stack } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import SectionCard from '../../components/SectionCard';
import { familyMembers } from '../../data/prescriptions';
import { tokens } from '../../theme/theme';

export default function Family() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, letterSpacing: '-0.02em' }}>
          My Family
        </Typography>
        <Typography sx={{ fontSize: 14, color: tokens.textSecondary }}>
          Manage health for everyone you care about
        </Typography>
      </Box>

      {/* Stats strip — filled */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22` }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: 28, color: tokens.primary }}>{familyMembers.length}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: tokens.primary }}>Members</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ bgcolor: tokens.successSoft, border: `1px solid ${tokens.success}22` }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: 28, color: tokens.success }}>
                {familyMembers.filter(m => m.primary).length}
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: tokens.success }}>Primary</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ bgcolor: tokens.surfaceMuted }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: 28, color: tokens.textPrimary }}>2</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: tokens.textSecondary }}>Active Plans</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {familyMembers.map((m) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={m.id}>
            <Card sx={{ overflow: 'hidden', transition: 'all 0.2s',
              '&:hover': { borderColor: tokens.primary, boxShadow: tokens.cardShadowHover } }}>
              <Box sx={{ height: 4, bgcolor: m.primary ? tokens.primary : tokens.border }} />
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, textAlign: 'center' }}>
                <Avatar sx={{ width: 64, height: 64, mx: 'auto', bgcolor: tokens.primarySoft, color: tokens.primary,
                  fontWeight: 800, fontSize: 22, mb: 1.5 }}>
                  {m.initials}
                </Avatar>
                <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 0.5 }}>{m.name}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={m.relation} size="small"
                    sx={{ bgcolor: tokens.surfaceMuted, color: tokens.textSecondary, fontWeight: 600, fontSize: 11 }} />
                  {m.primary && (
                    <Chip label="Primary" size="small"
                      sx={{ bgcolor: tokens.primarySoft, color: tokens.primary, fontWeight: 700, fontSize: 11 }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button fullWidth variant="outlined" size="small" onClick={() => navigate('/health')}
                    sx={{ fontWeight: 700, fontSize: 12 }}>
                    View Health
                  </Button>
                  <Button fullWidth variant="contained" size="small" onClick={() => navigate('/find-doctors')}
                    sx={{ fontWeight: 700, fontSize: 12 }}>
                    Book
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Button variant="outlined" startIcon={<AddRoundedIcon />} sx={{ fontWeight: 700 }}>
          Add Family Member
        </Button>
      </Box>

      {/* Family Doctor — filled card */}
      <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22`, overflow: 'hidden' }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: tokens.primary, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1.5 }}>
            Your Family Doctor
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: tokens.primary, color: '#fff', fontWeight: 700, fontSize: 18 }}>PM</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Dr. Priya Mehta</Typography>
              <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>General Physician · Fortis Hospital, Mumbai</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <StarRoundedIcon sx={{ fontSize: 14, color: tokens.warning }} />
                <Typography sx={{ fontSize: 12, color: tokens.textSecondary, fontWeight: 600 }}>4.9 · ₹500/consultation</Typography>
              </Box>
            </Box>
          </Box>
          <Button fullWidth variant="contained" sx={{ mt: 2.5, fontWeight: 700, borderRadius: 100 }}
            onClick={() => navigate('/booking/d002')}>
            Book Appointment
          </Button>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
