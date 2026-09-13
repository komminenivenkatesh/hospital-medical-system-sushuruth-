import { useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { createAppTheme } from './theme/theme';
import useStore from './store/useStore';
import PreLanding from './components/PreLanding';

import AppShell from './layout/AppShell';
import DoctorShell from './layout/DoctorShell';
import AdminShell from './layout/AdminShell';

// Auth
import Login from './pages/auth/Login';

// Patient
import Dashboard from './pages/patient/Dashboard';
import FindDoctors from './pages/patient/FindDoctors';
import DoctorProfile from './pages/patient/DoctorProfile';
import Booking from './pages/patient/Booking';
import Appointments from './pages/patient/Appointments';
import AppointmentDetail from './pages/patient/AppointmentDetail';
import ConsultRoom from './pages/patient/ConsultRoom';
import MriLab from './pages/patient/MriLab';
import Health from './pages/patient/Health';
import Hospitals from './pages/patient/Hospitals';
import HospitalDetail from './pages/patient/HospitalDetail';
import Articles from './pages/patient/Articles';
import Article from './pages/patient/Article';
import Chat from './pages/patient/Chat';
import Family from './pages/patient/Family';
import Profile from './pages/patient/Profile';
import Payments from './pages/patient/Payments';
import AiAssistant from './pages/patient/AiAssistant';
import Upgrade from './pages/patient/Upgrade';

// Doctor
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorPatients from './pages/doctor/Patients';
import DoctorConsultRoom from './pages/doctor/ConsultRoom';
import MriReview from './pages/doctor/MriReview';
import Earnings from './pages/doctor/Earnings';
import Availability from './pages/doctor/Availability';
import DoctorProfileEdit from './pages/doctor/ProfileEdit';

// Admin
import AdminOverview from './pages/admin/Overview';
import Verification from './pages/admin/Verification';
import Analytics from './pages/admin/Analytics';
import Moderation from './pages/admin/Moderation';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const dashboardPaths = { patient: '/dashboard', doctor: '/doctor/dashboard', admin: '/admin' };
    return <Navigate to={dashboardPaths[user?.role] || '/dashboard'} replace />;
  }

  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Full-screen pages (no shell) */}
        <Route path="/consult/:id" element={<ProtectedRoute><ConsultRoom /></ProtectedRoute>} />
        <Route path="/doctor/consult/:id" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorConsultRoom /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />

        {/* Patient */}
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/find-doctors" element={<FindDoctors />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/booking/:doctorId" element={<Booking />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/:id" element={<AppointmentDetail />} />
          <Route path="/mri" element={<MriLab />} />
          <Route path="/mri-lab" element={<MriLab />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/hospitals/:id" element={<HospitalDetail />} />
          <Route path="/health" element={<Health />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/family" element={<Family />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Doctor */}
        <Route element={<ProtectedRoute allowedRoles={['doctor']}><DoctorShell /></ProtectedRoute>}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/mri-review/:id" element={<MriReview />} />
          <Route path="/doctor/earnings" element={<Earnings />} />
          <Route path="/doctor/availability" element={<Availability />} />
          <Route path="/doctor/profile" element={<DoctorProfileEdit />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminShell /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/verification" element={<Verification />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/moderation" element={<Moderation />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function ThemedApp() {
  const themeMode = useStore((s) => s.themeMode);
  const accentColor = useStore((s) => s.accentColor);

  const theme = useMemo(
    () => createAppTheme(themeMode === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : themeMode,
      accentColor
    ),
    [themeMode, accentColor]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedRoutes />
    </ThemeProvider>
  );
}

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {isAppLoading ? (
          <motion.div key="preloader" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <PreLanding onComplete={() => setIsAppLoading(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AuthProvider>
              <ThemedApp />
            </AuthProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}
