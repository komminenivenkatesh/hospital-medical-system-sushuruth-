import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, Chip, Button, Grid, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, FormControlLabel, Switch, IconButton,
  CircularProgress,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import { tokens } from '../../theme/theme';
import { familyAPI } from '../../services/api';

const defaultFamilyMembers = [
  { id: '1', name: 'Meera Sharma', relation: 'Self', age: 34, initials: 'MS', primary: true, bloodGroup: 'O+' },
  { id: '2', name: 'Rohan Sharma', relation: 'Spouse', age: 37, initials: 'RS', primary: false, bloodGroup: 'B+' },
  { id: '3', name: 'Aarav Sharma', relation: 'Child', age: 8, initials: 'AS', primary: false, bloodGroup: 'O+' },
  { id: '4', name: 'Sunita Sharma', relation: 'Parent', age: 62, initials: 'SS', primary: false, bloodGroup: 'A+' },
];

export default function Family() {
  const navigate = useNavigate();
  const [members, setMembers] = useState(defaultFamilyMembers);
  const [loading, setLoading] = useState(false);

  // Dialog State
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Child');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = () => {
    setLoading(true);
    familyAPI.getAll()
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map((m) => ({
            id: m._id,
            name: m.name,
            relation: m.relation,
            age: m.age,
            initials: m.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
            primary: m.primary,
            bloodGroup: m.bloodGroup || 'O+',
            allergies: m.allergies || [],
            conditions: m.conditions || [],
          }));
          setMembers(mapped);
        }
      })
      .catch((err) => console.warn('Could not fetch real family members, using defaults:', err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async () => {
    if (!name.trim() || !age) return;
    setSubmitting(true);
    try {
      await familyAPI.add({
        name: name.trim(),
        relation,
        age: Number(age),
        gender,
        bloodGroup,
        allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
        conditions: conditions.split(',').map((s) => s.trim()).filter(Boolean),
        primary: isPrimary,
      });
      setAddOpen(false);
      setName('');
      setAge('');
      setAllergies('');
      setConditions('');
      setIsPrimary(false);
      fetchMembers();
    } catch (err) {
      console.warn('Error adding family member:', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to remove this family member?')) return;
    try {
      await familyAPI.delete(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.warn('Error deleting member:', err.message);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <PageTransition>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, letterSpacing: '-0.02em' }}>
          My Family
        </Typography>
        <Typography sx={{ fontSize: 14, color: tokens.textSecondary }}>
          Manage health profiles, prescriptions, and appointments for everyone you care about
        </Typography>
      </Box>

      {/* Stats strip — filled */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22` }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: 28, color: tokens.primary }}>
                {members.length}
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: tokens.primary }}>Members</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ bgcolor: tokens.successSoft, border: `1px solid ${tokens.success}22` }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: 28, color: tokens.success }}>
                {members.filter((m) => m.primary).length}
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: tokens.success }}>Primary</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ bgcolor: tokens.surfaceMuted }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: 28, color: tokens.textPrimary }}>2</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: tokens.textSecondary }}>Active Family Plans</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Members Grid */}
      {loading ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {members.map((m) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={m.id}>
              <Card
                sx={{
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  position: 'relative',
                  '&:hover': { borderColor: tokens.primary, boxShadow: tokens.cardShadowHover },
                }}
              >
                <Box sx={{ height: 4, bgcolor: m.primary ? tokens.primary : tokens.border }} />

                {/* Delete button (except primary self) */}
                {!m.primary && (
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteMember(m.id)}
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      color: tokens.textTertiary,
                      '&:hover': { color: '#EF4444' },
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}

                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      bgcolor: tokens.primarySoft,
                      color: tokens.primary,
                      fontWeight: 800,
                      fontSize: 22,
                      mb: 1.5,
                    }}
                  >
                    {m.initials}
                  </Avatar>
                  <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 0.5 }}>{m.name}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${m.relation} · ${m.age} yrs`}
                      size="small"
                      sx={{ bgcolor: tokens.surfaceMuted, color: tokens.textSecondary, fontWeight: 600, fontSize: 11 }}
                    />
                    <Chip
                      label={m.bloodGroup}
                      size="small"
                      sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700, fontSize: 11 }}
                    />
                    {m.primary && (
                      <Chip
                        label="Primary"
                        size="small"
                        sx={{ bgcolor: tokens.primarySoft, color: tokens.primary, fontWeight: 700, fontSize: 11 }}
                      />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/health')}
                      sx={{ fontWeight: 700, fontSize: 12, borderRadius: 100 }}
                    >
                      View Health
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      onClick={() => navigate('/find-doctors')}
                      sx={{ fontWeight: 700, fontSize: 12, borderRadius: 100 }}
                    >
                      Book Visit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setAddOpen(true)}
          sx={{ fontWeight: 700, px: 3, borderRadius: 100 }}
        >
          Add Family Member
        </Button>
      </Box>

      {/* Family Doctor — filled card */}
      <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22`, overflow: 'hidden', borderRadius: 3 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: tokens.primary, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1.5 }}>
            Your Family Doctor
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: tokens.primary, color: '#fff', fontWeight: 700, fontSize: 18 }}>PM</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Dr. Priya Mehta</Typography>
              <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>General Physician & Cardiologist · Fortis Hospital</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <StarRoundedIcon sx={{ fontSize: 14, color: tokens.warning }} />
                <Typography sx={{ fontSize: 12, color: tokens.textSecondary, fontWeight: 600 }}>4.9 (342 reviews) · ₹500/consultation</Typography>
              </Box>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2.5, fontWeight: 700, borderRadius: 100 }}
            onClick={() => navigate('/booking/d002')}
          >
            Book Family Appointment
          </Button>
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Family Member</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Relation</InputLabel>
                <Select value={relation} label="Relation" onChange={(e) => setRelation(e.target.value)}>
                  <MenuItem value="Spouse">Spouse</MenuItem>
                  <MenuItem value="Child">Child</MenuItem>
                  <MenuItem value="Parent">Parent</MenuItem>
                  <MenuItem value="Sibling">Sibling</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select value={gender} label="Gender" onChange={(e) => setGender(e.target.value)}>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Select value={bloodGroup} label="Blood Group" onChange={(e) => setBloodGroup(e.target.value)}>
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                    <MenuItem key={bg} value={bg}>{bg}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            label="Known Allergies (comma-separated)"
            placeholder="e.g. Penicillin, Peanuts"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            fullWidth
          />
          <TextField
            label="Existing Conditions (comma-separated)"
            placeholder="e.g. Asthma, Hypertension"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={<Switch checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} />}
            label="Set as Primary Account Contact"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddMember}
            disabled={submitting || !name || !age}
            sx={{ fontWeight: 700, borderRadius: 100, px: 3 }}
          >
            {submitting ? 'Saving...' : 'Add Member'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageTransition>
  );
}
