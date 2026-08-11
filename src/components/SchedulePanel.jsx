import { Box, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { schedule } from '../data/appointments';

// Image-2 style "My schedule" panel.
export default function SchedulePanel() {
  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>My schedule</Typography>
          <Button size="small" variant="outlined" endIcon={<KeyboardArrowDownIcon />}
            sx={{ py: 0.25, px: 1.25, fontSize: 12, color: '#6B7280' }}>Filter</Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 24, color: '#111827' }}>25 Dec</Typography>
          <Typography sx={{ fontSize: 13, color: '#9CA3AF' }}>26 Dec</Typography>
          <Typography sx={{ fontSize: 13, color: '#9CA3AF' }}>27 Dec</Typography>
          <Typography sx={{ fontSize: 13, color: '#9CA3AF' }}>28 Dec</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {schedule.map((item, idx) => {
            const isAppt = item.type === 'appointment';
            return (
              <Box key={item.id} sx={{ display: 'flex', gap: 1.25 }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#111827', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, mt: 0.25 }}>
                  {idx + 1}
                </Box>
                <Box sx={{ flex: 1, borderLeft: `3px solid ${isAppt ? '#2563EB' : '#10B981'}`, pl: 1.5, py: 0.25 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.title}</Typography>
                  {item.subtitle && <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{item.subtitle}</Typography>}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography sx={{ fontSize: 12, color: '#9CA3AF' }}>{item.time}</Typography>
                    <Chip label={item.chipLabel} size="small"
                      sx={{ height: 20, fontSize: 11, fontWeight: 700,
                        bgcolor: isAppt ? '#EFF6FF' : '#F0FDF4', color: isAppt ? '#2563EB' : '#10B981' }} />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Solid blue "Your Exercise" CTA */}
        <Box sx={{ mt: 2, bgcolor: 'primary.main', borderRadius: '12px', p: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Your Exercise</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Brain activity · 20 min</Typography>
          </Box>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowForwardIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
