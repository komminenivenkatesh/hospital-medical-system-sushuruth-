import { Box, Card, CardContent, Typography, IconButton, Chip } from '@mui/material';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { motion } from 'framer-motion';
import { tokens } from '../theme/theme';

export default function SectionCard({ title, arrow, menu, action, children, sx, contentSx, noPadding, tag, tagColor = tokens.primary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ height: '100%' }}
    >
      <Card sx={{ height: '100%', ...sx }}>
        <CardContent sx={{ p: noPadding ? 0 : 3, '&:last-child': { pb: noPadding ? 0 : 3 }, ...contentSx, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {title && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5, ...(noPadding ? { px: 3, pt: 3 } : {}) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 4, height: 18, borderRadius: 4, bgcolor: tokens.primary }} />
                <Typography sx={{ fontWeight: 800, fontSize: 16, color: tokens.textPrimary, letterSpacing: '-0.01em' }}>{title}</Typography>
                {tag && (
                  <Chip
                    label={tag}
                    size="small"
                    sx={{
                      height: 22, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                      bgcolor: `${tagColor}15`, color: tagColor, ml: 1,
                    }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
                {menu && (
                  <IconButton size="small" sx={{ width: 32, height: 32, bgcolor: tokens.surfaceMuted, '&:hover': { bgcolor: tokens.border } }}>
                    <MoreHorizRoundedIcon sx={{ fontSize: 18, color: tokens.textSecondary }} />
                  </IconButton>
                )}
                {arrow && (
                  <IconButton size="small" onClick={action} sx={{ width: 32, height: 32, bgcolor: tokens.surfaceMuted, '&:hover': { bgcolor: tokens.primarySoft, color: tokens.primary } }}>
                    <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PillTabs({ tabs, value, onChange }) {
  return (
    <Box sx={{ bgcolor: tokens.surfaceMuted, borderRadius: 100, p: 0.5, display: 'inline-flex', gap: 0.5, mb: 3 }}>
      {tabs.map((t, i) => (
        <Box key={t} onClick={() => onChange(i)}
          sx={{
            px: 2.5, py: 1, borderRadius: 100, cursor: 'pointer',
            bgcolor: value === i ? '#fff' : 'transparent',
            boxShadow: value === i ? tokens.cardShadow : 'none',
            fontWeight: value === i ? 700 : 600, fontSize: 13,
            color: value === i ? tokens.primary : tokens.textSecondary,
            transition: 'all 200ms ease',
            '&:hover': { color: tokens.textPrimary, bgcolor: value === i ? '#fff' : 'rgba(0,0,0,0.02)' }
          }}>
          {t}
        </Box>
      ))}
    </Box>
  );
}

export function StatGrid({ items }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
      {items.map((item) => (
        <Box key={item.label} sx={{ p: 1.5, bgcolor: tokens.surfaceMuted, borderRadius: 3, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          {item.icon && <item.icon sx={{ fontSize: 18, color: tokens.primary, mt: 0.2 }} />}
          <Box>
            <Typography sx={{ fontSize: 11, color: tokens.textSecondary, fontWeight: 600, mb: 0.5 }}>{item.label}</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: tokens.textPrimary, lineHeight: 1.2 }}>{item.value}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export function DoctorAttribution({ photo, name, date, small }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box component="img" src={photo} sx={{ width: small ? 24 : 32, height: small ? 24 : 32, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${tokens.border}` }} />
      <Box>
        <Typography sx={{ fontSize: small ? 12 : 13, fontWeight: 700, color: tokens.textPrimary, lineHeight: 1.2 }}>{name}</Typography>
        {date && <Typography sx={{ fontSize: 11, color: tokens.textTertiary, mt: 0.2 }}>{date}</Typography>}
      </Box>
    </Box>
  );
}

export function SeverityDots({ value, max = 10 }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.4 }}>
      {Array.from({ length: max }, (_, i) => (
        <Box key={i} sx={{
          width: 8, height: 8, borderRadius: '50%',
          bgcolor: i < value ? tokens.primary : tokens.surfaceMuted,
          border: `1px solid ${i < value ? tokens.primary : tokens.border}`
        }} />
      ))}
    </Box>
  );
}
