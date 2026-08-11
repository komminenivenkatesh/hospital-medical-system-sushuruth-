import { useState } from 'react';
import { Box, Typography, TextField, Button, Divider, Paper, Avatar, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Logo from '../../components/Logo';

const features = [
  'AI-powered symptom analysis & specialist matching',
  'Secure MRI & lab report vault',
  'Video consultations with 500+ verified doctors',
  'Family health management in one place',
];

const testimonials = [
  { name: 'Dr. Priya Mehta', role: 'Neurologist · Fortis Hospital', text: 'Sushruth has transformed how I connect with patients. The platform is intuitive and reliable.', avatar: 'PM' },
  { name: 'Meera Sharma', role: 'Patient · Pune', text: 'Got my MRI analysed by AI and connected with a specialist in under 10 minutes. Incredible!', avatar: 'MS' },
];

const roles = [
  { label: 'Patient',  icon: PersonRoundedIcon,              path: '/dashboard',         color: '#0F52BA', desc: 'Book doctors, manage health' },
  { label: 'Doctor',   icon: MedicalServicesRoundedIcon,     path: '/doctor/dashboard',  color: '#0D9488', desc: 'Manage patients & earnings' },
  { label: 'Admin',    icon: AdminPanelSettingsRoundedIcon,  path: '/admin',             color: '#7C3AED', desc: 'Platform administration' },
];

export default function Login() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#F5F7FB',
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      {/* LEFT — Brand Story Panel */}
      <Box
        sx={{
          flex: '0 0 48%',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(145deg, #0F52BA 0%, #0A3D8F 40%, #0D2E6E 100%)',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background circles */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', bottom: -100, left: -60, width: 350, height: 350, borderRadius: '50%', background: 'rgba(13,148,136,0.15)' }} />
        <Box sx={{ position: 'absolute', top: '40%', right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        {/* Top: Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Logo size={36} light showWordmark wordmarkSize={20} />
        </motion.div>

        {/* Middle: Hero Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <Chip
              label="India's #1 AI Healthcare Platform"
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.04em',
                mb: 3,
                backdropFilter: 'blur(8px)',
              }}
            />
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                color: '#fff',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Healthcare that
              <Box component="span" sx={{ color: '#5EEAD4', display: 'block' }}>
                understands you.
              </Box>
            </Typography>
            <Typography sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, mb: 4, maxWidth: 400 }}>
              From AI-powered diagnostics to real-time doctor consultations — Sushruth brings world-class healthcare to your fingertips.
            </Typography>
          </motion.div>

          {/* Feature list */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 5 }}>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <CheckCircleRoundedIcon sx={{ color: '#5EEAD4', fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{f}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Box>

        {/* Bottom: Testimonial */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}>
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              p: 3,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, fontStyle: 'italic', mb: 2 }}>
              "{testimonials[currentTestimonial].text}"
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(255,255,255,0.2)', fontWeight: 700, fontSize: 13, color: '#fff' }}>
                  {testimonials[currentTestimonial].avatar}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{testimonials[currentTestimonial].name}</Typography>
                  <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{testimonials[currentTestimonial].role}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                {testimonials.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    sx={{
                      width: i === currentTestimonial ? 20 : 6,
                      height: 6,
                      borderRadius: '100px',
                      bgcolor: i === currentTestimonial ? '#5EEAD4' : 'rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 300ms ease',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* RIGHT — Sign In Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ width: '100%', maxWidth: 440 }}
        >
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'center', mb: 4 }}>
            <Logo size={32} showWordmark wordmarkSize={18} />
          </Box>

          <Typography sx={{ fontWeight: 800, fontSize: { xs: 26, md: 30 }, letterSpacing: '-0.025em', color: '#111827', mb: 0.75 }}>
            Welcome back 👋
          </Typography>
          <Typography sx={{ fontSize: 15, color: '#6B7280', mb: 4, lineHeight: 1.6 }}>
            Sign in to continue to your Sushruth account
          </Typography>

          {/* Form */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Phone or Email"
              defaultValue="meera@example.com"
              size="medium"
              InputProps={{
                sx: { borderRadius: '12px', bgcolor: '#fff', fontSize: 15 },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              defaultValue="password"
              size="medium"
              InputProps={{
                sx: { borderRadius: '12px', bgcolor: '#fff', fontSize: 15 },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography sx={{ fontSize: 13, color: '#0F52BA', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Forgot password?
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{
                py: 1.75,
                fontSize: 15,
                fontWeight: 700,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0F52BA 0%, #0A3D8F 100%)',
                boxShadow: '0 4px 16px rgba(15,82,186,0.35)',
                '&:hover': {
                  boxShadow: '0 6px 24px rgba(15,82,186,0.45)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 250ms ease',
              }}
            >
              Sign In
            </Button>
          </Box>

          <Divider sx={{ my: 3, fontSize: 13, color: '#9CA3AF' }}>or continue as</Divider>

          {/* Role cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = activeRole === r.label;
              return (
                <motion.div
                  key={r.label}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Paper
                    onClick={() => { setActiveRole(r.label); setTimeout(() => navigate(r.path), 160); }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      border: `1.5px solid ${isSelected ? r.color : '#E5E7EB'}`,
                      borderRadius: '14px',
                      cursor: 'pointer',
                      bgcolor: isSelected ? `${r.color}08` : '#fff',
                      boxShadow: isSelected ? `0 4px 16px ${r.color}25` : 'none',
                      transition: 'all 200ms ease',
                      '&:hover': {
                        borderColor: r.color,
                        bgcolor: `${r.color}06`,
                        boxShadow: `0 2px 12px ${r.color}20`,
                      },
                    }}
                  >
                    <Box sx={{ width: 42, height: 42, borderRadius: '10px', bgcolor: `${r.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon sx={{ fontSize: 22, color: r.color }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{r.label}</Typography>
                      <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{r.desc}</Typography>
                    </Box>
                    {isSelected && <CheckCircleRoundedIcon sx={{ color: r.color, fontSize: 20 }} />}
                  </Paper>
                </motion.div>
              );
            })}
          </Box>

          {/* Footer */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 4 }}>
            <LockOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
            <Typography sx={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
              Protected by 256-bit SSL encryption · HIPAA compliant
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
