import { Box, Paper, Typography, TextField, Grid, Button, Chip, Stack } from '@mui/material';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';

const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: '100px' } };

export default function DoctorProfileEdit() {
  return (
    <PageTransition>
      <PageHeader title="Edit Profile" subtitle="Keep your public profile up to date" />
      <Paper sx={{ border: '1px solid #E5E7EB', borderRadius: '16px', p: 3, maxWidth: 720 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Full Name" defaultValue="Dr. Arvind Rao" sx={fieldSx} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Specialty" defaultValue="Neurology" sx={fieldSx} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Hospital" defaultValue="Apollo Hospital, Hyderabad" sx={fieldSx} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Experience (years)" defaultValue="12" sx={fieldSx} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="In-Clinic Fee" defaultValue="800" sx={fieldSx} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Video Fee" defaultValue="600" sx={fieldSx} /></Grid>
          <Grid size={12}><TextField fullWidth multiline rows={3} label="Bio" defaultValue="Senior neurologist specialising in epilepsy and migraine." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} /></Grid>
        </Grid>
        <Typography sx={{ fontWeight: 600, fontSize: 13, mt: 2, mb: 1 }}>Languages</Typography>
        <Stack direction="row" spacing={1}>
          {['Hindi', 'English', 'Telugu'].map((l) => <Chip key={l} label={l} onDelete={() => {}} sx={{ bgcolor: '#EFF6FF', color: '#2563EB' }} />)}
        </Stack>
        <Button variant="contained" sx={{ mt: 3 }}>Save Profile</Button>
      </Paper>
    </PageTransition>
  );
}
