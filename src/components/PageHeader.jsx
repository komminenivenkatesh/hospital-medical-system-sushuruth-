import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { tokens } from '../theme/theme';

export default function PageHeader({ title, subtitle, right, breadcrumbs }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs
              separator={<NavigateNextRoundedIcon sx={{ fontSize: 14, color: tokens.textTertiary }} />}
              sx={{ mb: 1, '& .MuiBreadcrumbs-ol': { alignItems: 'center' } }}
            >
              {breadcrumbs.map((bc, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography key={bc.label} sx={{ fontSize: 12, fontWeight: 700, color: tokens.textPrimary, letterSpacing: '0.02em' }}>
                    {bc.label}
                  </Typography>
                ) : (
                  <Link
                    key={bc.label}
                    component="button"
                    underline="none"
                    onClick={() => navigate(bc.path)}
                    sx={{ fontSize: 12, fontWeight: 600, color: tokens.textTertiary, '&:hover': { color: tokens.primary } }}
                  >
                    {bc.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}

          <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, color: tokens.textPrimary, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: 14, color: tokens.textSecondary, mt: 0.75, maxWidth: 600, lineHeight: 1.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {right && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {right}
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
