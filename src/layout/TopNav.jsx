import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, IconButton, Badge, Avatar, Menu, MenuItem, ListItemIcon,
  Divider, Popover, List, ListItemButton, ListItemText, ListItemAvatar,
  Button, Chip, InputBase, Paper, Collapse,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import BiotechRoundedIcon from '@mui/icons-material/BiotechRounded';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { makeTokens } from '../theme/theme';
import { patientPhotos } from '../data/assets';
import Logo from '../components/Logo';
import useStore from '../store/useStore';

const links = [
  { label: 'Home',      path: '/dashboard',    icon: HomeRoundedIcon },
  { label: 'Doctors',   path: '/find-doctors', icon: PersonSearchRoundedIcon },
  { label: 'Visits',    path: '/appointments', icon: EventNoteRoundedIcon },
  { label: 'Vault',     path: '/health',        icon: FolderRoundedIcon },
  { label: 'MRI',       path: '/mri',           icon: BiotechRoundedIcon },
  { label: 'Messages',  path: '/chat',          icon: ChatBubbleOutlineRoundedIcon },
  { label: 'Hospitals', path: '/hospitals',     icon: LocalHospitalOutlinedIcon },
];

const notifIcons = {
  calendar: CalendarTodayOutlinedIcon,
  pill:     MedicalServicesOutlinedIcon,
  report:   DescriptionOutlinedIcon,
  chat:     ChatBubbleOutlineRoundedIcon,
  tip:      TipsAndUpdatesOutlinedIcon,
};

const quickSearchSuggestions = [
  { label: 'Find a Neurologist', path: '/find-doctors', icon: PersonSearchRoundedIcon },
  { label: 'Book Video Consultation', path: '/find-doctors', icon: EventNoteRoundedIcon },
  { label: 'Upload Lab Report', path: '/health', icon: FolderRoundedIcon },
  { label: 'AI MRI Analysis', path: '/mri', icon: BiotechRoundedIcon },
  { label: 'My Appointments', path: '/appointments', icon: CalendarTodayOutlinedIcon },
  { label: 'Chat with Doctor', path: '/chat', icon: ChatBubbleOutlineRoundedIcon },
];

