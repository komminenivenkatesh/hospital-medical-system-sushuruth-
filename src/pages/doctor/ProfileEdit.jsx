import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Grid, Button, Chip, Stack,
  CircularProgress, Alert, Snackbar, InputAdornment, IconButton,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import { doctorAPI } from '../../services/api';

const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: '100px' } };

export default function DoctorProfileEdit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    specialty: '',
    hospital: '',
    experienceYears: 0,
    consultationFee: 500,
    videoFee: 600,
    bio: '',
    languages: ['English', 'Hindi'],
  });

  const [newLang, setNewLang] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await doctorAPI.getMyProfile();
        setForm({
          name: data.user?.name || '',
          specialty: data.specialty || '',
          hospital: data.hospital || '',
          experienceYears: data.experienceYears ?? 0,
          consultationFee: data.consultationFee ?? 500,
          videoFee: data.videoFee ?? 600,
          bio: data.bio || '',
          languages: data.languages?.length ? data.languages : ['English', 'Hindi'],
        });
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
        setError('Failed to fetch doctor profile. Please ensure you are logged in as a doctor.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddLanguage = () => {
    if (newLang.trim() && !form.languages.includes(newLang.trim())) {
      setForm((prev) => ({ ...prev, languages: [...prev.languages, newLang.trim()] }));
      setNewLang('');
    }
  };

  const handleRemoveLanguage = (langToRemove) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== langToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await doctorAPI.updateMyProfile(form);
      setSuccess(true);
    } catch (err) {
      console.error('Save failed:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <PageHeader title="Edit Profile" subtitle="Keep your public profile up to date" />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHeader title="Edit Profile" subtitle="Keep your public profile up to date" />

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', maxWidth: 720 }}>
          {error}
        </Alert>
      )}

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{ border: '1px solid #E5E7EB', borderRadius: '16px', p: 3, maxWidth: 720 }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={form.name}
              onChange={handleChange('name')}
              sx={fieldSx}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Specialty"
              value={form.specialty}
              onChange={handleChange('specialty')}
              sx={fieldSx}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Hospital / Clinic"
              value={form.hospital}
              onChange={handleChange('hospital')}
              sx={fieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Experience (years)"
              value={form.experienceYears}
              onChange={handleChange('experienceYears')}
              sx={fieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="In-Clinic Fee (₹)"
              value={form.consultationFee}
              onChange={handleChange('consultationFee')}
              sx={fieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Video Fee (₹)"
              value={form.videoFee}
              onChange={handleChange('videoFee')}
              sx={fieldSx}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Bio & Clinical Background"
              value={form.bio}
              onChange={handleChange('bio')}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              placeholder="Tell patients about your medical background, areas of expertise, and credentials..."
            />
          </Grid>
        </Grid>

        <Typography sx={{ fontWeight: 600, fontSize: 13, mt: 3, mb: 1 }}>
          Languages Spoken
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
          {form.languages.map((l) => (
            <Chip
              key={l}
              label={l}
              onDelete={() => handleRemoveLanguage(l)}
              sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600 }}
            />
          ))}
        </Stack>

        <Box sx={{ display: 'flex', gap: 1, maxWidth: 300, mb: 3 }}>
          <TextField
            size="small"
            placeholder="Add language..."
            value={newLang}
            onChange={(e) => setNewLang(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddLanguage();
              }
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '100px' } }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddLanguage}
            sx={{ borderRadius: '100px', minWidth: 40 }}
          >
            <AddRoundedIcon fontSize="small" />
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ px: 4, py: 1, borderRadius: '100px' }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        message="Profile updated successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </PageTransition>
  );
}
