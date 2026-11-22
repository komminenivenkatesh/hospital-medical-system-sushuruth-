import { useState } from 'react';
import {
  Box, Typography, Avatar, Divider, Badge, IconButton, Drawer, List,
  ListItemButton, ListItemIcon, ListItemText, Paper,
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { tokens } from '../theme/theme';
import { doctorPhotos } from '../data/assets';

const items = [
  { label: 'Dashboard', icon: GridViewOutlinedIcon, iconActive: GridViewRoundedIcon, path: '/doctor/dashboard' },
  { label: 'Patients', icon: GroupOutlinedIcon, iconActive: GroupRoundedIcon, path: '/doctor/patients' },
  { label: 'Messages', icon: ChatBubbleOutlineRoundedIcon, iconActive: ChatBubbleRoundedIcon, path: '/doctor/chat', badge: 2 },
  { label: 'Earnings', icon: PaymentsOutlinedIcon, iconActive: PaymentsRoundedIcon, path: '/doctor/earnings' },
  { label: 'Availability', icon: EventAvailableOutlinedIcon, iconActive: EventAvailableOutlinedIcon, path: '/doctor/availability' },
  { label: 'Profile', icon: PersonOutlineRoundedIcon, iconActive: PersonRoundedIcon, path: '/doctor/profile' },
];

export default function DoctorShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh', bgcolor: tokens.canvas }}>
      {/* Mobile Top Header */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.25,
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${tokens.border}`,
        }}
      >
        <Box
          onClick={() => navigate('/doctor/dashboard')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer' }}
        >
          <Logo size={28} />
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 15, color: tokens.primary, lineHeight: 1 }}>
              Sushruth
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 9, letterSpacing: '0.08em', color: tokens.teal, textTransform: 'uppercase' }}>
              For Doctors
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={doctorPhotos.arvind}
            onClick={() => navigate('/doctor/profile')}
            sx={{ width: 32, height: 32, border: `2px solid ${tokens.primary}40`, cursor: 'pointer' }}
          >
            AR
          </Avatar>
          <IconButton
            size="small"
            onClick={() => setMobileDrawerOpen(true)}
            sx={{ color: tokens.textSecondary, bgcolor: tokens.surfaceMuted, width: 34, height: 34, borderRadius: '8px' }}
            aria-label="Open Doctor Menu"
          >
            <MenuRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Desktop Sidebar */}
      <Box sx={{
        width: 248, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
        bgcolor: tokens.surface, borderRight: `1px solid ${tokens.border}`,
        display: { xs: 'none', md: 'flex' }, flexDirection: 'column', p: 2,
      }}>
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

        {/* Nav Links */}
        <Box sx={{ flex: 1 }}>
          {items.map((it) => {
            const active = pathname === it.path || (it.path !== '/doctor/dashboard' && pathname.startsWith(it.path + '/'));
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
                <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: 14, flex: 1 }}>{it.label}</Typography>
                {Boolean(it.badge) && (
                  <Badge badgeContent={it.badge} color="primary"
                    sx={{ '& .MuiBadge-badge': { position: 'static', transform: 'none', fontSize: 10, minWidth: 18, height: 18, fontWeight: 700 } }} />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Doctor profile badge & logout */}
        <Box sx={{ borderTop: `1px solid ${tokens.border}`, pt: 1.5, mt: 0.5 }}>
          <Box
            onClick={() => navigate('/doctor/profile')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              p: 1.25,
              borderRadius: '12px',
              bgcolor: pathname === '/doctor/profile' ? tokens.primarySoft : tokens.surfaceMuted,
              cursor: 'pointer',
              '&:hover': { bgcolor: tokens.surfaceMuted },
            }}
          >
            <Avatar src={doctorPhotos.arvind} sx={{ width: 36, height: 36, border: `2px solid ${tokens.primary}30` }}>AR</Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>{user?.name || 'Dr. Arvind Rao'}</Typography>
              <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>{user?.specialty || 'Neurologist'}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1.25, borderColor: tokens.border }} />

          <Box
            onClick={handleLogout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1.25,
              py: 0.9,
              borderRadius: '10px',
              cursor: 'pointer',
              color: tokens.textSecondary,
              '&:hover': { bgcolor: tokens.surfaceMuted },
            }}
          >
            <LogoutRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Logout</Typography>
          </Box>
        </Box>
      </Box>

      {/* Doctor Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: '80vw',
              maxWidth: 320,
              bgcolor: '#fff',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${tokens.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Avatar src={doctorPhotos.arvind} sx={{ width: 40, height: 40, border: `2px solid ${tokens.primary}40` }}>AR</Avatar>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{user?.name || 'Dr. Arvind Rao'}</Typography>
              <Typography sx={{ fontSize: 11.5, color: tokens.textSecondary }}>{user?.specialty || 'Neurologist'}</Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setMobileDrawerOpen(false)}>
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <List sx={{ flex: 1, p: 1.5 }}>
          {items.map((it) => {
            const active = pathname === it.path || (it.path !== '/doctor/dashboard' && pathname.startsWith(it.path + '/'));
            const Icon = active && it.iconActive ? it.iconActive : it.icon;
            return (
              <ListItemButton
                key={it.path}
                onClick={() => { setMobileDrawerOpen(false); navigate(it.path); }}
                sx={{
                  borderRadius: '10px',
                  mb: 0.75,
                  bgcolor: active ? tokens.primarySoft : 'transparent',
                  color: active ? tokens.primary : tokens.textPrimary,
                  fontWeight: active ? 700 : 500,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? tokens.primary : tokens.textSecondary }}>
                  <Icon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary={it.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }} />
                {Boolean(it.badge) && (
                  <Badge badgeContent={it.badge} color="primary" />
                )}
              </ListItemButton>
            );
          })}
        </List>

        <Box sx={{ p: 2, borderTop: `1px solid ${tokens.border}`, bgcolor: tokens.surfaceMuted }}>
          <ListItemButton
            onClick={() => { setMobileDrawerOpen(false); navigate('/dashboard'); }}
            sx={{ borderRadius: '10px', mb: 1, color: tokens.textSecondary }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}><ArrowBackRoundedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Patient App View" primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }} />
          </ListItemButton>

          <ListItemButton
            onClick={() => { setMobileDrawerOpen(false); handleLogout(); }}
            sx={{ borderRadius: '10px', color: tokens.danger, bgcolor: tokens.dangerSoft }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: tokens.danger }}><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13, fontWeight: 700 }} />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: '100vh',
          overflowY: 'auto',
          px: { xs: 1.5, sm: 2.5, md: 3.5 },
          py: { xs: 2, md: 3.5 },
          pb: { xs: 10, md: 3.5 }, // space for mobile bottom bar
        }}
      >
        <Outlet />
      </Box>

      {/* Doctor Mobile Bottom Navigation */}
      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          display: { xs: 'block', md: 'none' },
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${tokens.border}`,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
          pb: 'max(8px, env(safe-area-inset-bottom, 8px))',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 60, px: 0.5 }}>
          {[
            { label: 'Overview', icon: GridViewOutlinedIcon, iconActive: GridViewRoundedIcon, path: '/doctor/dashboard' },
            { label: 'Patients', icon: GroupOutlinedIcon, iconActive: GroupRoundedIcon, path: '/doctor/patients' },
            { label: 'Messages', icon: ChatBubbleOutlineRoundedIcon, iconActive: ChatBubbleRoundedIcon, path: '/doctor/chat', badge: 2 },
            { label: 'Earnings', icon: PaymentsOutlinedIcon, iconActive: PaymentsRoundedIcon, path: '/doctor/earnings' },
            { label: 'Profile', icon: PersonOutlineRoundedIcon, iconActive: PersonRoundedIcon, path: '/doctor/profile' },
          ].map((item) => {
            const active = pathname === item.path || (item.path !== '/doctor/dashboard' && pathname.startsWith(item.path + '/'));
            const Icon = active ? item.iconActive : item.icon;
            return (
              <Box
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 0.75,
                  cursor: 'pointer',
                  color: active ? tokens.primary : tokens.textSecondary,
                  position: 'relative',
                }}
              >
                {Boolean(item.badge) ? (
                  <Badge badgeContent={item.badge} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: 9, minWidth: 15, height: 15 } }}>
                    <Icon sx={{ fontSize: 21 }} />
                  </Badge>
                ) : (
                  <Icon sx={{ fontSize: 21 }} />
                )}
                <Typography sx={{ fontSize: 10, fontWeight: active ? 700 : 500, mt: 0.25 }}>
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
}
