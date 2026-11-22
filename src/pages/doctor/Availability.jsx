import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Checkbox, FormControlLabel, Select, MenuItem,
  ToggleButton, ToggleButtonGroup, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Stack, CircularProgress, Alert, Snackbar,
} from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import { doctorAPI } from '../../services/api';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const times = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

const defaultSchedule = {
  Mon: { enabled: true, startTime: '09:00', endTime: '17:00' },
  Tue: { enabled: true, startTime: '09:00', endTime: '17:00' },
  Wed: { enabled: true, startTime: '09:00', endTime: '17:00' },
  Thu: { enabled: true, startTime: '09:00', endTime: '17:00' },
  Fri: { enabled: true, startTime: '09:00', endTime: '17:00' },
  Sat: { enabled: false, startTime: '09:00', endTime: '13:00' },
  Sun: { enabled: false, startTime: '09:00', endTime: '13:00' },
};

export default function Availability() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [duration, setDuration] = useState('20min');
  const [blocked, setBlocked] = useState([]);
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState('Available');
  const [availableToday, setAvailableToday] = useState(true);
  const [offlineDialog, setOfflineDialog] = useState(false);
  const [snackbar, setSnackbar] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await doctorAPI.getMyAvailability();
        if (data.weeklySchedule && Object.keys(data.weeklySchedule).length > 0) {
          setSchedule((prev) => ({ ...prev, ...data.weeklySchedule }));
        }
        if (data.slotDuration) setDuration(data.slotDuration);
        if (Array.isArray(data.blockedDates)) setBlocked(data.blockedDates);
        if (data.status) setStatus(data.status);
        if (data.availableToday !== undefined) setAvailableToday(data.availableToday);
      } catch (err) {
        console.error('Failed to load availability:', err);
        setError('Could not load current availability. Showing standard defaults.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const handleToggleDay = (d) => {
    setSchedule((prev) => ({
      ...prev,
      [d]: {
        ...prev[d],
        enabled: !prev[d]?.enabled,
      },
    }));
  };

  const handleTimeChange = (d, key, val) => {
    setSchedule((prev) => ({
      ...prev,
      [d]: {
        ...prev[d],
        [key]: val,
      },
    }));
  };

  const handleBlockDate = (newDate) => {
    if (!newDate) return;
    setDate(newDate);
    const dateStr = format(newDate, 'dd MMM yyyy');
    if (!blocked.includes(dateStr)) {
      setBlocked((prev) => [...prev, dateStr]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await doctorAPI.updateMyAvailability({
        weeklySchedule: schedule,
        slotDuration: duration,
        blockedDates: blocked,
        status,
        availableToday,
      });
      setSnackbar('Weekly schedule & availability saved!');
    } catch (err) {
      console.error('Failed to save availability:', err);
      setError('Failed to update availability schedule.');
    } finally {
      setSaving(false);
    }
  };

  const handleEmergencyToggle = async () => {
    const newStatus = status === 'Offline' ? 'Available' : 'Offline';
    const newAvailableToday = newStatus === 'Available';
    try {
      await doctorAPI.updateStatus({ status: newStatus, availableToday: newAvailableToday });
      setStatus(newStatus);
      setAvailableToday(newAvailableToday);
      setOfflineDialog(false);
      setSnackbar(`You are now ${newStatus}`);
    } catch (err) {
      console.error('Status update failed:', err);
      setError('Could not update status. Please try again.');
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <PageHeader title="Availability" subtitle="Set your weekly schedule and block dates" />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHeader title="Availability" subtitle="Set your weekly schedule and block dates" />

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 2.5, borderRadius: '16px', border: '1px solid #E5E7EB' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>Weekly Schedule</Typography>
            <Chip
              label={status === 'Available' ? 'Online / Accepting Bookings' : 'Offline'}
              color={status === 'Available' ? 'success' : 'default'}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Grid container spacing={1.5}>
            {days.map((d) => {
              const dayData = schedule[d] || { enabled: false, startTime: '09:00', endTime: '17:00' };
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={d}>
                  <Box
                    sx={{
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      p: 1.5,
                      bgcolor: dayData.enabled ? '#F8FAFC' : '#FFFFFF',
                      transition: 'all 0.2s',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!dayData.enabled}
                          onChange={() => handleToggleDay(d)}
                        />
                      }
                      label={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>{d}</Typography>}
                    />
                    {dayData.enabled && (
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Select
                          size="small"
                          value={dayData.startTime || '09:00'}
                          onChange={(e) => handleTimeChange(d, 'startTime', e.target.value)}
                          sx={{ borderRadius: '100px', flex: 1, fontSize: 13 }}
                        >
                          {times.map((t) => (
                            <MenuItem key={t} value={t}>
                              {t}
                            </MenuItem>
                          ))}
                        </Select>
                        <Select
                          size="small"
                          value={dayData.endTime || '17:00'}
                          onChange={(e) => handleTimeChange(d, 'endTime', e.target.value)}
                          sx={{ borderRadius: '100px', flex: 1, fontSize: 13 }}
                        >
                          {times.map((t) => (
                            <MenuItem key={t} value={t}>
                              {t}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Typography sx={{ fontWeight: 700, mt: 3, mb: 1, fontSize: 15 }}>Slot Duration</Typography>
          <ToggleButtonGroup
            exclusive
            value={duration}
            onChange={(e, v) => v && setDuration(v)}
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '100px !important',
                border: '1px solid #E5E7EB',
                px: 2.5,
                fontWeight: 600,
                '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff' },
              },
            }}
          >
            <ToggleButton value="15min">15 min</ToggleButton>
            <ToggleButton value="20min">20 min</ToggleButton>
            <ToggleButton value="30min">30 min</ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{ px: 4, py: 1, borderRadius: '100px', fontWeight: 600 }}
            >
              {saving ? 'Saving...' : 'Save Schedule'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 1, fontSize: 16 }}>Block Dates / Leave</Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 1.5 }}>
                Select dates on the calendar to block new patient bookings.
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar value={date} onChange={handleBlockDate} />
              </LocalizationProvider>
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#4B5563', mb: 1 }}>
                  Currently Blocked Dates:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                  {blocked.length === 0 ? (
                    <Typography sx={{ fontSize: 12, color: '#9CA3AF' }}>No dates blocked</Typography>
                  ) : (
                    blocked.map((b) => (
                      <Chip
                        key={b}
                        label={b}
                        onDelete={() => setBlocked((s) => s.filter((x) => x !== b))}
                        sx={{ bgcolor: '#FFF1F2', color: '#EF4444', fontWeight: 600 }}
                      />
                    ))
                  )}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 1, fontSize: 16 }}>Emergency Status</Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                Instantly control whether patients can book new consultations with you today.
              </Typography>
              {status === 'Available' ? (
                <Button
                  fullWidth
                  color="error"
                  variant="outlined"
                  startIcon={<WarningAmberOutlinedIcon />}
                  onClick={() => setOfflineDialog(true)}
                  sx={{ borderRadius: '100px', py: 1.2, fontWeight: 600 }}
                >
                  Go Offline Now
                </Button>
              ) : (
                <Button
                  fullWidth
                  color="success"
                  variant="contained"
                  startIcon={<CheckCircleOutlineRoundedIcon />}
                  onClick={handleEmergencyToggle}
                  sx={{ borderRadius: '100px', py: 1.2, fontWeight: 600 }}
                >
                  Resume Availability (Go Online)
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={offlineDialog}
        onClose={() => setOfflineDialog(false)}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Go offline?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            You will stop appearing in patient search until you set yourself available again.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOfflineDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleEmergencyToggle}>
            Confirm & Go Offline
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar('')}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </PageTransition>
  );
}
