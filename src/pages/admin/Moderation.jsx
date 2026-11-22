import { useState } from 'react';
import {
  Card, CardContent, Typography, List, ListItem, ListItemAvatar, Avatar,
  ListItemText, Chip, Button, Box, Stack, Grid, Snackbar, Alert,
} from '@mui/material';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import MetricCard from '../../components/MetricCard';

const initialReports = [
  { id: 1, target: 'Review on Dr. Imran Q.', reason: 'Inappropriate language', severity: 'High', reporter: 'System' },
  { id: 2, target: 'Doctor profile photo', reason: 'Possibly misleading', severity: 'Medium', reporter: 'User' },
  { id: 3, target: 'Chat message thread', reason: 'Spam suspected', severity: 'Low', reporter: 'User' },
];

const sevColor = {
  High: ['#FFF1F2', '#EF4444'],
  Medium: ['#FFFBEB', '#B45309'],
  Low: ['#F3F4F6', '#6B7280'],
};

export default function Moderation() {
  const [reportsList, setReportsList] = useState(initialReports);
  const [resolvedCount, setResolvedCount] = useState(42);
  const [snackbar, setSnackbar] = useState('');

  const handleDismiss = (id, target) => {
    setReportsList((prev) => prev.filter((r) => r.id !== id));
    setResolvedCount((c) => c + 1);
    setSnackbar(`Report for "${target}" dismissed.`);
  };

  const handleRemove = (id, target) => {
    setReportsList((prev) => prev.filter((r) => r.id !== id));
    setResolvedCount((c) => c + 1);
    setSnackbar(`Flagged content "${target}" removed and user notified.`);
  };

  return (
    <PageTransition>
      <PageHeader title="Moderation" subtitle="Review flagged content and reports" />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label="Open Reports"
            value={reportsList.length}
            animate
            statusText={reportsList.length > 0 ? 'Action needed' : 'All clear'}
            statusColor={reportsList.length > 0 ? '#EF4444' : '#10B981'}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Resolved (7d)" value={resolvedCount} animate />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Avg. Resolution" value="3h 20m" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Auto-flagged" value={18} animate />
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: '16px' }}>
        <CardContent sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 700, px: 1, pt: 1, mb: 1 }}>Flagged Items</Typography>
          {reportsList.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: 44, color: '#10B981', mb: 1 }} />
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>No pending reports</Typography>
              <Typography sx={{ fontSize: 13, color: '#6B7280' }}>All flagged items have been reviewed and resolved.</Typography>
            </Box>
          ) : (
            <List>
              {reportsList.map((r, i) => (
                <ListItem
                  key={r.id}
                  divider={i < reportsList.length - 1}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleDismiss(r.id, r.target)}
                        sx={{ borderRadius: '100px' }}
                      >
                        Dismiss
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleRemove(r.id, r.target)}
                        sx={{ borderRadius: '100px' }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#FFF1F2', color: '#EF4444' }}>
                      <FlagOutlinedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{r.target}</Typography>
                        <Chip
                          label={r.severity}
                          size="small"
                          sx={{
                            bgcolor: sevColor[r.severity][0],
                            color: sevColor[r.severity][1],
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                    }
                    secondary={`${r.reason} · reported by ${r.reporter}`}
                    slotProps={{ secondary: { fontSize: 12 } }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </PageTransition>
  );
}
