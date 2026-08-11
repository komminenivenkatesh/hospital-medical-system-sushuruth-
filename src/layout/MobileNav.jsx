import { useState } from 'react';
import { Box, Paper, Typography, Fab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { tokens } from '../theme/theme';

const items = [
  { label: 'Home',    iconOff: HomeOutlinedIcon,           iconOn: HomeRoundedIcon,           path: '/dashboard'    },
  { label: 'Doctors', iconOff: SearchOutlinedIcon,         iconOn: SearchRoundedIcon,         path: '/find-doctors' },
  null, // center FAB placeholder
  { label: 'Records', iconOff: FolderOpenOutlinedIcon,     iconOn: FolderRoundedIcon,         path: '/health'       },
  { label: 'Profile', iconOff: PersonOutlineOutlinedIcon,  iconOn: PersonRoundedIcon,         path: '/profile'      },
];

export default function MobileNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: { xs: 'block', md: 'none' },
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid rgba(229,231,235,0.8)',
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
        pb: 'env(safe-area-inset-bottom, 8px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 64,
          px: 1,
          position: 'relative',
        }}
      >
        {items.map((item, idx) => {
          // Center FAB
          if (item === null) {
            return (
              <Box key="fab" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Fab
                    size="medium"
                    onClick={() => navigate('/find-doctors')}
                    sx={{
                      width: 52,
                      height: 52,
                      background: `linear-gradient(135deg, ${tokens.primary} 0%, ${tokens.primaryDark} 100%)`,
                      boxShadow: `0 6px 20px ${tokens.primaryGlow || 'rgba(15,82,186,0.4)'}`,
                      border: '3px solid #fff',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${tokens.primaryLight || '#1E6FE8'} 0%, ${tokens.primary} 100%)`,
                      },
                    }}
                  >
                    <AddRoundedIcon sx={{ color: '#fff', fontSize: 24 }} />
                  </Fab>
                </motion.div>
              </Box>
            );
          }

          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          const IconOff = item.iconOff;
          const IconOn  = item.iconOn;

          return (
            <Box
              key={item.path}
              component={motion.div}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              onClick={() => navigate(item.path)}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                cursor: 'pointer',
                py: 1,
                borderRadius: '12px',
                position: 'relative',
                transition: 'background 200ms ease',
                '&:hover': { bgcolor: 'rgba(15,82,186,0.04)' },
              }}
            >
              {/* Active background pill */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    style={{
                      position: 'absolute',
                      top: 6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: `${tokens.primary}14`,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {isActive
                  ? <IconOn sx={{ fontSize: 22, color: tokens.primary }} />
                  : <IconOff sx={{ fontSize: 22, color: '#9CA3AF' }} />
                }
              </motion.div>

              {/* Label */}
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? tokens.primary : '#9CA3AF',
                  fontFamily: '"Manrope", sans-serif',
                  lineHeight: 1,
                  transition: 'color 200ms ease, font-weight 200ms ease',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
