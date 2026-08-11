import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Avatar, Select, MenuItem, Pagination, Chip, Card
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import { tokens } from '../../theme/theme';
import { appointments } from '../../data/appointments';

export default function Appointments() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All Appointments');

  const filtered = appointments.filter((a) => {
    if (filter === 'Upcoming') return a.status === 'Upcoming';
    if (filter === 'Completed') return a.status === 'Completed';
    return true;
  });

  return (
    <PageTransition>
      <Box sx={{ pb: 6 }}>
        <PageHeader
          title="Appointments"
          subtitle="Manage your upcoming consultations and review past visits."
          breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Appointments' }]}
        />

        {/* Sub Header / Filters */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: tokens.textPrimary }}>
            {filtered.length} Appointments
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              size="small"
              sx={{ 
                bgcolor: tokens.surfaceMuted, 
                borderRadius: 100, 
                fontSize: 14, 
                fontWeight: 600, 
                color: tokens.textSecondary,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
              }}
            >
              <MenuItem value="All Appointments">All Appointments</MenuItem>
              <MenuItem value="Upcoming">Upcoming</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>

            <Button 
              variant="contained" 
              startIcon={<AddRoundedIcon />}
              onClick={() => navigate('/find-doctors')}
              sx={{ 
                borderRadius: 100, 
                px: 3, 
                py: 1, 
                textTransform: 'none', 
                fontWeight: 700,
              }}
            >
              Book New
            </Button>
          </Box>
        </Box>

        {filtered.length === 0 ? (
          <EmptyState
            variant="general"
            title="No appointments found"
            subtitle="You don't have any appointments matching this filter."
            cta="Book an Appointment"
            onCta={() => navigate('/find-doctors')}
          />
        ) : (
          <Card sx={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${tokens.border}`, boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: tokens.surfaceMuted }}>
                  <TableCell sx={{ fontWeight: 700, color: tokens.textSecondary, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', py: 2 }}>Doctor</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: tokens.textSecondary, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', py: 2 }}>Specialty</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: tokens.textSecondary, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', py: 2 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: tokens.textSecondary, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', py: 2 }}>Mode</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: tokens.textSecondary, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: tokens.textSecondary, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', py: 2 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}
                    onClick={() => navigate(a.status === 'Upcoming' && a.mode === 'Video' ? `/consult/${a.id}` : `/appointments/${a.id}`)}
                    sx={{ '&:last-child td': { border: 0 }, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                    
                    {/* Doctor Info */}
                    <TableCell sx={{ borderBottom: `1px solid ${tokens.border}`, py: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={a.photo} sx={{ width: 32, height: 32, bgcolor: tokens.surfaceMuted, color: tokens.textSecondary, fontWeight: 700, fontSize: 12 }}>
                          {a.doctorName.split(' ').slice(1).map(w => w[0]).join('')}
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: tokens.textPrimary }}>{a.doctorName}</Typography>
                      </Box>
                    </TableCell>

                    {/* Specialty */}
                    <TableCell sx={{ borderBottom: `1px solid ${tokens.border}`, py: 2.5 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 14, color: tokens.textSecondary }}>{a.specialty}</Typography>
                    </TableCell>

                    {/* Date */}
                    <TableCell sx={{ borderBottom: `1px solid ${tokens.border}`, py: 2.5 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 14, color: tokens.textPrimary }}>{a.date}</Typography>
                      <Typography sx={{ fontSize: 12, color: tokens.textTertiary }}>{a.time}</Typography>
                    </TableCell>

                    {/* Mode */}
                    <TableCell sx={{ borderBottom: `1px solid ${tokens.border}`, py: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: a.mode === 'Video' ? tokens.teal : tokens.textTertiary }} />
                        <Typography sx={{ color: tokens.textSecondary, fontSize: 14, fontWeight: 600 }}>{a.mode}</Typography>
                      </Box>
                    </TableCell>

                    {/* Status */}
                    <TableCell sx={{ borderBottom: `1px solid ${tokens.border}`, py: 2.5 }}>
                      <Chip
                        label={a.status}
                        size="small"
                        sx={{
                          bgcolor: a.status === 'Upcoming' ? tokens.successSoft : tokens.surfaceMuted,
                          color: a.status === 'Upcoming' ? tokens.success : tokens.textSecondary,
                          fontWeight: 700, fontSize: 11, height: 22, letterSpacing: '0.02em',
                        }}
                      />
                    </TableCell>

                    {/* Action */}
                    <TableCell sx={{ borderBottom: `1px solid ${tokens.border}`, py: 2.5 }}>
                      <Button
                        onClick={(e) => { e.stopPropagation(); navigate(a.status === 'Upcoming' && a.mode === 'Video' ? `/consult/${a.id}` : `/appointments/${a.id}`); }}
                        sx={{ 
                          bgcolor: a.status === 'Upcoming' ? tokens.primarySoft : tokens.surfaceMuted, 
                          color: a.status === 'Upcoming' ? tokens.primary : tokens.textSecondary, 
                          fontWeight: 700, 
                          fontSize: 12,
                          textTransform: 'none',
                          borderRadius: 100,
                          px: 2,
                          py: 0.5,
                          '&:hover': { bgcolor: a.status === 'Upcoming' ? `${tokens.primary}25` : `${tokens.textTertiary}25` }
                        }}
                      >
                        {a.status === 'Upcoming' ? (a.mode === 'Video' ? 'Join Call' : 'View Details') : 'View History'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <Box sx={{ display: 'flex', mt: 4, justifyContent: 'center' }}>
            <Pagination 
              count={Math.max(1, Math.ceil(filtered.length / 8))} 
              shape="rounded" 
              sx={{ 
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  fontSize: 14,
                  color: tokens.textSecondary,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 2,
                  bgcolor: '#fff',
                  width: 36,
                  height: 36,
                  '&.Mui-selected': {
                    bgcolor: tokens.primary,
                    color: '#fff',
                    borderColor: tokens.primary,
                    '&:hover': { bgcolor: tokens.primaryDark }
                  }
                }
              }} 
            />
          </Box>
        )}

      </Box>
    </PageTransition>
  );
}
