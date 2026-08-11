import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Avatar, IconButton, Select, MenuItem, Pagination, InputBase, Chip
} from '@mui/material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PageTransition from '../../components/PageTransition';

const mockPatients = Array(6).fill({
  name: 'Anna Brown',
  email: 'Annabrown40@gmail.com',
  doctor: 'Dr. Amilly Borands',
  condition: 'Frocture',
});

export default function DoctorPatients() {
  const [filter, setFilter] = useState('All Patients');

  return (
    <PageTransition>
      <Box sx={{ 
        bgcolor: '#5476FF', // The blue background from the image
        minHeight: '100vh',
        p: { xs: 2, md: 4 },
        m: { xs: -2, md: -4 }, // Negate layout padding if needed
        borderRadius: 4
      }}>
        
        {/* Main White Card Container */}
        <Box sx={{ 
          bgcolor: '#fff', 
          borderRadius: 4, 
          p: { xs: 3, md: 4 },
          minHeight: '80vh',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          
          {/* Header Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <GroupRoundedIcon sx={{ fontSize: 28, color: '#1E293B' }} />
              <Typography sx={{ fontWeight: 800, fontSize: 24, color: '#1E293B' }}>Patients</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ border: '1px solid #E2E8F0', p: 1 }}>
                <SearchRoundedIcon sx={{ color: '#64748B' }} />
              </IconButton>
              <IconButton sx={{ border: '1px solid #E2E8F0', p: 1 }}>
                <NotificationsNoneRoundedIcon sx={{ color: '#64748B' }} />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, border: '1px solid #E2E8F0', borderRadius: 100, py: 0.5, px: 0.5, pr: 2 }}>
                <Avatar src="https://i.pravatar.cc/150?img=5" sx={{ width: 36, height: 36 }} />
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>Dr. Jane Amine</Typography>
                  <Typography sx={{ fontSize: 11, color: '#64748B' }}>Neurologist</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Sub Header / Filters */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
              60 Patients Total
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                <MenuItem value="New Patients">New Patients</MenuItem>
              </Select>

              <Button 
                variant="contained" 
                startIcon={<AddRoundedIcon />}
                sx={{ 
                  bgcolor: '#4338CA', 
                  color: '#fff', 
                  borderRadius: 100, 
                  px: 3, 
                  py: 1, 
                  textTransform: 'none', 
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#3730A3', boxShadow: 'none' }
                }}
              >
                Add new patients
              </Button>
            </Box>
          </Box>

          {/* Table Container */}
          <Box sx={{ border: '1px solid #F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fff' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14, borderBottom: '1px solid #F1F5F9', py: 2.5 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14, borderBottom: '1px solid #F1F5F9', py: 2.5 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14, borderBottom: '1px solid #F1F5F9', py: 2.5 }}>Doctor Assigned</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14, borderBottom: '1px solid #F1F5F9', py: 2.5 }}>Conditions</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14, borderBottom: '1px solid #F1F5F9', py: 2.5 }}>Next Appointment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockPatients.map((p, index) => (
                  <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell sx={{ borderBottom: '1px solid #F8FAFC', py: 2.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1E293B' }}>{p.name}</Typography>
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
                      <Button
                        sx={{ 
                          bgcolor: '#DCFCE7', 
                          color: '#16A34A', 
                          fontWeight: 700, 
                          fontSize: 12,
                          textTransform: 'none',
                          borderRadius: 100,
                          px: 2,
                          py: 0.5,
                          '&:hover': { bgcolor: '#BBF7D0' }
                        }}
                      >
                        Schedule Appointment
                      </Button>
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
    </PageTransition>
  );
}
