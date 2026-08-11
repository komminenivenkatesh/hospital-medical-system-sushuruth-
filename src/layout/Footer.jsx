import { Box, Grid, Typography, Link, Divider, IconButton, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { tokens } from '../theme/theme';

// Social icons as inline SVG
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.633L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
  </svg>
);
const YouTubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const footerSections = [
  {
    title: 'Sushruth',
    links: [
      { label: 'About us',       path: '/dashboard' },
      { label: 'How it works',   path: '/dashboard' },
      { label: 'Careers',        path: '/dashboard' },
      { label: 'Press & media',  path: '/dashboard' },
      { label: 'Blog',           path: '/dashboard' },
    ],
  },
  {
    title: 'For Patients',
    links: [
      { label: 'Find Doctors',        path: '/find-doctors' },
      { label: 'Book Appointment',    path: '/find-doctors' },
      { label: 'AI MRI Analysis',     path: '/mri' },
      { label: 'Video Consultation',  path: '/appointments' },
      { label: 'Health Vault',        path: '/health' },
    ],
  },
  {
    title: 'For Doctors',
    links: [
      { label: 'Doctor Dashboard',    path: '/doctor/dashboard' },
      { label: 'Join as a Doctor',    path: '/login' },
      { label: 'Verification Process', path: '/login' },
      { label: 'Earnings & Payouts',  path: '/doctor/earnings' },
      { label: 'Doctor App',          path: '/login' },
    ],
  },
  {
    title: 'Legal & Safety',
    links: [
      { label: 'Privacy Policy',    path: '/dashboard' },
      { label: 'Terms of Service',  path: '/dashboard' },
      { label: 'Cookie Policy',     path: '/dashboard' },
      { label: 'HIPAA Compliance',  path: '/dashboard' },
      { label: 'Data Protection',   path: '/dashboard' },
    ],
  },
];

const trustBadges = [
  { label: 'HIPAA Compliant', color: tokens.success, soft: tokens.successSoft },
  { label: 'ISO 27001',       color: tokens.primary,  soft: tokens.primarySoft },
  { label: 'NABH Registered', color: '#7C3AED',       soft: '#F3F0FF' },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderTop: `1px solid ${tokens.border}`,
        mt: 6,
        pt: { xs: 5, md: 8 },
        pb: 0,
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 3, md: 6 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>

          {/* Brand column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, cursor: 'pointer' }}
              onClick={() => navigate('/dashboard')}>
              <Logo size={28} />
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: tokens.primary, lineHeight: 1 }}>
                  Sushruth
                </Typography>
                <Typography sx={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.teal }}>
                  Healthcare
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ fontSize: 13.5, color: tokens.textSecondary, lineHeight: 1.75, mb: 3, maxWidth: 300 }}>
              India's first AI-powered healthcare super-app. Book doctors, analyse MRI scans, consult live — all in one place, starting free.
            </Typography>

            {/* Trust Badges */}
            <Stack direction="row" spacing={0.75} flexWrap="wrap" gap={0.75} mb={3}>
              {trustBadges.map((b) => (
                <Chip
                  key={b.label}
                  label={b.label}
                  size="small"
                  sx={{
                    bgcolor: b.soft,
                    color: b.color,
                    fontWeight: 700,
                    fontSize: 10.5,
                    border: `1px solid ${b.color}25`,
                    height: 24,
                  }}
                />
              ))}
            </Stack>

            {/* Socials */}
            <Stack direction="row" spacing={0.75}>
              {[
                { Icon: TwitterIcon,   label: 'Twitter'   },
                { Icon: LinkedInIcon,  label: 'LinkedIn'  },
                { Icon: InstagramIcon, label: 'Instagram' },
                { Icon: YouTubeIcon,   label: 'YouTube'   },
              ].map(({ Icon, label }) => (
                <IconButton
                  key={label}
                  size="small"
                  aria-label={label}
                  sx={{
                    width: 34, height: 34,
                    bgcolor: tokens.surfaceMuted,
                    color: tokens.textTertiary,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: '10px',
                    transition: 'all 150ms ease',
                    '&:hover': {
                      bgcolor: tokens.primarySoft,
                      color: tokens.primary,
                      borderColor: `${tokens.primary}40`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${tokens.primaryGlow || 'rgba(15,82,186,0.2)'}`,
                    },
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Link columns */}
          {footerSections.map((section) => (
            <Grid key={section.title} size={{ xs: 6, sm: 3, md: 2 }}>
              <Typography sx={{
                fontWeight: 700,
                fontSize: 12,
                color: tokens.textPrimary,
                mb: 2.5,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {section.title}
              </Typography>
              <Stack spacing={1.5}>
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    component="button"
                    underline="none"
                    onClick={() => navigate(link.path)}
                    sx={{
                      fontSize: 13.5,
                      color: tokens.textSecondary,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'block',
                      transition: 'color 150ms ease',
                      '&:hover': { color: tokens.primary },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Newsletter / App download strip */}
        <Box
          sx={{
            mt: 6,
            p: 3,
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${tokens.primarySoft} 0%, ${tokens.tealSoft || '#F0FDFA'} 100%)`,
            border: `1px solid ${tokens.primary}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 15, color: tokens.primary, mb: 0.5 }}>
              Download the Sushruth App
            </Typography>
            <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>
              Available on iOS & Android · 4.8★ · 500K+ downloads
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Box
              component="button"
              sx={{
                border: `1.5px solid ${tokens.primary}`,
                borderRadius: '10px',
                px: 2, py: 1,
                bgcolor: 'transparent',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 1,
                color: tokens.primary,
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 700, fontSize: 12.5,
                transition: 'all 150ms ease',
                '&:hover': { bgcolor: tokens.primarySoft, transform: 'translateY(-1px)' },
              }}
            >
              🍎 App Store
            </Box>
            <Box
              component="button"
              sx={{
                border: `1.5px solid ${tokens.primary}`,
                borderRadius: '10px',
                px: 2, py: 1,
                bgcolor: 'transparent',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 1,
                color: tokens.primary,
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 700, fontSize: 12.5,
                transition: 'all 150ms ease',
                '&:hover': { bgcolor: tokens.primarySoft, transform: 'translateY(-1px)' },
              }}
            >
              🤖 Play Store
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ my: 3, borderColor: tokens.border }} />

        {/* Bottom bar */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          pb: 3,
        }}>
          <Typography sx={{ fontSize: 12.5, color: tokens.textTertiary }}>
            © 2025 Sushruth Healthcare Pvt. Ltd. · All rights reserved. · Bengaluru, India
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box className="live-dot" />
              <Typography sx={{ fontSize: 12, color: tokens.textTertiary }}>All systems operational</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: tokens.textTertiary }}>v2.0.0</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
