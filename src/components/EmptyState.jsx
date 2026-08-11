import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

/* ============================================================
   Illustrated Empty State Component
   World-class friendly empty states — inline SVG, no image files
   ============================================================ */

const illustrations = {
  'no-doctors': ({ color }) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="50" fill={`${color}12`} />
      <circle cx="60" cy="44" r="18" fill={`${color}20`} stroke={color} strokeWidth="2" strokeDasharray="4 2" />
      <path d="M34 85c0-14.4 11.6-26 26-26s26 11.6 26 26" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="4 3" />
      <circle cx="84" cy="36" r="12" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
      <path d="M80 36h8M84 32v8" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="53" y="70" width="14" height="10" rx="3" fill={`${color}30`} />
      <rect x="51" y="72" width="18" height="3" rx="1.5" fill={color} opacity="0.4" />
    </svg>
  ),
  'no-appointments': ({ color }) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="50" fill={`${color}12`} />
      <rect x="28" y="32" width="64" height="56" rx="10" fill="white" stroke={color} strokeWidth="2" />
      <rect x="28" y="32" width="64" height="22" rx="10" fill={`${color}20`} />
      <rect x="28" y="42" width="64" height="12" fill={`${color}20`} />
      <line x1="44" y1="25" x2="44" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="76" y1="25" x2="76" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="64" r="5" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
      <circle cx="60" cy="64" r="5" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
      <circle cx="76" cy="64" r="5" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
      <path d="M50 80h20" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M42 96l36 0" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  'no-messages': ({ color }) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="50" fill={`${color}12`} />
      <rect x="22" y="34" width="60" height="44" rx="12" fill="white" stroke={color} strokeWidth="2" />
      <path d="M22 70l18 12v-12" fill="white" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M36 50h32M36 60h20" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="82" cy="38" r="12" fill="#F0FDF4" stroke="#22C55E" strokeWidth="2" />
      <path d="M78 38l3 3 5-5" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'no-records': ({ color }) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="50" fill={`${color}12`} />
      <rect x="32" y="24" width="56" height="72" rx="10" fill="white" stroke={color} strokeWidth="2" />
      <path d="M44 44h32M44 56h32M44 68h20" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
      <circle cx="44" cy="44" r="3" fill={color} opacity="0.5" />
      <circle cx="44" cy="56" r="3" fill={color} opacity="0.5" />
      <circle cx="44" cy="68" r="3" fill={color} opacity="0.35" />
      <circle cx="80" cy="82" r="14" fill="#F0FDF4" stroke="#22C55E" strokeWidth="2.5" />
      <path d="M76 82l3 3 5-6" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'no-results': ({ color }) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="50" fill={`${color}12`} />
      <circle cx="52" cy="50" r="22" fill="white" stroke={color} strokeWidth="2.5" />
      <path d="M68 66l18 18" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M44 44h16M52 36v16" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
      <circle cx="90" cy="34" r="10" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
      <path d="M87 31l6 6M93 31l-6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  'no-data': ({ color }) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="50" fill={`${color}12`} />
      <rect x="24" y="72" width="16" height="24" rx="4" fill={`${color}40`} />
      <rect x="46" y="56" width="16" height="40" rx="4" fill={`${color}60`} />
      <rect x="68" y="44" width="16" height="52" rx="4" fill={color} opacity="0.8" />
      <path d="M24 40c8-8 20 8 32-4s20-16 28-12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" fill="none" />
      <circle cx="90" cy="84" r="12" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
      <path d="M87 81l6 6M93 81l-6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const defaults = {
  'no-doctors':      { title: 'No doctors found',       subtitle: 'Try adjusting your search filters or broadening your criteria.', cta: 'Clear filters' },
  'no-appointments': { title: 'No appointments yet',    subtitle: 'Book your first consultation with a specialist today.', cta: 'Find a Doctor' },
  'no-messages':     { title: 'No conversations yet',   subtitle: 'Messages from your doctors will appear here.', cta: 'Find a Doctor' },
  'no-records':      { title: 'No health records yet',  subtitle: 'Upload your prescriptions, lab reports, and scans to get started.', cta: 'Upload Record' },
  'no-results':      { title: 'No results found',       subtitle: "We couldn't find what you're looking for. Try a different search.", cta: 'Clear search' },
  'no-data':         { title: 'No data available',      subtitle: 'Data will appear here once available.', cta: null },
};

export default function EmptyState({
  variant = 'no-results',
  title,
  subtitle,
  cta,
  onCta,
  color = '#0F52BA',
  compact = false,
}) {
  const d = defaults[variant] || defaults['no-results'];
  const Illustration = illustrations[variant] || illustrations['no-results'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: compact ? 4 : 8,
          px: 3,
        }}
      >
        {/* Illustration */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ marginBottom: compact ? 16 : 24 }}
        >
          <Illustration color={color} />
        </motion.div>

        {/* Title */}
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: compact ? 16 : 20,
            color: '#111827',
            mb: 0.75,
            letterSpacing: '-0.01em',
          }}
        >
          {title || d.title}
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: compact ? 13 : 14,
            color: '#6B7280',
            lineHeight: 1.6,
            maxWidth: 320,
            mb: (cta !== undefined ? cta : d.cta) ? 3 : 0,
          }}
        >
          {subtitle || d.subtitle}
        </Typography>

        {/* CTA Button */}
        {(cta !== undefined ? cta : d.cta) && (
          <Button
            variant="contained"
            onClick={onCta}
            sx={{
              fontWeight: 700,
              px: 3,
              borderRadius: 100,
              background: `linear-gradient(135deg, ${color}, ${color}CC)`,
              boxShadow: `0 4px 16px ${color}40`,
              '&:hover': {
                boxShadow: `0 6px 20px ${color}55`,
                transform: 'translateY(-1px)',
              },
            }}
          >
            {cta || d.cta}
          </Button>
        )}
      </Box>
    </motion.div>
  );
}
