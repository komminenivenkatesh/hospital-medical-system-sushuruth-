import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Checkbox, FormControlLabel, Select, MenuItem,
  ToggleButton, ToggleButtonGroup, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Stack,
} from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const times = ['08:00', '09:00', '10:00', '17:00', '18:00', '19:00', '20:00'];

export default function Availability() {
  const [enabled, setEnabled] = useState({ Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false });
  const [duration, setDuration] = useState('20min');
  const [blocked, setBlocked] = useState(['25 Dec', '01 Jan']);
  const [date, setDate] = useState(new Date());
  const [offlineDialog, setOfflineDialog] = useState(false);

  return (
    <PageTransition>
      <PageHeader title="Availability" subtitle="Set your weekly schedule and block dates" />

      <Card sx={{ mb: 2 }}><CardContent>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>Weekly Schedule</Typography>
        <Grid container spacing={1.5}>
          {days.map((d) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={d}>
              <Box sx={{ border: '1px solid #E5E7EB', borderRadius: '12px', p: 1.5 }}>
                <FormControlLabel control={<Checkbox checked={enabled[d]} onChange={(e) => setEnabled((s) => ({ ...s, [d]: e.target.checked }))} />} label={d} />
                {enabled[d] && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Select size="small" defaultValue="09:00" sx={{ borderRadius: '100px', flex: 1 }}>
                      {times.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </Select>
                    <Select size="small" defaultValue="17:00" sx={{ borderRadius: '100px', flex: 1 }}>
                      {times.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </Select>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Slot Duration</Typography>
        <ToggleButtonGroup exclusive value={duration} onChange={(e, v) => v && setDuration(v)}
          sx={{ '& .MuiToggleButton-root': { borderRadius: '100px !important', border: '1px solid #E5E7EB', px: 2.5, '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff' } } }}>
          <ToggleButton value="15min">15 min</ToggleButton>
          <ToggleButton value="20min">20 min</ToggleButton>
          <ToggleButton value="30min">30 min</ToggleButton>
        </ToggleButtonGroup>
      </CardContent></Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card><CardContent>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Block Dates</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar value={date} onChange={setDate} />
            </LocalizationProvider>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
              {blocked.map((b) => <Chip key={b} label={b} onDelete={() => setBlocked((s) => s.filter((x) => x !== b))} sx={{ bgcolor: '#FFF1F2', color: '#EF4444' }} />)}
            </Stack>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card><CardContent>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Emergency</Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>Immediately stop accepting new appointments.</Typography>
            <Button fullWidth color="error" variant="outlined" startIcon={<WarningAmberOutlinedIcon />} onClick={() => setOfflineDialog(true)}>
              Go Offline Now
            </Button>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Dialog open={offlineDialog} onClose={() => setOfflineDialog(false)} PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Go offline?</DialogTitle>
        <DialogContent><Typography variant="body2" sx={{ color: '#6B7280' }}>You will stop appearing in patient search until you set yourself available again.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOfflineDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => setOfflineDialog(false)}>Go Offline</Button>
        </DialogActions>
      </Dialog>
    </PageTransition>
  );
}
