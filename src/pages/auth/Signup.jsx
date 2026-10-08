import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Avatar, Chip, CircularProgress,
  Alert, MenuItem, Select, FormControl, InputLabel, Grid, Paper,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

const medicalSpecialties = [
  'Neurology',
  'Cardiology',
  'General Physician',
  'Psychiatry',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Gynecology & Obstetrics',
  'Oncology',
  'Ophthalmology',
  'ENT (Otolaryngology)',
  'Radiology',
  'Pulmonology',
  'Endocrinology',
  'Gastroenterology',
];

const hospitalTypes = [
  'Multi-Specialty Hospital',
  'Super-Specialty Hospital',
  'Academic Medical Centre',
  'Diagnostic & Imaging Centre',
  'Children & Pediatric Hospital',
  'Cardiology Institute',
  'Neurological Research Centre',
];

const features = [
  'Instant AI-powered scan and report diagnosis',
  'Direct teleconsultations with top specialists',
  'End-to-end encrypted medical record vault',
  'Accredited hospitals & emergency ward networking',
];

export default function Signup() {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();

  const [role, setRole] = useState('patient'); // 'patient' | 'doctor' | 'hospital'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Doctor
    specialty: 'Neurology',
    experienceYears: '',
    consultationFee: '',
    licenseNumber: '',
    hospital: '',
    // Hospital
    hospitalName: '',
    hospitalType: 'Multi-Specialty Hospital',
    city: '',
    address: '',
    totalBeds: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === 'doctor') navigate('/doctor/dashboard', { replace: true });
      else if (user.role === 'hospital') navigate('/hospital/dashboard', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Common Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Role-specific validation
    if (role === 'doctor') {
      if (!formData.licenseNumber.trim()) {
        setError('Medical License / Registration Number is required for doctor verification.');
        return;
      }
      if (!formData.hospital.trim()) {
        setError('Please enter your clinic or hospital affiliation.');
        return;
      }
    } else if (role === 'hospital') {
      if (!formData.hospitalName.trim()) {
        setError('Hospital or clinic facility name is required.');
        return;
      }
      if (!formData.licenseNumber.trim()) {
        setError('Clinical Establishment License Number is required for institutional verification.');
        return;
      }
      if (!formData.city.trim()) {
        setError('City & location is required for hospital verification.');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        name: role === 'doctor' && !formData.name.startsWith('Dr.') ? `Dr. ${formData.name.trim()}` : formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        role,
      };

      if (role === 'doctor') {
        payload.specialty = formData.specialty;
        payload.experienceYears = Number(formData.experienceYears) || 0;
        payload.consultationFee = Number(formData.consultationFee) || 500;
        payload.licenseNumber = formData.licenseNumber.trim();
        payload.hospital = formData.hospital.trim();
      } else if (role === 'hospital') {
        payload.hospitalName = formData.hospitalName.trim();
        payload.hospitalType = formData.hospitalType;
        payload.licenseNumber = formData.licenseNumber.trim();
        payload.city = formData.city.trim();
        payload.address = formData.address.trim();
        payload.totalBeds = Number(formData.totalBeds) || 150;
      }

      await register(payload);

      if (role === 'doctor') {
        setSuccessMessage('Doctor credentials submitted for verification! Redirecting to doctor portal...');
        setTimeout(() => navigate('/doctor/dashboard', { replace: true }), 1500);
      } else if (role === 'hospital') {
        setSuccessMessage('Hospital institutional credentials submitted! Redirecting to facility portal...');
        setTimeout(() => navigate('/hospital/dashboard', { replace: true }), 1500);
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#F5F7FB',
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      {/* LEFT — Brand Story Panel */}
      <Box
        sx={{
          flex: '0 0 45%',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(145deg, #0F52BA 0%, #0A3D8F 40%, #0D2E6E 100%)',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', bottom: -100, left: -60, width: 350, height: 350, borderRadius: '50%', background: 'rgba(13,148,136,0.15)' }} />

        {/* Top: Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Logo size={36} light showWordmark wordmarkSize={20} />
        </motion.div>

        {/* Middle: Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <Chip
              label="Join Sushruth Healthcare Network"
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.04em',
                mb: 3,
                backdropFilter: 'blur(8px)',
              }}
            />
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 'clamp(2rem, 3vw, 2.6rem)',
                color: '#fff',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Start your journey to
              <Box component="span" sx={{ color: '#5EEAD4', display: 'block' }}>
                smarter medical care.
              </Box>
            </Typography>
            <Typography sx={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, mb: 4, maxWidth: 420 }}>
              Whether you are seeking consultations, managing a practice, or operating an accredited medical institution, Sushruth unites healthcare with AI.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleRoundedIcon sx={{ color: '#5EEAD4', fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{f}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Bottom Security Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.7 }}>
          <LockOutlinedIcon sx={{ fontSize: 14, color: '#fff' }} />
          <Typography sx={{ fontSize: 12, color: '#fff' }}>
            HIPAA-compliant infrastructure & ISO 27001 medical data protection
          </Typography>
        </Box>
      </Box>

      {/* RIGHT — Sign Up Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2.5, sm: 4, md: 6 },
          overflowY: 'auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 560 }}
        >
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'center', mb: 3 }}>
            <Logo size={32} showWordmark wordmarkSize={18} />
          </Box>

          <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, letterSpacing: '-0.025em', color: '#111827', mb: 0.5 }}>
            Create an Account
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#6B7280', mb: 3 }}>
            Select your role to register on Sushruth
          </Typography>

          {/* 3-Role Selector Tabs */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 1,
              mb: 3,
              p: 0.5,
              bgcolor: '#E5E7EB',
              borderRadius: '14px',
            }}
          >
            <Box
              onClick={() => setRole('patient')}
              sx={{
                py: 1.25,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                cursor: 'pointer',
                borderRadius: '11px',
                bgcolor: role === 'patient' ? '#fff' : 'transparent',
                boxShadow: role === 'patient' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 200ms ease',
              }}
            >
              <PersonRoundedIcon sx={{ fontSize: 18, color: role === 'patient' ? '#0F52BA' : '#6B7280' }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: role === 'patient' ? '#0F52BA' : '#4B5563' }}>
                Patient
              </Typography>
            </Box>

            <Box
              onClick={() => setRole('doctor')}
              sx={{
                py: 1.25,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                cursor: 'pointer',
                borderRadius: '11px',
                bgcolor: role === 'doctor' ? '#fff' : 'transparent',
                boxShadow: role === 'doctor' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 200ms ease',
              }}
            >
              <MedicalServicesRoundedIcon sx={{ fontSize: 18, color: role === 'doctor' ? '#0D9488' : '#6B7280' }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: role === 'doctor' ? '#0D9488' : '#4B5563' }}>
                Doctor
              </Typography>
            </Box>

            <Box
              onClick={() => setRole('hospital')}
              sx={{
                py: 1.25,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                cursor: 'pointer',
                borderRadius: '11px',
                bgcolor: role === 'hospital' ? '#fff' : 'transparent',
                boxShadow: role === 'hospital' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 200ms ease',
              }}
            >
              <LocalHospitalRoundedIcon sx={{ fontSize: 18, color: role === 'hospital' ? '#7C3AED' : '#6B7280' }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: role === 'hospital' ? '#7C3AED' : '#4B5563' }}>
                Hospital
              </Typography>
            </Box>
          </Box>

          {/* Verification Notice Banners */}
          {role === 'doctor' && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                bgcolor: '#F0FDFA',
                border: '1px solid #99F6E4',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              <VerifiedUserOutlinedIcon sx={{ color: '#0D9488', fontSize: 20, mt: 0.2 }} />
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#115E59' }}>
                  Medical License Verification Notice
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#134E4A', lineHeight: 1.4 }}>
                  Doctor applications are automatically reviewed by the platform administrator before going live in the patient search directory.
                </Typography>
              </Box>
            </Paper>
          )}

          {role === 'hospital' && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                bgcolor: '#F5F3FF',
                border: '1px solid #DDD6FE',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              <LocalHospitalRoundedIcon sx={{ color: '#7C3AED', fontSize: 20, mt: 0.2 }} />
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#5B21B6' }}>
                  Institutional Clinical Establishment Review
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6D28D9', lineHeight: 1.4 }}>
                  Hospital and clinic profiles are verified against clinical establishment records before appearing in the public directory.
                </Typography>
              </Box>
            </Paper>
          )}

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setError('')}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>{successMessage}</Alert>}

          <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label={role === 'doctor' ? 'Doctor Name' : role === 'hospital' ? 'Administrator Name' : 'Full Name'}
                  placeholder={role === 'doctor' ? 'e.g. Ramesh Kumar' : role === 'hospital' ? 'e.g. Dr. S. K. Sharma (Medical Director)' : 'e.g. Meera Sharma'}
                  value={formData.name}
                  onChange={handleChange('name')}
                  InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Official Phone Number"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label={role === 'hospital' ? 'Official Hospital Email' : 'Email Address'}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange('email')}
                  InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="password"
                  label="Password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange('password')}
                  InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="password"
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                />
              </Grid>

              {/* Doctor Specific Fields */}
              {role === 'doctor' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="specialty-label">Specialty</InputLabel>
                      <Select
                        labelId="specialty-label"
                        label="Specialty"
                        value={formData.specialty}
                        onChange={handleChange('specialty')}
                        sx={{ borderRadius: '12px', bgcolor: '#fff' }}
                      >
                        {medicalSpecialties.map((s) => (
                          <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Experience (Years)"
                      placeholder="e.g. 8"
                      value={formData.experienceYears}
                      onChange={handleChange('experienceYears')}
                      InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Consultation Fee (₹)"
                      placeholder="e.g. 500"
                      value={formData.consultationFee}
                      onChange={handleChange('consultationFee')}
                      InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Medical Registration / License No."
                      placeholder="e.g. MCI-2018-9842"
                      value={formData.licenseNumber}
                      onChange={handleChange('licenseNumber')}
                      InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Hospital / Clinic Affiliation"
                      placeholder="e.g. Apollo Hospital, Hyderabad or Private Practice"
                      value={formData.hospital}
                      onChange={handleChange('hospital')}
                      InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                    />
                  </Grid>
                </>
              )}

              {/* Hospital Specific Fields */}
              {role === 'hospital' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Hospital / Facility Name"
                      placeholder="e.g. Care Super Specialty Hospital"
                      value={formData.hospitalName}
                      onChange={handleChange('hospitalName')}
                      InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="hospital-type-label">Facility Classification</InputLabel>
                      <Select
                        labelId="hospital-type-label"
                        label="Facility Classification"
                        value={formData.hospitalType}
                        onChange={handleChange('hospitalType')}
                        sx={{ borderRadius: '12px', bgcolor: '#fff' }}
                      >
                        {hospitalTypes.map((t) => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Clinical Establishment License No."
                      placeholder="e.g. CEA-TS-2023-4412"
                      value={formData.licenseNumber}
                      onChange={handleChange('licenseNumber')}
                      InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Total Bed Capacity"
                      placeholder="e.g. 250"
                      value={formData.totalBeds}
                      onChange={handleChange('totalBeds')}
                      InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="City & State"
                      placeholder="e.g. Hyderabad, Telangana"
                      value={formData.city}
                      onChange={handleChange('city')}
                      InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Street Address / Area"
                      placeholder="e.g. Road No 1, Banjara Hills"
                      value={formData.address}
                      onChange={handleChange('address')}
                      InputProps={{ sx: { borderRadius: '12px', bgcolor: '#fff' } }}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.75,
                fontSize: 15,
                fontWeight: 700,
                borderRadius: '12px',
                background: role === 'doctor'
                  ? 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)'
                  : role === 'hospital'
                  ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                  : 'linear-gradient(135deg, #0F52BA 0%, #0A3D8F 100%)',
                boxShadow: role === 'doctor'
                  ? '0 4px 16px rgba(13,148,136,0.35)'
                  : role === 'hospital'
                  ? '0 4px 16px rgba(124,58,237,0.35)'
                  : '0 4px 16px rgba(15,82,186,0.35)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                transition: 'all 250ms ease',
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : role === 'doctor' ? (
                'Submit Doctor Application'
              ) : role === 'hospital' ? (
                'Register Hospital Facility'
              ) : (
                'Create Patient Account'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography sx={{ fontSize: 14, color: '#6B7280' }}>
                Already have an account?{' '}
                <Typography
                  component={Link}
                  to="/login"
                  sx={{
                    color: '#0F52BA',
                    fontWeight: 700,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign In
                </Typography>
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
