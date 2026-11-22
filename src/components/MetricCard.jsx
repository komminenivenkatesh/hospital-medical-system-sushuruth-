import { Box, Card, CardContent, Typography, IconButton, Chip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import useCounter from '../hooks/useCounter';

// Bisfit-style stat card: small icon top-left, "..." top-right,
// muted label, optional status text, large Manrope-800 value.
export default function MetricCard({
  icon: Icon, label, value, suffix, statusText, statusColor = '#10B981',
  chip, animate = false, footer, compact = false, onMore,
}) {
  const numeric = typeof value === 'number';
  const counted = useCounter(numeric ? value : 0);
  const shown = numeric && animate ? counted : value;

  return (
    <Card sx={{ height: '100%', borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 1.5, sm: compact ? 2 : 2.5 }, '&:last-child': { pb: { xs: 1.5, sm: compact ? 2 : 2.5 } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 1, sm: 1.5 } }}>
          {Icon ? <Icon sx={{ fontSize: { xs: 18, sm: 20 }, color: statusColor || '#9CA3AF' }} /> : <span />}
          <IconButton size="small" onClick={onMore || (() => {})} sx={{ color: '#D1D5DB', p: 0.25 }}>
            <MoreHorizIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: { xs: 11, sm: 12 }, fontWeight: 600, color: '#6B7280' }} noWrap>{label}</Typography>
          {statusText && (
            <Typography sx={{ fontSize: { xs: 10.5, sm: 12 }, fontWeight: 700, color: statusColor }}>{statusText}</Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mt: 0.5 }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, sm: compact ? 24 : 28 }, color: '#111827', lineHeight: 1.1 }}>
            {shown}
          </Typography>
          {suffix && <Typography sx={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>{suffix}</Typography>}
        </Box>

        {chip && (
          <Chip size="small" label={chip.label}
            sx={{ mt: 1, height: 20, bgcolor: chip.bg || '#F0FDF4', color: chip.color || '#15803D', fontWeight: 700, fontSize: 10.5 }} />
        )}
        {footer && <Box sx={{ mt: 1.5 }}>{footer}</Box>}
      </CardContent>
    </Card>
  );
}
