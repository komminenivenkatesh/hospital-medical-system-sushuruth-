import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Avatar, Select, MenuItem, Pagination, Chip, Card, CardContent, Stack, TableContainer,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
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
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 3,
          gap: 2,
        }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: tokens.textPrimary }}>
            {filtered.length} Appointments
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              size="small"
              sx={{
                bgcolor: tokens.surfaceMuted,
                borderRadius: 100,
                fontSize: 13.5,
                fontWeight: 600,
                color: tokens.textSecondary,
                flex: { xs: 1, sm: 'initial' },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
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
                px: { xs: 2.5, sm: 3 },
                py: 0.9,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: 13,
                whiteSpace: 'nowrap',
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
          <>
            {/* Mobile View: Modern responsive cards */}
            <Stack spacing={2} sx={{ display: { xs: 'flex', md: 'none' }, mb: 3 }}>
              {filtered.map((a) => {
                const isUpcoming = a.status === 'Upcoming';
                const isVideo = a.mode === 'Video';
                return (
                  <Card
                    key={a.id}
                    onClick={() => {
                      if (isUpcoming && isVideo) {
                        navigate(`/consult/${a.id}`, {
                          state: { doctorName: a.doctorName, specialty: `${a.specialty} · ${a.hospital || 'Hospital'}` },
                        });
                      } else {
                        navigate(`/appointments/${a.id}`);
                      }
                    }}
                    sx={{
                      borderRadius: 3.5,
                      border: `1px solid ${tokens.border}`,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                      '&:active': { transform: 'scale(0.99)' },
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ height: 3.5, bgcolor: isUpcoming ? tokens.primary : tokens.textTertiary }} />
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      {/* Top row: doctor info + status */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            src={a.photo}
                            sx={{ width: 44, height: 44, border: `2px solid ${tokens.border}`, bgcolor: tokens.primarySoft, color: tokens.primary, fontWeight: 700 }}
                          >
                            {a.doctorName.split(' ').slice(1).map(w => w[0]).join('')}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: 15, color: tokens.textPrimary, lineHeight: 1.2 }}>
                              {a.doctorName}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: tokens.textSecondary, fontWeight: 500, mt: 0.25 }}>
                              {a.specialty}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={a.status}
                          size="small"
                          sx={{
                            bgcolor: isUpcoming ? tokens.successSoft : tokens.surfaceMuted,
                            color: isUpcoming ? tokens.success : tokens.textSecondary,
                            fontWeight: 700,
                            fontSize: 10.5,
                            height: 22,
                          }}
                        />
                      </Box>

                      {/* Middle row: date, time, and mode */}
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                        p: 1.25,
                        borderRadius: 2,
                        bgcolor: tokens.surfaceMuted,
                        mb: 1.5,
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 12, color: tokens.textPrimary, fontWeight: 600 }}>
                          <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: tokens.textTertiary }} />
                          {a.date}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 12, color: tokens.textPrimary, fontWeight: 600, ml: 1 }}>
                          <AccessTimeOutlinedIcon sx={{ fontSize: 14, color: tokens.textTertiary }} />
                          {a.time}
                        </Box>
                        <Chip
                          icon={isVideo ? <VideocamRoundedIcon sx={{ fontSize: '14px !important' }} /> : <LocalHospitalRoundedIcon sx={{ fontSize: '14px !important' }} />}
                          label={a.mode}
                          size="small"
                          sx={{
                            ml: 'auto',
                            height: 20,
                            fontSize: 10.5,
                            fontWeight: 600,
                            bgcolor: isVideo ? `${tokens.teal}18` : tokens.surfaceMuted,
                            color: isVideo ? tokens.teal : tokens.textSecondary,
                          }}
                        />
                      </Box>

                      {/* Action buttons */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {isUpcoming && isVideo ? (
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            startIcon={<VideocamRoundedIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/consult/${a.id}`, {
                                state: { doctorName: a.doctorName, specialty: `${a.specialty} · ${a.hospital || 'Hospital'}` },
                              });
                            }}
                            sx={{ borderRadius: 2, fontWeight: 700, fontSize: 12.5, py: 0.8 }}
                          >
                            Join Video Call
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            onClick={(e) => { e.stopPropagation(); navigate(`/appointments/${a.id}`); }}
                            sx={{ borderRadius: 2, fontWeight: 700, fontSize: 12.5, py: 0.8 }}
                          >
                            View Details
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => { e.stopPropagation(); navigate(`/appointments/${a.id}`); }}
                          sx={{ minWidth: 40, px: 1, borderRadius: 2 }}
                        >
                          <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>

            {/* Desktop View: Full Table */}
            <Card sx={{ display: { xs: 'none', md: 'block' }, borderRadius: 3, overflow: 'hidden', border: `1px solid ${tokens.border}`, boxShadow: 'none' }}>
              <TableContainer sx={{ overflowX: 'auto' }}>
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
                        onClick={() => {
                          if (a.status === 'Upcoming' && a.mode === 'Video') {
                            navigate(`/consult/${a.id}`, {
                              state: { doctorName: a.doctorName, specialty: `${a.specialty} · ${a.hospital || 'Hospital'}` },
                            });
                          } else {
                            navigate(`/appointments/${a.id}`);
                          }
                        }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              if (a.status === 'Upcoming' && a.mode === 'Video') {
                                navigate(`/consult/${a.id}`, {
                                  state: { doctorName: a.doctorName, specialty: `${a.specialty} · ${a.hospital || 'Hospital'}` },
                                });
                              } else {
                                navigate(`/appointments/${a.id}`);
                              }
                            }}
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
              </TableContainer>
            </Card>
          </>
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
                  '&.Mui-selected': { bgcolor: tokens.primarySoft, color: tokens.primary, fontWeight: 700 },
                },
              }}
            />
          </Box>
        )}
      </Box>
    </PageTransition>
  );
}
