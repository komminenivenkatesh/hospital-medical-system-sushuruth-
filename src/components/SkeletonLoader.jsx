import { Box, Typography, Skeleton, Card, CardContent, Grid } from '@mui/material';
import { DoctorCardSkeleton, CardSkeleton, AppointmentRowSkeleton, ArticleSkeleton, DashboardSkeleton } from './PageTransition';

const shimmerSx = { bgcolor: '#EEF2FF' };

export { DoctorCardSkeleton, CardSkeleton, AppointmentRowSkeleton, ArticleSkeleton, DashboardSkeleton };

export default function SkeletonLoader({ rows = 3 }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <DoctorCardSkeleton key={i} />
      ))}
    </Box>
  );
}
