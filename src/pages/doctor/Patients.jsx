import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Avatar, IconButton, Select, MenuItem, Pagination, InputBase, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert,
} from '@mui/material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import PageTransition from '../../components/PageTransition';
import { doctorAPI } from '../../services/api';

const mockPatients = [
  { name: 'Meera Sharma', email: 'meera@example.com', doctor: 'Dr. Arvind Rao', condition: 'Migraine with aura' },
  { name: 'Rohan Sharma', email: 'rohan.sharma@example.com', doctor: 'Dr. Arvind Rao', condition: 'Hypertension Checkup' },
  { name: 'Aanya Iyer', email: 'aanya.iyer@example.com', doctor: 'Dr. Arvind Rao', condition: 'Anxiety Assessment' },
];

export default function DoctorPatients() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All Patients');
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState(mockPatients);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', email: '', condition: 'General Consultation' });
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    setLoading(true);
    doctorAPI.getMyPatients()
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPatients(data);
        }
      })
      .catch((err) => console.warn('Could not load real patients, showing defaults:', err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredPatients = patients.filter((p) => {
    if (!search.trim()) return true;
    return (
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.condition?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <PageTransition>
      <Box sx={{ 
        bgcolor: '#5476FF', // The blue background from the image
        minHeight: '100vh',
        p: { xs: 1.5, sm: 2, md: 4 },
        m: { xs: -1.5, sm: -2, md: -4 }, // Negate layout padding if needed
        borderRadius: 4
      }}>
        
        {/* Main White Card Container */}
        <Box sx={{ 
          bgcolor: '#fff', 
          borderRadius: 4, 
          p: { xs: 2, sm: 3, md: 4 },
          minHeight: '80vh',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          
          {/* Header Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <GroupRoundedIcon sx={{ fontSize: 28, color: '#1E293B' }} />
              <Typography sx={{ fontWeight: 800, fontSize: 24, color: '#1E293B' }}>Patients</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <IconButton onClick={() => document.getElementById('patient-search-input')?.focus()} sx={{ border: '1px solid #E2E8F0', p: 1 }}>
                <SearchRoundedIcon sx={{ color: '#64748B' }} />
              </IconButton>
              <IconButton onClick={() => navigate('/doctor/chat')} sx={{ border: '1px solid #E2E8F0', p: 1 }}>
                <NotificationsNoneRoundedIcon sx={{ color: '#64748B' }} />
              </IconButton>
              <Box onClick={() => navigate('/doctor/profile')} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, border: '1px solid #E2E8F0', borderRadius: 100, py: 0.5, px: 0.5, pr: 2, cursor: 'pointer', '&:hover': { bgcolor: '#F8FAFC' } }}>
                <Avatar src="https://i.pravatar.cc/150?img=5" sx={{ width: 36, height: 36 }} />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>Dr. Jane Amine</Typography>
                  <Typography sx={{ fontSize: 11, color: '#64748B' }}>Neurologist</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Sub Header / Filters */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
              {filteredPatients.length} Patients Total
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
              <InputBase
                id="patient-search-input"
                placeholder="Search patient or diagnosis..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  bgcolor: '#F8FAFC',
                  borderRadius: 100,
                  px: 2,
                  py: 0.5,
                  fontSize: 13,
                  border: '1px solid #E2E8F0',
                  flex: { xs: 1, sm: 'none' },
                  minWidth: { xs: '140px', sm: 220 },
                }}
              />
              <Select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                size="small"
                sx={{ 
                  bgcolor: '#F8FAFC', 
                  borderRadius: 100, 
                  fontSize: 14, 
                  fontWeight: 600, 
                  color: '#475569',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                }}
              >
                <MenuItem value="All Patients">All Patients</MenuItem>
              </Select>

              <Button 
                variant="contained" 
                startIcon={<AddRoundedIcon />}
                onClick={() => setAddOpen(true)}
                sx={{ 
                  bgcolor: '#4338CA', 
                  color: '#fff', 
                  borderRadius: 100, 
                  px: { xs: 2, sm: 3 }, 
                  py: 1, 
                  textTransform: 'none', 
                  fontWeight: 600,
                  boxShadow: 'none',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': { bgcolor: '#3730A3', boxShadow: 'none' }
                }}
              >
                Add new patients
              </Button>
            </Box>
          </Box>

          {/* Table Container */}
          <Box sx={{ border: '1px solid #F1F5F9', borderRadius: 3, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fff' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14, borderBottom: '1px solid #F1F5F9', py: 2.5 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14, borderBottom: '1px solid #F1F5F9', py: 2.5 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14, borderBottom: '1px solid #F1F5F9', py: 2.5 }}>Doctor Assigned</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14, borderBottom: '1px solid #F1F5F9', py: 2.5 }}>Conditions</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14, borderBottom: '1px solid #F1F5F9', py: 2.5 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14, borderBottom: '1px solid #F1F5F9', py: 2.5, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((p, index) => (
                  <TableRow key={p.id || index} sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell sx={{ borderBottom: '1px solid #F8FAFC', py: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#4338CA', width: 32, height: 32, fontSize: 13, fontWeight: 700 }}>
                          {p.name?.[0] || 'P'}
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1E293B' }}>{p.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F8FAFC', py: 2.5 }}>
                      <Typography sx={{ fontWeight: 500, fontSize: 14, color: '#1E293B' }}>{p.email}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F8FAFC', py: 2.5 }}>
                      <Typography sx={{ fontWeight: 500, fontSize: 14, color: '#475569' }}>{p.doctor}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F8FAFC', py: 2.5 }}>
                      <Typography sx={{ fontWeight: 500, fontSize: 14, color: '#475569' }}>{p.condition}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F8FAFC', py: 2.5 }}>
                      <Chip
                        label="Active Patient"
                        size="small"
                        sx={{ 
                          bgcolor: '#DCFCE7', 
                          color: '#16A34A', 
                          fontWeight: 700, 
                          fontSize: 12,
                          borderRadius: 100,
                          px: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F8FAFC', py: 2.5, textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<VideocamRoundedIcon sx={{ fontSize: 16 }} />}
                          onClick={() => {
                            const targetRoom = (p.name?.includes('Meera') || p.id === 'p1') ? 'a001' : `room_${p.id || p._id || index}`;
                            navigate(`/doctor/consult/${targetRoom}`, {
                              state: { patientName: p.name, patientId: p.id || p._id },
                            });
                          }}
                          sx={{
                            borderRadius: 100,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: 12,
                            bgcolor: '#4338CA',
                            '&:hover': { bgcolor: '#3730A3' },
                          }}
                        >
                          Start Call
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 15 }} />}
                          onClick={() => navigate('/doctor/chat')}
                          sx={{
                            borderRadius: 100,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: 12,
                            borderColor: '#CBD5E1',
                            color: '#334155',
                            '&:hover': { borderColor: '#4338CA', color: '#4338CA', bgcolor: '#EEF2FF' }
                          }}
                        >
                          Message
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Pagination */}
          <Box sx={{ display: 'flex', mt: 4 }}>
            <Pagination 
              count={5} 
              shape="rounded" 
              sx={{ 
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#64748B',
                  border: '1px solid #E2E8F0',
                  borderRadius: 2,
                  bgcolor: '#fff',
                  width: 36,
                  height: 36,
                  '&.Mui-selected': {
                    bgcolor: '#4338CA',
                    color: '#fff',
                    borderColor: '#4338CA',
                    '&:hover': { bgcolor: '#3730A3' }
                  }
                }
              }} 
            />
          </Box>

        </Box>
      </Box>

      {/* Add Patient Dialog */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Add New Patient</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            fullWidth
            required
            label="Patient Name"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            placeholder="e.g. Ramesh Patel"
          />
          <TextField
            fullWidth
            required
            type="email"
            label="Email Address"
            value={newPatient.email}
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
            placeholder="ramesh@example.com"
          />
          <TextField
            fullWidth
            label="Primary Condition / Reason"
            value={newPatient.condition}
            onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
            placeholder="e.g. Chronic Migraine, Hypertension"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!newPatient.name.trim() || !newPatient.email.trim()) return;
              setPatients((prev) => [
                {
                  id: 'p-' + Date.now(),
                  name: newPatient.name.trim(),
                  email: newPatient.email.trim(),
                  doctor: 'Dr. Arvind Rao',
                  condition: newPatient.condition.trim() || 'General Consultation',
                },
                ...prev,
              ]);
              setAddOpen(false);
              setSnackbar(`Patient ${newPatient.name} added to your clinical roster.`);
              setNewPatient({ name: '', email: '', condition: 'General Consultation' });
            }}
            sx={{ borderRadius: '100px', bgcolor: '#4338CA', '&:hover': { bgcolor: '#3730A3' } }}
          >
            Add Patient
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar('')}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </PageTransition>
  );
}
