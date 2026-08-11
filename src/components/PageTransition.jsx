import { motion } from 'framer-motion';
import { Box, Typography, Skeleton, Card, CardContent, Grid } from '@mui/material';

/* ============================================================
   Enhanced Page Transition — Directional, Staggered
   ============================================================ */

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.06 },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
};

export const containerVariants = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] },
  },
};

export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.24, ease: [0.34, 1.56, 0.64, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.16 } },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   SectionReveal — Scroll-triggered reveal for sections
   Uses Intersection Observer via framer-motion's whileInView
   ============================================================ */
export function SectionReveal({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   AnimatedNumber — Count-up animation for metrics
   ============================================================ */
export function AnimatedNumber({ value, duration = 0.8, prefix = '', suffix = '' }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {prefix}{value}{suffix}
    </motion.span>
  );
}

/* ============================================================
   Skeleton Loaders — Premium shimmer variants
   ============================================================ */

const shimmerSx = {
  bgcolor: '#EEF2FF',
  '&::after': {
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
  },
};

export function DashboardSkeleton() {
  return (
    <Box>
      {/* Hero skeleton */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Skeleton variant="text" width="40%" height={40} animation="wave" sx={shimmerSx} />
          <Skeleton variant="text" width="60%" height={20} animation="wave" sx={{ ...shimmerSx, mt: 1 }} />
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Skeleton variant="rounded" width={140} height={44} animation="wave" sx={shimmerSx} />
            <Skeleton variant="rounded" width={120} height={44} animation="wave" sx={shimmerSx} />
          </Box>
        </CardContent>
      </Card>

      {/* Stats row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Skeleton variant="circular" width={44} height={44} animation="wave" sx={shimmerSx} />
                <Skeleton variant="text" width="50%" height={32} animation="wave" sx={{ ...shimmerSx, mt: 1.5 }} />
                <Skeleton variant="text" width="70%" height={16} animation="wave" sx={shimmerSx} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cards row */}
      <Grid container spacing={2}>
        {[1, 2, 3].map((i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Skeleton variant="rounded" width="100%" height={120} animation="wave" sx={shimmerSx} />
                <Skeleton variant="text" width="60%" height={20} animation="wave" sx={{ ...shimmerSx, mt: 1.5 }} />
                <Skeleton variant="text" width="80%" height={16} animation="wave" sx={shimmerSx} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function DoctorCardSkeleton() {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', gap: 2, p: 2.5 }}>
        <Skeleton variant="circular" width={64} height={64} animation="wave" sx={shimmerSx} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="55%" height={22} animation="wave" sx={shimmerSx} />
          <Skeleton variant="text" width="40%" height={16} animation="wave" sx={{ ...shimmerSx, mt: 0.5 }} />
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
            <Skeleton variant="rounded" width={72} height={28} animation="wave" sx={shimmerSx} />
            <Skeleton variant="rounded" width={72} height={28} animation="wave" sx={shimmerSx} />
          </Box>
        </Box>
        <Skeleton variant="rounded" width={88} height={36} animation="wave" sx={shimmerSx} />
      </CardContent>
    </Card>
  );
}

export function AppointmentRowSkeleton() {
  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
      <Skeleton variant="circular" width={36} height={36} animation="wave" sx={shimmerSx} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="45%" height={18} animation="wave" sx={shimmerSx} />
        <Skeleton variant="text" width="30%" height={14} animation="wave" sx={{ ...shimmerSx, mt: 0.5 }} />
      </Box>
      <Skeleton variant="rounded" width={80} height={28} animation="wave" sx={shimmerSx} />
    </Box>
  );
}

export function ArticleSkeleton() {
  return (
    <Card>
      <Skeleton variant="rounded" width="100%" height={160} animation="wave" sx={{ ...shimmerSx, borderRadius: '16px 16px 0 0' }} />
      <CardContent sx={{ p: 2.5 }}>
        <Skeleton variant="rounded" width={72} height={22} animation="wave" sx={shimmerSx} />
        <Skeleton variant="text" width="85%" height={20} animation="wave" sx={{ ...shimmerSx, mt: 1 }} />
        <Skeleton variant="text" width="65%" height={16} animation="wave" sx={shimmerSx} />
        <Skeleton variant="text" width="75%" height={16} animation="wave" sx={shimmerSx} />
      </CardContent>
    </Card>
  );
}

export function CardSkeleton({ height = 120 }) {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="40%" animation="wave" sx={shimmerSx} />
        <Skeleton variant="rounded" width="100%" height={height} animation="wave" sx={{ ...shimmerSx, mt: 1 }} />
      </CardContent>
    </Card>
  );
}

export function SkeletonLoader({ rows = 3 }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <DoctorCardSkeleton key={i} />
      ))}
    </Box>
  );
}
