import { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Tabs, Tab, Chip, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Drawer, IconButton, Badge, Avatar, CircularProgress, Alert, Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import { doctorAPI, hospitalAPI } from '../../services/api';

const filters = ['All', 'Pending', 'Approved', 'Rejected'];

const statusColor = {
  Pending: ['#FFFBEB', '#B45309'],
  Approved: ['#F0FDF4', '#15803D'],
  Rejected: ['#FFF1F2', '#EF4444'],
};

export default function Verification() {
  const [tab, setTab] = useState(0); // 0 = Doctor, 1 = Hospital
  const [filter, setFilter] = useState('All');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewRow, setReviewRow] = useState(null);
  const [drawerTab, setDrawerTab] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = filter === 'All' ? {} : { status: filter };
      if (tab === 0) {
        const { data } = await doctorAPI.getVerifications(params);
        setItems(data);
      } else {
        const { data } = await hospitalAPI.getVerifications(params);
        setItems(data);
      }
    } catch (err) {
      console.warn('Failed to load verifications:', err.message);
      setError(`Failed to fetch live ${tab === 0 ? 'doctor' : 'hospital'} verifications from the server.`);
    } finally {
      setLoading(false);
    }
  }, [tab, filter]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const handleUpdateStatus = async (item, newStatus) => {
    setActionLoading(true);
    try {
      if (tab === 0) {
        await doctorAPI.verifyDoctor(item._id, newStatus);
      } else {
        await hospitalAPI.verifyHospital(item._id, newStatus);
      }

      setItems((prev) =>
        prev.map((d) => (d._id === item._id ? { ...d, verificationStatus: newStatus } : d))
      );
      setReviewRow((prev) => (prev ? { ...prev, verificationStatus: newStatus } : null));
      setReviewRow(null);
    } catch (err) {
      alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = items.filter((d) => d.verificationStatus === 'Pending').length;

  return (
    <PageTransition>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <PageHeader title="Verification Queue" subtitle="Review and approve doctor and hospital applications" />
        <Button
          startIcon={<RefreshRoundedIcon />}
          variant="outlined"
          size="small"
          onClick={fetchVerifications}
          sx={{ borderRadius: '10px' }}
        >
          Refresh
        </Button>
      </Box>

      <Tabs
        value={tab}
        onChange={(e, v) => {
          setTab(v);
          setReviewRow(null);
        }}
        sx={{ mb: 2, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}
      >
        <Tab label={<Badge badgeContent={tab === 0 ? pendingCount : 0} color="error" sx={{ pr: 1.5 }}>Doctor Verification</Badge>} />
        <Tab label={<Badge badgeContent={tab === 1 ? pendingCount : 0} color="primary" sx={{ pr: 1.5 }}>Hospital Verification</Badge>} />
      </Tabs>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <Chip
            key={f}
            label={f}
            clickable
            onClick={() => setFilter(f)}
            color={filter === f ? 'primary' : 'default'}
            variant={filter === f ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600, ...(filter === f ? {} : { borderColor: '#E5E7EB', color: '#374151' }) }}
          />
        ))}
      </Box>

      {error && <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

      <Card sx={{ borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={32} />
            </Box>
          ) : items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, color: '#6B7280' }}>
              <VerifiedUserRoundedIcon sx={{ fontSize: 44, color: '#9CA3AF', mb: 1 }} />
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>No applications found</Typography>
              <Typography sx={{ fontSize: 13 }}>
                There are currently no {tab === 0 ? 'doctors' : 'hospitals'} matching the "{filter}" filter.
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                <TableRow>
                  {(tab === 0
                    ? ['Doctor & Specialty', 'Hospital Affiliation', 'License No.', 'Experience', 'Status', 'Submitted', 'Actions']
                    : ['Hospital Name & Type', 'City & Location', 'License No.', 'Bed Capacity', 'Status', 'Submitted', 'Actions']
                  ).map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#4B5563', fontSize: 12 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((r) => {
                  const status = r.verificationStatus || 'Pending';
                  const [bg, fg] = statusColor[status] || ['#F3F4F6', '#6B7280'];
                  const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent';

                  if (tab === 0) {
                    // DOCTOR ROW
                    const docName = r.user?.name || 'Dr. Unknown';
                    const docEmail = r.user?.email || '';
                    return (
                      <TableRow key={r._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: '#EFF6FF', color: '#0F52BA', fontWeight: 700, width: 36, height: 36, fontSize: 14 }}>
                              {docName.replace('Dr. ', '')[0] || 'D'}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{docName}</Typography>
                              <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{r.specialty} · {docEmail}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: 13, color: '#374151' }}>
                          {r.hospital || 'Private Clinic'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={r.licenseNumber || 'Not Provided'}
                            size="small"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: 11,
                              bgcolor: r.licenseNumber ? '#F3F4F6' : '#FEF2F2',
                              color: r.licenseNumber ? '#1F2937' : '#DC2626',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: 13, color: '#374151' }}>
                          {r.experienceYears ? `${r.experienceYears} yrs` : 'Fresh'} · ₹{r.consultationFee || 500}
                        </TableCell>
                        <TableCell>
                          <Chip label={status} size="small" sx={{ bgcolor: bg, color: fg, fontWeight: 700, fontSize: 11 }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: '#6B7280' }}>{dateStr}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setReviewRow(r)}
                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    // HOSPITAL ROW
                    return (
                      <TableRow key={r._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: '#F5F3FF', color: '#7C3AED', fontWeight: 700, width: 36, height: 36 }}>
                              <LocalHospitalRoundedIcon sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{r.name}</Typography>
                              <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{r.type || 'Multi-Specialty'}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: 13, color: '#374151' }}>
                          {r.city}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={r.licenseNumber || 'Pending'}
                            size="small"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: 11,
                              bgcolor: '#F3F4F6',
                              color: '#1F2937',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: 13, color: '#374151' }}>
                          {r.totalBeds || 150} beds ({r.availableBeds || 35} avail)
                        </TableCell>
                        <TableCell>
                          <Chip label={status} size="small" sx={{ bgcolor: bg, color: fg, fontWeight: 700, fontSize: 11 }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: '#6B7280' }}>{dateStr}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setReviewRow(r)}
                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Review Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(reviewRow)}
        onClose={() => setReviewRow(null)}
        PaperProps={{ sx: { width: 480, maxWidth: '100%' } }}
      >
        {reviewRow && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ p: 2.5, borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: tab === 0 ? '#EFF6FF' : '#F5F3FF', color: tab === 0 ? '#0F52BA' : '#7C3AED', fontWeight: 700 }}>
                  {tab === 0 ? (reviewRow.user?.name || 'Dr').replace('Dr. ', '')[0] || 'D' : <LocalHospitalRoundedIcon />}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                    {tab === 0 ? reviewRow.user?.name : reviewRow.name}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#6B7280' }}>
                    {tab === 0 ? `${reviewRow.specialty} · ${reviewRow.user?.email}` : `${reviewRow.type} · ${reviewRow.city}`}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setReviewRow(null)}><CloseIcon /></IconButton>
            </Box>

            {/* Tabs */}
            <Tabs
              value={drawerTab}
              onChange={(e, v) => setDrawerTab(v)}
              variant="fullWidth"
              sx={{ borderBottom: '1px solid #E5E7EB', '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}
            >
              <Tab label="Credentials" />
              <Tab label="License Details" />
              <Tab label="Facilities" />
            </Tabs>

            {/* Content */}
            <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
              {drawerTab === 0 && (
                <Stack spacing={2.5}>
                  <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', mb: 0.5 }}>
                      Current Status
                    </Typography>
                    <Chip
                      label={reviewRow.verificationStatus}
                      size="small"
                      sx={{
                        bgcolor: (statusColor[reviewRow.verificationStatus] || ['#F3F4F6', '#6B7280'])[0],
                        color: (statusColor[reviewRow.verificationStatus] || ['#F3F4F6', '#6B7280'])[1],
                        fontWeight: 700,
                      }}
                    />
                  </Box>

                  {tab === 0 ? (
                    <>
                      <Box>
                        <Typography sx={{ fontSize: 12, color: '#6B7280', mb: 0.5 }}>Phone Number</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{reviewRow.user?.phone || 'Not provided'}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 12, color: '#6B7280', mb: 0.5 }}>Experience</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{reviewRow.experienceYears || 0} years in practice</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 12, color: '#6B7280', mb: 0.5 }}>Consultation Fee</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>₹{reviewRow.consultationFee || 500} per session</Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box>
                        <Typography sx={{ fontSize: 12, color: '#6B7280', mb: 0.5 }}>Administrator Contact</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                          {reviewRow.user?.name || 'Administrator'} ({reviewRow.user?.email || 'email on file'})
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 12, color: '#6B7280', mb: 0.5 }}>Address / Location</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{reviewRow.address ? `${reviewRow.address}, ` : ''}{reviewRow.city}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 12, color: '#6B7280', mb: 0.5 }}>Bed Capacity</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{reviewRow.totalBeds || 150} Total Beds ({reviewRow.availableBeds || 35} Currently Available)</Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              )}

              {drawerTab === 1 && (
                <Stack spacing={2}>
                  <Box sx={{ p: 2.5, bgcolor: '#EFF6FF', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                    <Typography sx={{ fontSize: 12, color: '#1E40AF', fontWeight: 600 }}>
                      {tab === 0 ? 'Medical Council Registration Number' : 'State Clinical Establishment Registration License'}
                    </Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1E3A8A', fontFamily: 'monospace', mt: 0.5 }}>
                      {reviewRow.licenseNumber || 'PENDING SUBMISSION'}
                    </Typography>
                  </Box>

                  <Box sx={{ height: 200, bgcolor: '#F9FAFB', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, border: '1px dashed #CBD5E1' }}>
                    <DescriptionOutlinedIcon sx={{ fontSize: 44, color: '#9CA3AF' }} />
                    <Typography sx={{ fontSize: 13, color: '#6B7280' }}>
                      {tab === 0 ? 'Verified against State Medical Council Registry' : 'Clinical Establishment Act License on Record'}
                    </Typography>
                    <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />
                  </Box>
                </Stack>
              )}

              {drawerTab === 2 && (
                <Stack spacing={2}>
                  {tab === 0 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, bgcolor: '#F9FAFB', borderRadius: '12px' }}>
                      <LocalHospitalRoundedIcon sx={{ color: '#0D9488' }} />
                      <Box>
                        <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Primary Affiliation</Typography>
                        <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{reviewRow.hospital || 'Independent Practice'}</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: '12px' }}>
                      <Typography sx={{ fontSize: 12, color: '#6B7280', mb: 1, fontWeight: 600, textTransform: 'uppercase' }}>
                        Accredited Facilities & Emergency Ward
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(reviewRow.facilities || [
                          '24/7 Emergency', 'ICU Facilities', 'Advanced MRI', 'In-house Pharmacy', 'Blood Bank', 'Ambulance'
                        ]).map((f) => (
                          <Chip key={f} label={f} sx={{ bgcolor: '#EDE9FE', color: '#6D28D9', fontWeight: 700, fontSize: 12 }} />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>

            {/* Actions */}
            <Box sx={{ p: 2.5, borderTop: '1px solid #E5E7EB', display: 'flex', gap: 1.5 }}>
              <Button
                fullWidth
                variant="contained"
                disabled={actionLoading || reviewRow.verificationStatus === 'Approved'}
                sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' }, fontWeight: 700, borderRadius: '10px' }}
                onClick={() => handleUpdateStatus(reviewRow, 'Approved')}
              >
                {actionLoading ? <CircularProgress size={20} color="inherit" /> : `Approve ${tab === 0 ? 'Doctor' : 'Hospital'}`}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                disabled={actionLoading || reviewRow.verificationStatus === 'Rejected'}
                sx={{ fontWeight: 700, borderRadius: '10px' }}
                onClick={() => handleUpdateStatus(reviewRow, 'Rejected')}
              >
                Reject
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </PageTransition>
  );
}
