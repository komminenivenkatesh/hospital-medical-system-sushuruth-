import { Box, Avatar, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import { tokens } from '../theme/theme';

const items = [
  { label: 'Overview', icon: DashboardOutlinedIcon, path: '/admin' },
  { label: 'Verification', icon: VerifiedOutlinedIcon, path: '/admin/verification' },
  { label: 'Analytics', icon: InsightsOutlinedIcon, path: '/admin/analytics' },
  { label: 'Moderation', icon: GppMaybeOutlinedIcon, path: '/admin/moderation' },
];

export default function AdminShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: tokens.canvas }}>
      <Box sx={{ width: 248, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
        bgcolor: tokens.surface, borderRight: `1px solid ${tokens.border}`,
        display: { xs: 'none', md: 'flex' }, flexDirection: 'column', p: 2 }}>

        {/* Brand */}
        <Box onClick={() => navigate('/admin')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3.5, px: 1, cursor: 'pointer' }}>
          <Box sx={{ width: 32, height: 32, borderRadius: '10px', background: tokens.blueGradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 15, color: tokens.primary, lineHeight: 1 }}>Sushruth</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 9, letterSpacing: '0.08em', color: tokens.teal, textTransform: 'uppercase' }}>
              Admin Console
            </Typography>
          </Box>
        </Box>

        {/* Nav */}
        <Box sx={{ flex: 1 }}>
          {items.map((it) => {
            const active = pathname === it.path;
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

        {/* Admin card */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25, borderRadius: '12px', bgcolor: tokens.surfaceMuted }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: tokens.textPrimary, fontSize: 12, fontWeight: 700 }}>AD</Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Admin</Typography>
            <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>Platform Ops</Typography>
          </Box>
        </Box>
      </Box>

      <Box component="main" sx={{ flex: 1, minWidth: 0, height: '100vh', overflowY: 'auto', px: { xs: 2, md: 3.5 }, py: 3.5 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
