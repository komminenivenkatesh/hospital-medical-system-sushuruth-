import { Card, CardContent, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, Button, Box, Stack } from '@mui/material';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import MetricCard from '../../components/MetricCard';
import { Grid } from '@mui/material';

const reports = [
  { id: 1, target: 'Review on Dr. Imran Q.', reason: 'Inappropriate language', severity: 'High', reporter: 'System' },
  { id: 2, target: 'Doctor profile photo', reason: 'Possibly misleading', severity: 'Medium', reporter: 'User' },
  { id: 3, target: 'Chat message thread', reason: 'Spam suspected', severity: 'Low', reporter: 'User' },
];
const sevColor = { High: ['#FFF1F2', '#EF4444'], Medium: ['#FFFBEB', '#B45309'], Low: ['#F3F4F6', '#6B7280'] };

export default function Moderation() {
  return (
    <PageTransition>
      <PageHeader title="Moderation" subtitle="Review flagged content and reports" />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="Open Reports" value={3} animate statusText="Action needed" statusColor="#EF4444" /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="Resolved (7d)" value={42} animate /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="Avg. Resolution" value="3h 20m" /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="Auto-flagged" value={18} animate /></Grid>
      </Grid>

      <Card><CardContent sx={{ p: 1 }}>
        <Typography sx={{ fontWeight: 700, px: 1, pt: 1, mb: 0.5 }}>Flagged Items</Typography>
        <List>
          {reports.map((r, i) => (
            <ListItem key={r.id} divider={i < reports.length - 1}
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined">Dismiss</Button>
                  <Button size="small" variant="contained" color="error">Remove</Button>
                </Stack>
              }>
              <ListItemAvatar><Avatar sx={{ bgcolor: '#FFF1F2', color: '#EF4444' }}><FlagOutlinedIcon /></Avatar></ListItemAvatar>
              <ListItemText
                primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{r.target}</Typography>
                  <Chip label={r.severity} size="small" sx={{ bgcolor: sevColor[r.severity][0], color: sevColor[r.severity][1], fontWeight: 700 }} />
                </Box>}
                secondary={`${r.reason} · reported by ${r.reporter}`} slotProps={{ secondary: { fontSize: 12 } }} />
            </ListItem>
          ))}
        </List>
      </CardContent></Card>
    </PageTransition>
  );
}
