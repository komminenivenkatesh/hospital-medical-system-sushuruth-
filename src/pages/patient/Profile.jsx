import { useState } from 'react';
import {
  Box, Typography, TextField, Grid, Button, List, ListItemButton, ListItemText,
  Chip, Switch, FormControlLabel, Stack, Divider, Avatar, Card, CardContent, ToggleButtonGroup, ToggleButton,
  Snackbar, Alert,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import StarOutlineOutlined from '@mui/icons-material/StarOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import SettingsBrightnessRoundedIcon from '@mui/icons-material/SettingsBrightnessRounded';
import PageTransition, { SectionReveal } from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import useStore from '../../store/useStore';
import { patient } from '../../data/appointments';
import { tokens } from '../../theme/theme';
import { patientPhotos } from '../../data/assets';

const sections = [
  { label: 'Profile',          icon: PersonOutlinedIcon },
  { label: 'Notifications',    icon: NotificationsNoneOutlinedIcon },
  { label: 'Subscription',     icon: StarOutlineOutlined },
  { label: 'Appearance',       icon: PaletteOutlinedIcon },
  { label: 'Privacy',          icon: ShieldOutlinedIcon },
  { label: 'Security',         icon: LockOutlinedIcon },
];

const proBenefits = [
  'Unlimited appointments',
  'Direct doctor chat',
  'AI MRI analysis',
  'Unlimited file storage',
  'Priority support',
];

const accentColors = [
  { key: 'blue',   label: 'Ocean Blue',   hex: '#2563EB' },
  { key: 'purple', label: 'Deep Purple',  hex: '#7C3AED' },
  { key: 'green',  label: 'Forest Green', hex: '#059669' },
  { key: 'amber',  label: 'Golden Amber', hex: '#D97706' },
];

const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: '100px', bgcolor: tokens.surface } };

