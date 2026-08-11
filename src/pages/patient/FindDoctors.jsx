import { useState, useEffect, useMemo } from 'react';
import {
  Box, OutlinedInput, InputAdornment, Typography, Button, Chip, Grid, Card, CardContent,
  MenuItem, Select, FormControl,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import { motion } from 'framer-motion';
import PageTransition, { SectionReveal, containerVariants, itemVariants } from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import { DoctorGridCard } from '../../components/DoctorCard';
import { SkeletonLoader } from '../../components/PageTransition';
import useStore from '../../store/useStore';
import { tokens } from '../../theme/theme';

const cities = ['All Cities', 'Hyderabad', 'Mumbai', 'Delhi', 'Bangalore'];
const specialtyOptions = ['All Specialties', 'Neurology', 'Cardiology', 'General Physician', 'Psychiatry', 'Dermatology', 'Pediatrician'];
const feeRanges = ['All Fees', 'Under ₹500', '₹500–₹800', '₹800+'];
const genderOptions = ['All Genders', 'Male', 'Female'];

export default function FindDoctors() {
  const allDoctors = useStore((s) => s.doctors);
  const patient = useStore((s) => s.patient);
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All Specialties');
  const [city, setCity] = useState('All Cities');
  const [feeRange, setFeeRange] = useState('All Fees');
  const [gender, setGender] = useState('All Genders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    return allDoctors.filter((d) => {
      const q = query.toLowerCase();
      const matchesQuery = !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)
        || (d.subSpecialty || '').toLowerCase().includes(q) || (d.tags || []).some(t => t.toLowerCase().includes(q));
      const matchesSpecialty = specialty === 'All Specialties' || d.specialty === specialty;
      const matchesCity = city === 'All Cities' || (d.city || '').includes(city) || d.hospital.includes(city);
      const matchesGender = gender === 'All Genders' || (d.gender || '').toLowerCase() === gender.toLowerCase();
      let matchesFee = true;
      if (feeRange === 'Under ₹500') matchesFee = d.videoFee < 500;
      else if (feeRange === '₹500–₹800') matchesFee = d.videoFee >= 500 && d.videoFee <= 800;
      else if (feeRange === '₹800+') matchesFee = d.videoFee > 800;
      return matchesQuery && matchesSpecialty && matchesCity && matchesFee && matchesGender;
    });
  }, [allDoctors, query, specialty, city, feeRange, gender]);

  const availableCount = allDoctors.filter(d => d.availableToday).length;

  const selectSx = {
    bgcolor: 'transparent', fontWeight: 600, fontSize: 14, color: '#334155',
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiSelect-select': { p: 0 },
    '&:hover': { bgcolor: 'transparent' }
  };

  return (
    <PageTransition>
      <PageHeader
        title="Find a Doctor"
        subtitle="Search by name, specialty, or symptom. We'll find the right specialist for you."
        breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Find Doctors' }]}
      />

      <SectionReveal>
        {/* Search hero */}
        <Card sx={{ bgcolor: tokens.surface, borderRadius: 4, mb: 4 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 }, '&:last-child': { pb: 4 } }}>
            {/* Search input */}
            <OutlinedInput
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, specialty or symptom (e.g. headache, Dr. Arvind)..."
              startAdornment={
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: tokens.textTertiary, fontSize: 22 }} />
                </InputAdornment>
              }
              sx={{
                mb: 4, borderRadius: 3, bgcolor: tokens.surfaceMuted, fontSize: 16,
                '& fieldset': { borderColor: tokens.border },
                '&:hover fieldset': { borderColor: tokens.borderStrong },
                '&.Mui-focused fieldset': { borderColor: tokens.primary, borderWidth: 2 },
              }}
            />

          {/* Filter row */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <FormControl sx={{ minWidth: 160, flex: 1 }}>
              <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, mb: 0.75 }}>
                Specialty
              </Typography>
              <Select value={specialty} onChange={(e) => setSpecialty(e.target.value)} size="small" sx={selectSx}>
                {specialtyOptions.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 140, flex: 1 }}>
              <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, mb: 0.75 }}>
                City
              </Typography>
              <Select value={city} onChange={(e) => setCity(e.target.value)} size="small" sx={selectSx}>
                {cities.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120, flex: 1 }}>
              <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, mb: 0.75 }}>
                Gender
              </Typography>
              <Select value={gender} onChange={(e) => setGender(e.target.value)} size="small" sx={selectSx}>
                {genderOptions.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120, flex: 1 }}>
              <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, mb: 0.75 }}>
                Fee Range
              </Typography>
              <Select value={feeRange} onChange={(e) => setFeeRange(e.target.value)} size="small" sx={selectSx}>
                {feeRanges.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      </SectionReveal>

      {/* "Best for you" section header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, letterSpacing: '-0.02em', color: tokens.textPrimary }}>
            Best for you
          </Typography>
          <Chip label={results.length} size="small"
            sx={{ bgcolor: tokens.surfaceMuted, fontWeight: 800, fontSize: 13, height: 26, minWidth: 26, color: tokens.textSecondary }} />
        </Box>
        <Typography sx={{ fontSize: 13, color: tokens.textSecondary, fontWeight: 500 }}>
          {availableCount} available today
        </Typography>
      </Box>

      {loading ? (
        <Grid container spacing={2.5}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <SkeletonLoader rows={1} />
            </Grid>
          ))}
        </Grid>
      ) : results.length > 0 ? (
        <motion.div variants={containerVariants} initial="initial" animate="animate">
          <Grid container spacing={2.5}>
            {results.map((doctor) => (
              <Grid key={doctor.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <DoctorGridCard doctor={doctor} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PersonSearchRoundedIcon sx={{ fontSize: 56, color: tokens.textTertiary, mb: 2 }} />
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: tokens.textSecondary, mb: 1 }}>
            No doctors found
          </Typography>
          <Typography sx={{ fontSize: 14, color: tokens.textTertiary, mb: 3 }}>
            Try adjusting your search or filters to find what you're looking for
          </Typography>
          <Button variant="contained"
            onClick={() => { setQuery(''); setSpecialty('All Specialties'); setCity('All Cities'); setFeeRange('All Fees'); setGender('All Genders'); }}
            sx={{ px: 4, fontWeight: 700 }}>
            Clear Filters
          </Button>
        </Box>
      )}
    </PageTransition>
  );
}
