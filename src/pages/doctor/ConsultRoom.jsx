import { useState, useEffect } from 'react';
import {
  Box, Paper, IconButton, Fab, Typography, Tabs, Tab, Chip, TextField, Button,
  Autocomplete, Stack,
} from '@mui/material';
import MicNoneIcon from '@mui/icons-material/MicNone';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const drugs = ['Amitriptyline', 'Sumatriptan', 'Propranolol', 'Topiramate', 'Gabapentin', 'Levetiracetam'];

export default function DoctorConsultRoom() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => { const t = setInterval(() => setSeconds((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#0F172A', display: 'flex' }}>
      <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ position: 'absolute', top: 20, left: 24, color: '#fff', fontWeight: 700, fontSize: 20 }}>{mm}:{ss}</Typography>
        <Box sx={{ width: '80%', height: '74%', borderRadius: '8px', bgcolor: '#1E293B',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ width: 88, height: 88, borderRadius: '50%', bgcolor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 28 }}>MS</Box>
          <Typography sx={{ color: '#fff', fontWeight: 600 }}>Meera Sharma</Typography>
          <Typography sx={{ color: '#64748B', fontSize: 13 }}>34F · connected</Typography>
        </Box>
        <Paper sx={{ position: 'absolute', bottom: 24, bgcolor: '#1E293B', borderRadius: '100px', px: 2.5, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton sx={{ color: '#fff' }}><MicNoneIcon /></IconButton>
          <IconButton sx={{ color: '#fff' }}><VideocamIcon /></IconButton>
          <Fab color="error" size="medium" sx={{ ml: 1, boxShadow: 'none' }} onClick={() => navigate(-1)}><CallEndIcon /></Fab>
        </Paper>
      </Box>

      {/* Always-visible right panel */}
      <Paper sx={{ width: 360, borderRadius: 0, display: { xs: 'none', md: 'flex' }, flexDirection: 'column' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth" sx={{ borderBottom: '1px solid #E5E7EB', '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}>
          <Tab label="Patient" /><Tab label="Notes" /><Tab label="Rx" />
        </Tabs>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
          {tab === 0 && (
            <Box>
              <Typography sx={{ fontWeight: 700 }}>Meera Sharma, 34F</Typography>
              <Typography sx={{ fontSize: 13, color: '#6B7280', mb: 2 }}>Last visit: Dec 10, 2024</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>Known allergies</Typography>
              <Chip label="Penicillin" size="small" color="error" sx={{ bgcolor: '#FFF1F2', color: '#EF4444', mb: 2 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>Current medications</Typography>
              <Typography sx={{ fontSize: 13, color: '#6B7280' }}>Amitriptyline 10mg, Sumatriptan 50mg</Typography>
            </Box>
          )}
          {tab === 1 && (
            <Box>
              <Paper sx={{ bgcolor: '#F9FAFB', borderRadius: '12px', p: 2, textAlign: 'center', mb: 2 }}>
                <IconButton sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}><MicIcon /></IconButton>
                <Typography sx={{ fontSize: 13, color: '#6B7280', mt: 1 }}>Hold to Dictate</Typography>
              </Paper>
              <TextField fullWidth multiline rows={8} placeholder="Consultation notes..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
            </Box>
          )}
          {tab === 2 && (
            <Stack spacing={1.5}>
              <Autocomplete options={drugs} renderInput={(params) => <TextField {...params} label="Search drug" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '100px' } }} />} />
              <TextField label="Dosage" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '100px' } }} />
              <TextField label="Frequency" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '100px' } }} />
              <TextField label="Duration" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '100px' } }} />
              <Button startIcon={<AddIcon />} variant="outlined">Add Medication</Button>
            </Stack>
          )}
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid #E5E7EB' }}>
          <Button fullWidth variant="contained" sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }} onClick={() => navigate(-1)}>
            End Consultation & Send →
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