export default function Profile() {
  const [section, setSection] = useState(0);
  const [savedSnack, setSavedSnack] = useState(false);
  const isPro         = useStore((s) => s.isPro);
  const upgrade       = useStore((s) => s.upgradeToPro);
  const togglePlan    = useStore((s) => s.togglePlan);
  const themeMode     = useStore((s) => s.themeMode);
  const accentColor   = useStore((s) => s.accentColor);
  const fontSize      = useStore((s) => s.fontSize);
  const setThemeMode  = useStore((s) => s.setThemeMode);
  const setAccentColor = useStore((s) => s.setAccentColor);
  const setFontSize   = useStore((s) => s.setFontSize);

  return (
    <>
    <PageTransition>
      <PageHeader
        title="Settings & Profile"
        subtitle="Manage your personal details, app preferences, and security settings."
        breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Profile' }]}
      />

      <SectionReveal>
      {/* Profile hero */}
      <Card sx={{ mb: 3, background: tokens.blueGradient, border: 'none' }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
            <Avatar
              src={patientPhotos.meera}
              sx={{ width: 72, height: 72, border: '3px solid rgba(255,255,255,0.3)',
                fontWeight: 800, fontSize: 26, bgcolor: 'rgba(255,255,255,0.2)' }}
            >
              MS
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 20, color: '#fff' }}>{patient.name}</Typography>
              <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{patient.city}, {patient.state}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip label={isPro ? 'Pro Plan' : 'Free Plan'} size="small"
                  sx={{ bgcolor: isPro ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700 }} />
                <Chip label={`DOB: ${patient.dob}`} size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }} />
              </Box>
            </Box>
            <Button variant="outlined" size="small" onClick={togglePlan}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)',
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              {isPro ? 'Downgrade to Free' : 'Upgrade to Pro'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        {/* Sidebar nav */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ p: 1.5 }}>
              <List disablePadding>
                {sections.map(({ label, icon: Icon }, i) => (
                  <ListItemButton key={label} selected={section === i} onClick={() => setSection(i)}
                    sx={{ borderRadius: 2.5, mb: 0.5, px: 2, py: 1.25,
                      '&.Mui-selected': { bgcolor: tokens.primarySoft, color: tokens.primary },
                      '&.Mui-selected:hover': { bgcolor: tokens.primarySoft } }}>
                    <Icon sx={{ fontSize: 18, mr: 1.5, color: section === i ? tokens.primary : tokens.textTertiary }} />
                    <ListItemText primary={label}
                      slotProps={{ primary: { style: { fontWeight: section === i ? 700 : 500, fontSize: 14,
                        color: section === i ? tokens.primary : tokens.textPrimary } } }} />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Content panel */}
        <Grid size={{ xs: 12, md: 9 }}>

          {/* ── Profile ── */}
          {section === 0 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 0.5 }}>Personal Information</Typography>
                <Typography sx={{ fontSize: 13, color: tokens.textSecondary, mb: 3 }}>Update your personal details and contact info</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Full Name" defaultValue={patient.name} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Phone" defaultValue={patient.phone} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="City" defaultValue={patient.city} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="State" defaultValue={patient.state} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Date of Birth" defaultValue={patient.dob} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Gender" defaultValue={patient.gender} sx={fieldSx} /></Grid>
                  <Grid size={12}><TextField fullWidth label="Email" defaultValue="meera.sharma@gmail.com" sx={fieldSx} /></Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                  <Button variant="contained" onClick={() => setSavedSnack(true)}>Save Changes</Button>
                  <Button variant="outlined">Cancel</Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* ── Notifications ── */}
          {section === 1 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 0.5 }}>Notifications</Typography>
                <Typography sx={{ fontSize: 13, color: tokens.textSecondary, mb: 3 }}>Choose what you want to be notified about</Typography>
                <Stack spacing={0}>
                  {[
                    { label: 'Appointment reminders',   sub: 'Get reminded 24h and 1h before your appointment', on: true },
                    { label: 'Prescription refill alerts', sub: 'Alert when your medication is running low', on: true },
                    { label: 'Chat messages',           sub: 'Notify when your doctor sends a message', on: true },
                    { label: 'Promotions & offers',     sub: 'News about new features and special offers', on: false },
                  ].map((n, i, arr) => (
                    <Box key={n.label} sx={{ py: 2, borderBottom: i < arr.length - 1 ? `1px solid ${tokens.border}` : 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{n.label}</Typography>
                          <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{n.sub}</Typography>
                        </Box>
                        <Switch defaultChecked={n.on} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* ── Subscription ── */}
          {section === 2 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 22 }}>
                      {isPro ? 'Sushruth Pro' : 'Free Plan'}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>
                      {isPro ? '₹299/month · renews monthly' : 'Upgrade to unlock premium features'}
                    </Typography>
                  </Box>
                  <Chip label={isPro ? 'Active' : 'Current'}
                    sx={{ bgcolor: isPro ? tokens.successSoft : tokens.surfaceMuted,
                      color: isPro ? tokens.success : tokens.textSecondary, fontWeight: 700 }} />
                </Box>
                <Divider sx={{ mb: 2.5 }} />
                <Stack spacing={1.5}>
                  {proBenefits.map((b) => (
                    <Box key={b} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 24, height: 24, borderRadius: '50%',
                        bgcolor: isPro ? tokens.successSoft : tokens.surfaceMuted,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckIcon sx={{ fontSize: 14, color: isPro ? tokens.success : tokens.textTertiary }} />
                      </Box>
                      <Typography sx={{ fontSize: 14 }}>{b}</Typography>
                    </Box>
                  ))}
                </Stack>
                {!isPro && (
                  <Button variant="contained" size="large" sx={{ mt: 3, py: 1.25 }} onClick={upgrade}>
                    Upgrade to Pro — ₹299/month
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Appearance ── */}
          {section === 3 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 0.5 }}>Theme & Appearance</Typography>
                <Typography sx={{ fontSize: 13, color: tokens.textSecondary, mb: 3 }}>
                  Personalise how Sushruth looks and feels for you
                </Typography>

                {/* Theme mode */}
                <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1.5 }}>Colour Mode</Typography>
                <ToggleButtonGroup
                  value={themeMode}
                  exclusive
                  onChange={(_, v) => { if (v) setThemeMode(v); }}
                  sx={{ mb: 3, '& .MuiToggleButton-root': { px: 3, py: 1.25, fontFamily: '"Manrope", sans-serif',
                    fontWeight: 600, fontSize: 13, gap: 0.75, textTransform: 'none',
                    '&.Mui-selected': { bgcolor: tokens.primary, color: '#fff',
                      '&:hover': { bgcolor: tokens.primaryDark } } } }}
                >
                  <ToggleButton value="light">
                    <LightModeRoundedIcon sx={{ fontSize: 18 }} /> Light
                  </ToggleButton>
                  <ToggleButton value="dark">
                    <DarkModeRoundedIcon sx={{ fontSize: 18 }} /> Dark
                  </ToggleButton>
                  <ToggleButton value="system">
                    <SettingsBrightnessRoundedIcon sx={{ fontSize: 18 }} /> System
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Accent colour */}
                <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1.5 }}>Accent Colour</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                  {accentColors.map((c) => (
                    <Box
                      key={c.key}
                      onClick={() => setAccentColor(c.key)}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: 100,
                        border: `2px solid ${accentColor === c.key ? c.hex : tokens.border}`,
                        cursor: 'pointer', transition: 'all 150ms ease',
                        bgcolor: accentColor === c.key ? `${c.hex}14` : 'transparent',
                        '&:hover': { borderColor: c.hex } }}
                    >
                      <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: c.hex, flexShrink: 0,
                        outline: accentColor === c.key ? `3px solid ${c.hex}44` : 'none', outlineOffset: 2 }} />
                      <Typography sx={{ fontSize: 13, fontWeight: accentColor === c.key ? 700 : 500,
                        color: accentColor === c.key ? c.hex : tokens.textSecondary }}>
                        {c.label}
                      </Typography>
                      {accentColor === c.key && <CheckIcon sx={{ fontSize: 15, color: c.hex }} />}
                    </Box>
                  ))}
                </Box>

                {/* Font size */}
                <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1.5 }}>Text Size</Typography>
                <ToggleButtonGroup
                  value={fontSize}
                  exclusive
                  onChange={(_, v) => { if (v) setFontSize(v); }}
                  sx={{ '& .MuiToggleButton-root': { px: 3, py: 1.25, fontFamily: '"Manrope", sans-serif',
                    fontWeight: 600, fontSize: 13, textTransform: 'none',
                    '&.Mui-selected': { bgcolor: tokens.primary, color: '#fff',
                      '&:hover': { bgcolor: tokens.primaryDark } } } }}
                >
                  <ToggleButton value="small">Small</ToggleButton>
                  <ToggleButton value="default">Default</ToggleButton>
                  <ToggleButton value="large">Large</ToggleButton>
                </ToggleButtonGroup>

                <Box sx={{ mt: 3 }}>
                  <Chip label="Changes apply immediately" size="small"
                    sx={{ bgcolor: tokens.successSoft, color: tokens.success, fontWeight: 600 }} />
                </Box>
              </CardContent>
            </Card>
          )}

          {/* ── Privacy & Security ── */}
          {section >= 4 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 0.5 }}>
                  {sections[section].label}
                </Typography>
                <Typography sx={{ fontSize: 13, color: tokens.textSecondary, mb: 3 }}>
                  {section === 4
                    ? 'Control how your data is shared and who can access your medical records.'
                    : 'Manage your password, two-factor authentication, and active sessions.'}
                </Typography>
                <Stack spacing={2}>
                  {section === 4 ? (
                    <>
                      {[
                        { label: 'Share records with family members', on: true },
                        { label: 'Allow doctors to access full history', on: true },
                        { label: 'Analytics & usage data', on: false },
                      ].map((item) => (
                        <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          py: 1.5, borderBottom: `1px solid ${tokens.border}` }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{item.label}</Typography>
                          <Switch defaultChecked={item.on} />
                        </Box>
                      ))}
                      <Button variant="contained" sx={{ mt: 1, alignSelf: 'flex-start' }}>Save Privacy Settings</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outlined" fullWidth>Change Password</Button>
                      <Button variant="outlined" fullWidth>Enable Two-Factor Authentication</Button>
                      <Button variant="outlined" fullWidth color="error">Sign out of all devices</Button>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}

        </Grid>
      </Grid>
      </SectionReveal>
    </PageTransition>
    <Snackbar
      open={savedSnack}
      autoHideDuration={2000}
      onClose={() => setSavedSnack(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="success" onClose={() => setSavedSnack(false)} sx={{ fontWeight: 600 }}>
        Profile updated successfully!
      </Alert>
    </Snackbar>
    </>
  );
}
