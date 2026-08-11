import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import MobileNav from './MobileNav';
import Footer from './Footer';
import GlobalProgress from '../components/GlobalProgress';

export default function AppShell() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Route progress bar — YouTube style */}
      <GlobalProgress />

      <TopNav />

      <Box
        component="main"
        sx={{
          flex: 1,
          maxWidth: 1440,
          mx: 'auto',
          width: '100%',
          px: { xs: 1.5, sm: 2, md: 4 },
          py: { xs: 1, md: 2 },
          pb: { xs: 10, md: 4 }, // room for mobile bottom nav
        }}
      >
        <Outlet />
      </Box>

      <Footer />
      <MobileNav />
    </Box>
  );
}
