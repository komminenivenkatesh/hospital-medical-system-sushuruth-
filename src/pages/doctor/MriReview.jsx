import { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Alert,
  LinearProgress, FormControl, InputLabel, Select, MenuItem, TextField, Checkbox,
  FormControlLabel, Button, Avatar, Paper,
} from '@mui/material';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import GestureIcon from '@mui/icons-material/Gesture';
import TitleIcon from '@mui/icons-material/Title';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import PageTransition from '../../components/PageTransition';

const tools = [
  { v: 'select', icon: NearMeOutlinedIcon }, { v: 'circle', icon: RadioButtonUncheckedIcon },
  { v: 'freehand', icon: GestureIcon }, { v: 'text', icon: TitleIcon },
  { v: 'eraser', icon: BackspaceOutlinedIcon }, { v: 'undo', icon: UndoIcon }, { v: 'redo', icon: RedoIcon },
];

export default function MriReview() {
  const [tool, setTool] = useState('select');
  const [risk, setRisk] = useState('low');
  const [agreed, setAgreed] = useState(false);

  return (
    <PageTransition>
      <Typography sx={{ fontWeight: 800, fontSize: 28, mb: 0.5 }}>MRI Review</Typography>
      <Typography sx={{ fontSize: 13, color: '#9CA3AF', mb: 3 }}>Patient: Meera Sharma · Brain MRI (Contrast)</Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card><CardContent>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ToggleButtonGroup orientation="vertical" exclusive value={tool} onChange={(e, v) => v && setTool(v)} size="small"
                sx={{ '& .MuiToggleButton-root': { border: '1px solid #E5E7EB', mb: 0.5, borderRadius: '8px !important' } }}>
                {tools.map((t) => { const Icon = t.icon; return <ToggleButton key={t.v} value={t.v}><Icon fontSize="small" /></ToggleButton>; })}
              </ToggleButtonGroup>
              <Box sx={{ flex: 1, height: 420, bgcolor: '#0F172A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PsychologyOutlinedIcon sx={{ fontSize: 90, color: '#334155' }} />
              </Box>
            </Box>
          </CardContent></Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card><CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#EFF6FF', color: 'primary.main', fontWeight: 700 }}>MS</Avatar>
              <Box><Typography sx={{ fontWeight: 700, fontSize: 14 }}>Meera Sharma, 34F</Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Referred by Dr. Arvind Rao</Typography></Box>
            </Box>

            <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>AI Analysis</Typography>
            <Alert severity="success" sx={{ borderRadius: '12px', mb: 1 }}>No abnormality detected. Low risk.</Alert>
            <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Confidence</Typography>
            <LinearProgress variant="determinate" value={94} color="success" sx={{ height: 6, borderRadius: 3, mb: 3, mt: 0.5 }} />

            <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>Your Assessment</Typography>
            <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
              <InputLabel>Risk Level</InputLabel>
              <Select value={risk} label="Risk Level" onChange={(e) => setRisk(e.target.value)} sx={{ borderRadius: '100px' }}>
                <MenuItem value="low">Low</MenuItem><MenuItem value="moderate">Moderate</MenuItem><MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth multiline rows={3} placeholder="Override notes (optional)..." sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />

            <FormControlLabel control={<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />}
              label={<Typography sx={{ fontSize: 12, color: '#6B7280' }}>I confirm this assessment is based on my professional medical judgment.</Typography>} />
            <Button fullWidth variant="contained" disabled={!agreed} size="large"
              sx={{ mt: 1.5, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>Sign & Send</Button>
          </CardContent></Card>
        </Grid>
      </Grid>
    </PageTransition>
  );
}
