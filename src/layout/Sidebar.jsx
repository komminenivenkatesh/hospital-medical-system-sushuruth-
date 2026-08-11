import { Box, Tooltip, Avatar, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const navItems = [
  { label: 'Dashboard', icon: HomeOutlinedIcon, path: '/dashboard' },
  { label: 'Find Doctors', icon: SearchOutlinedIcon, path: '/find-doctors' },
  { label: 'Health Vault', icon: DescriptionOutlinedIcon, path: '/health' },
  { label: 'Appointments', icon: CalendarMonthOutlinedIcon, path: '/appointments' },
  { label: 'AI MRI Lab', icon: PsychologyOutlinedIcon, path: '/mri' },
  { label: 'Messages', icon: ChatBubbleOutlineOutlinedIcon, path: '/chat' },
  { label: 'Family', icon: GroupsOutlinedIcon, path: '/family' },
];

const SIDEBAR_WIDTH = 64;

function NavIcon({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <Tooltip title={item.label} placement="right" arrow>
      <Box
        onClick={onClick}
        sx={{
          width: 40, height: 40, mx: 'auto', mb: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '8px', cursor: 'pointer',
          bgcolor: active ? 'primary.light' : 'transparent',
          color: active ? 'primary.main' : '#9CA3AF',
          transition: 'background-color 150ms ease, color 150ms ease',
          '&:hover': { color: active ? 'primary.main' : '#6B7280' },
        }}
      >
        <Icon sx={{ fontSize: 22 }} />
      </Box>
    </Tooltip>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH, flexShrink: 0, height: '100vh',
        position: 'sticky', top: 0,
        bgcolor: '#FFFFFF', borderRight: '1px solid #F3F4F6',
        display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
        alignItems: 'center', py: 2,
      }}
    >
      {/* Logo */}
      <Box
        onClick={() => navigate('/dashboard')}
        sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'primary.main', mb: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <PsychologyOutlinedIcon sx={{ color: '#fff', fontSize: 24 }} />
      </Box>

      {/* Nav */}
      <Box sx={{ flex: 1, width: '100%' }}>
        {navItems.map((item) => (
          <NavIcon
            key={item.path}
            item={item}
            active={pathname.startsWith(item.path)}
            onClick={() => navigate(item.path)}
          />
        ))}
      </Box>

      {/* Bottom */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <Tooltip title="Notifications" placement="right" arrow>
          <Badge badgeContent={3} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 16, minWidth: 16 } }}>
            <NotificationsNoneOutlinedIcon sx={{ fontSize: 22, color: '#9CA3AF', cursor: 'pointer' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Settings" placement="right" arrow>
          <SettingsOutlinedIcon onClick={() => navigate('/profile')} sx={{ fontSize: 22, color: '#9CA3AF', cursor: 'pointer' }} />
        </Tooltip>
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          onClick={() => navigate('/profile')}>MS</Avatar>
      </Box>
    </Box>
  );
}

export { SIDEBAR_WIDTH, navItems };
