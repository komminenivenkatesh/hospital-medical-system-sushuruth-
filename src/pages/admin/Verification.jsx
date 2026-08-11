import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Tabs, Tab, Chip, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Drawer, IconButton, Badge, Avatar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';

const filters = ['All', 'Pending', 'Under Review', 'Docs Requested', 'Approved', 'Rejected'];
const rows = [
  { id: 1, name: 'Dr. Sanjay Verma', specialty: 'Orthopedics', submitted: 'Dec 14', mci: 'Valid', status: 'Pending', assigned: 'Priya (Ops)' },
  { id: 2, name: 'Dr. Lakshmi Nair', specialty: 'Pediatrics', submitted: 'Dec 13', mci: 'Valid', status: 'Under Review', assigned: 'Karan (Ops)' },
  { id: 3, name: 'Dr. Imran Q.', specialty: 'Cardiology', submitted: 'Dec 12', mci: 'Pending', status: 'Docs Requested', assigned: 'Priya (Ops)' },
];
const statusColor = { Pending: ['#FFFBEB', '#B45309'], 'Under Review': ['#EFF6FF', '#2563EB'], 'Docs Requested': ['#FFF1F2', '#EF4444'], Approved: ['#F0FDF4', '#15803D'] };

export default function Verification() {
  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState('All');
  const [reviewRow, setReviewRow] = useState(null);
  const [drawerTab, setDrawerTab] = useState(0);

  return (
    <PageTransition>
      <PageHeader title="Verification Queue" subtitle="Review and approve doctor and hospital applications" />
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}>
        <Tab label={<Badge badgeContent={23} color="primary" sx={{ pr: 1.5 }}>Doctor Verification</Badge>} />
        <Tab label={<Badge badgeContent={7} color="primary" sx={{ pr: 1.5 }}>Hospital Verification</Badge>} />
      </Tabs>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <Chip key={f} label={f} clickable onClick={() => setFilter(f)}
            color={filter === f ? 'primary' : 'default'} variant={filter === f ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600, ...(filter === f ? {} : { borderColor: '#E5E7EB', color: '#374151' }) }} />
        ))}
      </Box>

      <Card><CardContent sx={{ p: 0 }}>
        <Table>
          <TableHead><TableRow>
            {['Name + specialty', 'Submitted', 'Documents', 'MCI Status', 'Status', 'Assigned to', 'Actions'].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 700, color: '#6B7280', fontSize: 12 }}>{h}</TableCell>
            ))}
          </TableRow></TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{r.name}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{r.specialty}</Typography>
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>{r.submitted}</TableCell>
                <TableCell>
                  {[1, 2, 3].map((d) => <CheckCircleIcon key={d} sx={{ fontSize: 16, color: '#10B981', mr: 0.25 }} />)}
                </TableCell>
                <TableCell><Chip label={r.mci} size="small" sx={{ bgcolor: r.mci === 'Valid' ? '#F0FDF4' : '#FFFBEB', color: r.mci === 'Valid' ? '#15803D' : '#B45309' }} /></TableCell>
                <TableCell><Chip label={r.status} size="small" sx={{ bgcolor: (statusColor[r.status] || ['#F3F4F6', '#6B7280'])[0], color: (statusColor[r.status] || ['#F3F4F6', '#6B7280'])[1], fontWeight: 700 }} /></TableCell>
                <TableCell sx={{ fontSize: 13, color: '#6B7280' }}>{r.assigned}</TableCell>
                <TableCell><Button size="small" variant="outlined" onClick={() => setReviewRow(r)}>Review</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Drawer anchor="right" open={Boolean(reviewRow)} onClose={() => setReviewRow(null)}
        PaperProps={{ sx: { width: 480, maxWidth: '100%' } }}>
        {reviewRow && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#EFF6FF', color: 'primary.main', fontWeight: 700 }}>{reviewRow.name.split(' ')[1][0]}</Avatar>
                <Box><Typography sx={{ fontWeight: 700 }}>{reviewRow.name}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{reviewRow.specialty}</Typography></Box>
              </Box>
              <IconButton onClick={() => setReviewRow(null)}><CloseIcon /></IconButton>
            </Box>
            <Tabs value={drawerTab} onChange={(e, v) => setDrawerTab(v)} variant="fullWidth"
              sx={{ borderBottom: '1px solid #E5E7EB', '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}>
              <Tab label="Degree" /><Tab label="Registration" /><Tab label="Government ID" />
            </Tabs>
            <Box sx={{ flex: 1, p: 3 }}>
              <Box sx={{ height: 320, bgcolor: '#F9FAFB', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, border: '1px solid #E5E7EB' }}>
                <DescriptionOutlinedIcon sx={{ fontSize: 48, color: '#9CA3AF' }} />
                <Typography sx={{ fontSize: 13, color: '#9CA3AF' }}>Document preview</Typography>
              </Box>
            </Box>
            <Box sx={{ p: 2.5, borderTop: '1px solid #E5E7EB', display: 'flex', gap: 1 }}>
              <Button fullWidth variant="contained" sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }} onClick={() => setReviewRow(null)}>Approve</Button>
              <Button fullWidth variant="outlined" sx={{ color: '#B45309', borderColor: '#F59E0B' }}>Request Docs</Button>
              <Button fullWidth variant="outlined" color="error" onClick={() => setReviewRow(null)}>Reject</Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </PageTransition>
  );
}
