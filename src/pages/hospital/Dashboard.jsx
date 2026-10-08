import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, Button, TextField,
  Stack, Divider, Paper, Alert, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import BedRoundedIcon from '@mui/icons-material/BedRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../context/AuthContext';
import { hospitalAPI } from '../../services/api';
import { tokens } from '../../theme/theme';

export default function HospitalDashboard() {
  const { user, logout } = useAuth();
  const [hospital, setHospital] = useState(user?.hospitalProfile || null);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editBeds, setEditBeds] = useState(hospital?.availableBeds || 25);
  const [editWait, setEditWait] = useState(hospital?.waitMinutes || 15);
  const [successAlert, setSuccessAlert] = useState('');

  useEffect(() => {
    if (user?.hospitalProfile) {
      setHospital(user.hospitalProfile);
      setEditBeds(user.hospitalProfile.availableBeds || 25);
      setEditWait(user.hospitalProfile.waitMinutes || 15);
    }
  }, [user]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data } = await hospitalAPI.updateMyHospital({
        availableBeds: Number(editBeds),
        waitMinutes: Number(editWait),
      });
      setHospital(data);
      setSuccessAlert('Emergency capacity updated successfully.');
      setEditOpen(false);
    } catch (err) {
      alert(`Update failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isPending = !hospital || hospital.verificationStatus === 'Pending';
  const hospitalName = hospital?.name || user?.name || 'Medical Facility';
  const hospitalCity = hospital?.city || 'India';
  const licenseNo = hospital?.licenseNumber || 'License on file';

  return (
    <PageTransition>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
        {/* Header Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LocalHospitalRoundedIcon sx={{ color: '#7C3AED', fontSize: 32 }} />
              <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 28 }, letterSpacing: '-0.02em', color: '#111827' }}>
                {hospitalName}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13, color: '#6B7280', mt: 0.5 }}>
              {hospital?.type || 'Multi-Specialty'} · {hospitalCity} · Institutional Portal
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditRoundedIcon />}
              onClick={() => setEditOpen(true)}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
            >
              Update Live Beds
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={logout}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
            >
              Sign Out
            </Button>
          </Box>
        </Box>

        {successAlert && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setSuccessAlert('')}>
            {successAlert}
          </Alert>
        )}

        {/* Verification Status Banner */}
        {isPending ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <VerifiedRoundedIcon sx={{ color: '#D97706', fontSize: 36, mt: 0.25 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 800, fontSize: 17, color: '#92400E' }}>
                  Institutional Clinical Establishment Review Pending
                </Typography>
                <Chip label="Pending Approval" size="small" sx={{ bgcolor: '#FDE68A', color: '#92400E', fontWeight: 700 }} />
              </Box>
              <Typography sx={{ fontSize: 14, color: '#B45309', lineHeight: 1.6 }}>
                Your hospital application with Clinical Establishment License <strong>{licenseNo}</strong> is currently being reviewed by the Sushruth platform administrators. Once approved, your facility will immediately go live on the nationwide hospital directory for OPD appointments and emergency bookings.
              </Typography>
            </Box>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <CheckCircleRoundedIcon sx={{ color: '#15803D', fontSize: 36 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 17, color: '#14532D' }}>
                  Verified Healthcare Establishment
                </Typography>
                <Chip label="Live on Directory" size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 700 }} />
              </Box>
              <Typography sx={{ fontSize: 13, color: '#166534', mt: 0.5 }}>
                Your hospital is verified and actively accepting patient consultations and bed inquiries.
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Operational Statistics */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '14px', border: '1px solid #E5E7EB', p: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Total Beds</Typography>
                  <BedRoundedIcon sx={{ color: '#7C3AED' }} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: 26, color: '#111827' }}>
                  {hospital?.totalBeds || 150}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Registered capacity</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '14px', border: '1px solid #E5E7EB', p: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Available Beds</Typography>
                  <BedRoundedIcon sx={{ color: '#10B981' }} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: 26, color: '#10B981' }}>
                  {hospital?.availableBeds || 35}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Ready for admission</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '14px', border: '1px solid #E5E7EB', p: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Avg OPD Wait</Typography>
                  <AccessTimeRoundedIcon sx={{ color: '#F59E0B' }} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: 26, color: '#111827' }}>
                  ~{hospital?.waitMinutes || 15}m
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Reported to patients</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '14px', border: '1px solid #E5E7EB', p: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Establishment License</Typography>
                  <VerifiedRoundedIcon sx={{ color: '#0F52BA' }} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: 15, fontFamily: 'monospace', color: '#1E40AF', mt: 1 }}>
                  {licenseNo}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7280', mt: 0.5 }}>State Registry</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Information & Preview */}
        <Grid container spacing={3}>
          {/* Left: Facilities & Info */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: '16px', border: '1px solid #E5E7EB', p: 2 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 2, color: '#111827' }}>
                  Institutional Profile & Facilities
                </Typography>

                <Stack spacing={2.5}>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', mb: 0.5 }}>
                      Address & Location
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnRoundedIcon sx={{ color: '#6B7280', fontSize: 18 }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                        {hospital?.address ? `${hospital.address}, ` : ''}{hospitalCity}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', mb: 0.5 }}>
                      Official Emergency Contact
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneInTalkRoundedIcon sx={{ color: '#6B7280', fontSize: 18 }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                        {user?.phone || '+91 40 2360 7777'} · {user?.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography sx={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', mb: 1.5 }}>
                      Verified Emergency Infrastructure & Facilities
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(hospital?.facilities || [
                        '24/7 Emergency', 'ICU Facilities', 'Advanced MRI', 'In-house Pharmacy', 'Blood Bank', 'Ambulance'
                      ]).map((f) => (
                        <Chip
                          key={f}
                          label={f}
                          sx={{
                            bgcolor: '#F5F3FF',
                            color: '#7C3AED',
                            fontWeight: 700,
                            fontSize: 12,
                            borderRadius: '8px',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Public Directory Listing Preview */}
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: '16px', border: '1px solid #E5E7EB', p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <VisibilityOutlinedIcon sx={{ color: '#0F52BA' }} />
                  <Typography sx={{ fontWeight: 800, fontSize: 16, color: '#111827' }}>
                    Patient Directory Preview
                  </Typography>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    border: '1px solid #E5E7EB',
                    bgcolor: '#FAF5FF',
                  }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: 16, color: '#111827' }}>
                    {hospitalName}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#6B7280', mt: 0.25 }}>
                    {hospitalCity.toUpperCase()}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                    <Chip
                      label={hospital?.type || 'Multi-Specialty'}
                      size="small"
                      sx={{ bgcolor: '#EDE9FE', color: '#6D28D9', fontWeight: 700, fontSize: 11 }}
                    />
                    <Chip
                      label={`Wait: ~${hospital?.waitMinutes || 15}m`}
                      size="small"
                      sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: 11 }}
                    />
                  </Box>

                  <Typography sx={{ fontSize: 12, color: '#4B5563', mt: 2, lineHeight: 1.5 }}>
                    Accredited facility with 24/7 emergency unit, {hospital?.totalBeds || 150} beds, and specialist OPD booking.
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    disabled
                    sx={{ mt: 2, bgcolor: '#7C3AED', textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
                  >
                    Book OPD Visit (Patient View)
                  </Button>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Modal to update live beds */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
          <DialogTitle sx={{ fontWeight: 800 }}>Update Live Facility Status</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                type="number"
                label="Currently Available Beds"
                value={editBeds}
                onChange={(e) => setEditBeds(e.target.value)}
                helperText="Available in ICU and general admission"
              />
              <TextField
                fullWidth
                type="number"
                label="Average OPD Wait Time (minutes)"
                value={editWait}
                onChange={(e) => setEditWait(e.target.value)}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate} disabled={loading} sx={{ bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6D28D9' } }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Live Status'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageTransition>
  );
}
