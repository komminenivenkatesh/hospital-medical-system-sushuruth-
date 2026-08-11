import { Box, Typography, Avatar } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import Logo from '../components/Logo';
import { tokens } from '../theme/theme';
import { doctorPhotos } from '../data/assets';

const items = [
  { label: 'Dashboard', icon: GridViewOutlinedIcon, path: '/doctor/dashboard' },
  { label: 'Patients', icon: GroupOutlinedIcon, path: '/doctor/patients' },
  { label: 'Earnings', icon: PaymentsOutlinedIcon, path: '/doctor/earnings' },
  { label: 'Availability', icon: EventAvailableOutlinedIcon, path: '/doctor/availability' },
  { label: 'Profile', icon: PersonOutlineRoundedIcon, path: '/doctor/profile' },
];

export default function DoctorShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: tokens.canvas }}>
      <Box sx={{ width: 248, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
        bgcolor: tokens.surface, borderRight: `1px solid ${tokens.border}`,
        display: { xs: 'none', md: 'flex' }, flexDirection: 'column', p: 2 }}>

        {/* Brand */}
        <Box onClick={() => navigate('/doctor/dashboard')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3.5, px: 1, cursor: 'pointer' }}>
          <Logo size={32} />
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 15, color: tokens.primary, lineHeight: 1 }}>Sushruth</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 9, letterSpacing: '0.08em', color: tokens.teal, textTransform: 'uppercase' }}>
              For Doctors
            </Typography>
          </Box>
        </Box>

        {/* Nav */}
        <Box sx={{ flex: 1 }}>
          {items.map((it) => {
            const active = pathname === it.path || pathname.startsWith(it.path + '/');
            const Icon = it.icon;
            return (
              <Box key={it.path} onClick={() => navigate(it.path)}
                sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1.25, mb: 0.5,
                  borderRadius: '12px', cursor: 'pointer',
                  bgcolor: active ? tokens.primarySoft : 'transparent',
                  color: active ? tokens.primary : tokens.textSecondary,
                  transition: 'background 150ms ease, color 150ms ease',
                  '&:hover': { bgcolor: active ? tokens.primarySoft : tokens.surfaceMuted } }}>
                {active && (
                  <Box sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: 3, height: 20, borderRadius: 100, bgcolor: tokens.primary }} />
                )}
                <Icon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: 14 }}>{it.label}</Typography>
              </Box>
            );
          })}
        </Box>

        {/* Switch to patient app */}
        <Box onClick={() => navigate('/dashboard')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, mb: 1, borderRadius: '12px', cursor: 'pointer',
            color: tokens.textSecondary, '&:hover': { bgcolor: tokens.surfaceMuted } }}>
          <SwapHorizRoundedIcon sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Patient App</Typography>
        </Box>

        {/* Doctor card */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25, borderRadius: '12px', bgcolor: tokens.surfaceMuted }}>
          <Avatar src={doctorPhotos.arvind} sx={{ width: 36, height: 36, border: `2px solid ${tokens.primary}30` }}>AR</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Dr. Arvind Rao</Typography>
            <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>Neurologist</Typography>
          </Box>
        </Box>
      </Box>

      <Box component="main" sx={{ flex: 1, minWidth: 0, height: '100vh', overflowY: 'auto', px: { xs: 2, md: 3.5 }, py: 3.5 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