export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [anchor, setAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const searchRef = useRef(null);

  const notifications   = useStore((s) => s.notifications);
  const unreadCount     = useStore((s) => s.unreadCount);
  const markNotificationRead = useStore((s) => s.markNotificationRead);
  const markAllRead     = useStore((s) => s.markAllRead);
  const isPro           = useStore((s) => s.isPro);
  const themeMode       = useStore((s) => s.themeMode);
  const accentColor     = useStore((s) => s.accentColor);

  const t = makeTokens(themeMode, accentColor);
  const dark = themeMode === 'dark';

  // Scroll-aware behaviour
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close search on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  const filtered = searchQ
    ? quickSearchSuggestions.filter((s) => s.label.toLowerCase().includes(searchQ.toLowerCase()))
    : quickSearchSuggestions;

  const notifColors = {
    calendar: { bg: t.primarySoft, color: t.primary },
    pill:     { bg: t.warningSoft, color: t.warning },
    report:   { bg: t.successSoft, color: t.success },
    chat:     { bg: '#F3F0FF',     color: '#7C3AED' },
    tip:      { bg: t.primarySoft, color: t.primary },
  };

  // Nav style — glass morphism that intensifies on scroll
  const navBg = scrolled
    ? dark
      ? 'rgba(14, 20, 36, 0.95)'
      : 'rgba(255, 255, 255, 0.92)'
    : dark
      ? 'rgba(14, 20, 36, 0.7)'
      : 'rgba(255, 255, 255, 0.75)';

  const navBorder = scrolled
    ? dark ? 'rgba(255,255,255,0.08)' : 'rgba(226,232,240,0.8)'
    : dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)';

  const navShadow = scrolled
    ? dark
      ? '0 8px 32px rgba(0,0,0,0.5)'
      : '0 8px 32px rgba(0,0,0,0.08)'
    : 'none';

  const textColor = dark ? '#F9FAFB' : '#111827';
  const mutedColor = dark ? 'rgba(249,250,251,0.6)' : '#6B7280';
  const activeColor = t.primary;

  return (
    <>
      {/* Main Nav */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 12,
          zIndex: 1200,
          mx: { xs: 1.5, md: 3 },
          mb: 3,
          background: navBg,
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${navBorder}`,
          borderRadius: '18px',
          px: { xs: 2, md: 3 },
          height: 62,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          boxShadow: navShadow,
          transition: 'background 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
        }}
      >
        {/* Brand */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', flexShrink: 0, mr: 1 }}
          onClick={() => navigate('/dashboard')}
        >
          <Logo size={30} light={false} />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: '-0.025em',
              color: activeColor,
              lineHeight: 1,
            }}>
              Sushruth
            </Typography>
            <Typography sx={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: t.teal,
              lineHeight: 1,
            }}>
              Healthcare
            </Typography>
          </Box>
        </Box>

        {/* Nav Links with sliding active indicator */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', lg: 'flex' },
            gap: 0,
            ml: 1,
            position: 'relative',
          }}
        >
          {links.map((l) => {
            const isActive = pathname === l.path || pathname.startsWith(l.path + '/');
            return (
              <Box key={l.path} sx={{ position: 'relative' }}>
                <Button
                  onClick={() => navigate(l.path)}
                  variant="text"
                  size="small"
                  sx={{
                    px: 1.75,
                    py: 0.75,
                    borderRadius: '10px',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 13.5,
                    color: isActive ? activeColor : mutedColor,
                    bgcolor: isActive ? (dark ? `${t.primary}18` : t.primarySoft) : 'transparent',
                    '&:hover': {
                      bgcolor: isActive
                        ? (dark ? `${t.primary}22` : t.primarySoft)
                        : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,82,186,0.05)'),
                      color: isActive ? activeColor : textColor,
                    },
                    minWidth: 0,
                    textTransform: 'none',
                    letterSpacing: 0,
                    transition: 'color 200ms ease, background 200ms ease',
                  }}
                >
                  {l.label}
                </Button>
              </Box>
            );
          })}
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, ml: 'auto' }}>

          {/* AI Button */}
          <Box
            onClick={() => navigate('/ai')}
            sx={{
              px: 1.5, py: 0.55,
              borderRadius: '8px',
              bgcolor: pathname === '/ai'
                ? (dark ? 'rgba(139,92,246,0.18)' : '#EDE9FE')
                : 'transparent',
              border: `1px solid ${pathname === '/ai' ? '#C4B5FD' : (dark ? 'rgba(255,255,255,0.12)' : '#E5E7EB')}`,
              cursor: 'pointer',
              transition: 'all 150ms',
              flexShrink: 0,
              display: { xs: 'none', md: 'block' },
              '&:hover': { bgcolor: dark ? 'rgba(139,92,246,0.14)' : '#EDE9FE', borderColor: '#C4B5FD' },
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', letterSpacing: 0 }}>
              Ask AI
            </Typography>
          </Box>

          {/* Search */}
          <IconButton
            size="small"
            onClick={() => setSearchOpen(true)}
            sx={{
              color: mutedColor,
              bgcolor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,82,186,0.06)',
              borderRadius: '10px',
              width: 36, height: 36,
              '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(15,82,186,0.10)', color: activeColor },
              transition: 'all 200ms ease',
            }}
          >
            <SearchRoundedIcon sx={{ fontSize: 19 }} />
          </IconButton>

          {/* Pro Badge */}
          {isPro ? (
            <Chip
              icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 13 }} />}
              label="Pro"
              size="small"
              sx={{
                height: 26,
                bgcolor: 'rgba(245,158,11,0.1)',
                color: '#D97706',
                border: '1px solid rgba(245,158,11,0.3)',
                fontWeight: 700,
                fontSize: 11,
                '& .MuiChip-icon': { color: '#D97706' },
                display: { xs: 'none', md: 'flex' },
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(245,158,11,0.18)' },
              }}
              onClick={() => navigate('/profile')}
            />
          ) : (
            <Box
              onClick={() => navigate('/upgrade')}
              sx={{
                px: 1.5, py: 0.55,
                borderRadius: '8px',
                bgcolor: '#F59E0B',
                cursor: 'pointer',
                transition: 'background 150ms',
                flexShrink: 0,
                display: { xs: 'none', md: 'block' },
                '&:hover': { bgcolor: '#D97706' },
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0 }}>
                Upgrade
              </Typography>
            </Box>
          )}

          {/* Notifications */}
          <IconButton
            onClick={(e) => setNotifAnchor(e.currentTarget)}
            size="small"
            sx={{
              color: mutedColor,
              bgcolor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,82,186,0.06)',
              borderRadius: '10px',
              width: 36, height: 36,
              '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(15,82,186,0.10)', color: activeColor },
              transition: 'all 200ms ease',
              position: 'relative',
            }}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{
                '@keyframes badgePulse': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.15)' } },
                '& .MuiBadge-badge': {
                  fontSize: 9, minWidth: 16, height: 16, padding: '0 4px',
                  top: -2, right: -2,
                  animation: unreadCount > 0 ? 'badgePulse 2.5s ease-in-out infinite' : 'none',
                },
              }}
            >
              <NotificationsRoundedIcon sx={{ fontSize: 19 }} />
            </Badge>
          </IconButton>

          {/* Notifications Popover */}
          <Popover
            open={Boolean(notifAnchor)}
            anchorEl={notifAnchor}
            onClose={() => setNotifAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5, width: 380, maxHeight: 480,
                  borderRadius: '16px',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                  bgcolor: dark ? '#1A1F2E' : '#fff',
                  overflow: 'hidden',
                },
              },
            }}
          >
            <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 15, color: textColor }}>Notifications</Typography>
                {unreadCount > 0 && (
                  <Typography sx={{ fontSize: 12, color: mutedColor }}>{unreadCount} unread</Typography>
                )}
              </Box>
              {unreadCount > 0 && (
                <Button size="small" onClick={() => markAllRead()}
                  sx={{ fontSize: 12, fontWeight: 600, color: activeColor, px: 1 }}>
                  Mark all read
                </Button>
              )}
            </Box>
            <Divider sx={{ borderColor: dark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }} />
            <List sx={{ py: 0 }}>
              {notifications.map((n) => {
                const Icon = notifIcons[n.icon] || CalendarTodayOutlinedIcon;
                const colors = notifColors[n.icon] || notifColors.calendar;
                return (
                  <ListItemButton
                    key={n.id}
                    onClick={() => { markNotificationRead(n.id); setNotifAnchor(null); }}
                    sx={{
                      px: 2.5, py: 1.5,
                      bgcolor: n.read ? 'transparent' : (dark ? `${t.primary}12` : t.primarySoft),
                      '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.04)' : '#F8FAFC' },
                      transition: 'background 150ms ease',
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 44 }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: colors.bg, borderRadius: '10px' }}>
                        <Icon sx={{ fontSize: 17, color: colors.color }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: n.read ? 500 : 700, fontSize: 13, color: textColor }}>{n.title}</Typography>}
                      secondary={
                        <>
                          <Typography component="span" sx={{ fontSize: 12, color: mutedColor, display: 'block' }}>{n.body}</Typography>
                          <Typography component="span" sx={{ fontSize: 11, color: t.textTertiary }}>{n.time}</Typography>
                        </>
                      }
                    />
                    {!n.read && (
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: activeColor, flexShrink: 0, ml: 1 }} />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
            <Divider sx={{ borderColor: dark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }} />
            <Box sx={{ p: 1.5, textAlign: 'center' }}>
              <Button size="small" onClick={() => { setNotifAnchor(null); navigate('/appointments'); }}
                sx={{ fontSize: 12, fontWeight: 600, color: activeColor }}>
                View all notifications
              </Button>
            </Box>
          </Popover>

          {/* Account Avatar */}
          <Box
            onClick={(e) => setAnchor(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              pl: 0.5, pr: 1, py: 0.5,
              bgcolor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,82,186,0.06)',
              borderRadius: '12px',
              cursor: 'pointer',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,82,186,0.10)'}`,
              transition: 'all 200ms ease',
              '&:hover': {
                bgcolor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(15,82,186,0.10)',
                borderColor: `${t.primary}33`,
              },
            }}
          >
            <Avatar
              src={patientPhotos.meera}
              sx={{
                width: 28, height: 28,
                border: `2px solid ${t.primary}40`,
              }}
            />
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Typography sx={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.1, color: textColor }}>Meera</Typography>
            </Box>
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: mutedColor }} />
          </Box>

          {/* Account Menu */}
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={() => setAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5, minWidth: 230,
                  borderRadius: '16px',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                  bgcolor: dark ? '#1A1F2E' : '#fff',
                  overflow: 'hidden',
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={patientPhotos.meera} sx={{ width: 36, height: 36, border: `2px solid ${t.primary}30` }} />
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 14, color: textColor }}>Meera Sharma</Typography>
                <Typography sx={{ fontSize: 11.5, color: mutedColor }}>
                  {isPro ? '✦ Pro plan' : 'Free plan'} · Pune
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ borderColor: dark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }} />
            <MenuItem onClick={() => { setAnchor(null); navigate('/profile'); }}
              sx={{ py: 1.25, fontSize: 14, color: textColor, '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.04)' : '#F8FAFC' } }}>
              <ListItemIcon><PersonOutlineRoundedIcon fontSize="small" sx={{ color: mutedColor }} /></ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => { setAnchor(null); navigate('/profile'); }}
              sx={{ py: 1.25, fontSize: 14, color: textColor, '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.04)' : '#F8FAFC' } }}>
              <ListItemIcon><SettingsOutlinedIcon fontSize="small" sx={{ color: mutedColor }} /></ListItemIcon>
              Settings & Appearance
            </MenuItem>
            <MenuItem onClick={() => { setAnchor(null); navigate('/payments'); }}
              sx={{ py: 1.25, fontSize: 14, color: textColor, '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.04)' : '#F8FAFC' } }}>
              <ListItemIcon><PaymentOutlinedIcon fontSize="small" sx={{ color: mutedColor }} /></ListItemIcon>
              Payments & Billing
            </MenuItem>
            <Divider sx={{ borderColor: dark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }} />
            <MenuItem onClick={() => { setAnchor(null); navigate('/login'); }}
              sx={{ py: 1.25, fontSize: 14, color: t.danger, '&:hover': { bgcolor: t.dangerSoft } }}>
              <ListItemIcon><LogoutRoundedIcon fontSize="small" sx={{ color: t.danger }} /></ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '80px',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{ width: '100%', maxWidth: 560, margin: '0 16px' }}
            >
              <Paper
                sx={{
                  borderRadius: '20px',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}`,
                  boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
                  overflow: 'hidden',
                  bgcolor: dark ? '#1A1F2E' : '#fff',
                }}
              >
                {/* Search Input */}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, py: 2, gap: 1.5, borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}` }}>
                  <SearchRoundedIcon sx={{ color: t.primary, fontSize: 22, flexShrink: 0 }} />
                  <InputBase
                    inputRef={searchRef}
                    fullWidth
                    placeholder="Search doctors, conditions, services..."
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && filtered.length > 0) {
                        navigate(filtered[0].path);
                        setSearchOpen(false);
                      }
                    }}
                    sx={{ fontSize: 16, fontFamily: '"Manrope", sans-serif', fontWeight: 500, color: dark ? '#F9FAFB' : '#111827' }}
                  />
                  <IconButton size="small" onClick={() => setSearchOpen(false)}
                    sx={{ color: '#9CA3AF', '&:hover': { color: '#374151' } }}>
                    <CloseRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                {/* Suggestions */}
                <Box sx={{ py: 1 }}>
                  <Typography sx={{ px: 2.5, py: 1, fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {searchQ ? `${filtered.length} results` : 'Quick actions'}
                  </Typography>
                  {filtered.map((s, i) => {
                    const SIcon = s.icon || SearchRoundedIcon;
                    return (
                      <Box
                        key={i}
                        onClick={() => { navigate(s.path); setSearchOpen(false); setSearchQ(''); }}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 2,
                          px: 2.5, py: 1.25,
                          cursor: 'pointer',
                          transition: 'background 150ms ease',
                          '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.04)' : '#F8FAFC' },
                        }}
                      >
                        <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <SIcon sx={{ fontSize: 15, color: t.primary }} />
                        </Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: dark ? '#F9FAFB' : '#111827' }}>
                          {s.label}
                        </Typography>
                        <Box sx={{ ml: 'auto' }}>
                          <Typography sx={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace', bgcolor: dark ? '#252D3D' : '#F1F5F9', px: 0.75, py: 0.25, borderRadius: '4px' }}>
                            ↵
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Footer hint */}
                <Box sx={{ px: 2.5, py: 1.25, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}`, display: 'flex', gap: 2 }}>
                  <Typography sx={{ fontSize: 11, color: '#9CA3AF' }}>↵ Select  ·  Esc Close</Typography>
                </Box>
              </Paper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
