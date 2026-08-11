import { Box, Typography, Button } from '@mui/material';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import { motion } from 'framer-motion';

export default function PreLanding({ onComplete }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        minHeight: '100vh', 
        width: '100vw',
        bgcolor: '#fff', 
        alignItems: 'center', 
        px: { xs: 4, md: 8, lg: 12 }, 
        py: 8,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999,
        overflowY: 'auto'
      }}
    >
      
      {/* Left: Text Content */}
      <Box sx={{ flex: 1, pr: { md: 8 }, zIndex: 1, mb: { xs: 6, md: 0 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Typography 
            sx={{ 
              color: '#0F52BA', 
              fontWeight: 800, 
              fontSize: 12, 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase',
              mb: 3
            }}
          >
            See it in action
          </Typography>
          
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              fontSize: 'clamp(3.5rem, 6vw, 6.5rem)', 
              color: '#111827',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              mb: 5
            }}
          >
            Watch AI <br/>
            diagnose <br/>
            <Box component="span" sx={{ color: '#0F52BA' }}>live.</Box>
          </Typography>

          <Button 
            variant="contained" 
            onClick={onComplete}
            endIcon={<ArrowRightAltRoundedIcon sx={{ ml: 1, fontSize: 24 }} />}
            sx={{
              bgcolor: '#0F52BA',
              color: '#fff',
              px: 4,
              py: 2,
              borderRadius: 1.5,
              fontWeight: 700,
              fontSize: 16,
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(15,82,186,0.25)',
              transition: 'all 200ms ease',
              '&:hover': {
                bgcolor: '#0A3D8F',
                boxShadow: '0 12px 32px rgba(15,82,186,0.35)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Try it free
          </Button>
        </motion.div>
      </Box>

      {/* Right: Spline Robot */}
      <Box 
        sx={{ 
          flex: 1, 
          position: 'relative',
          minHeight: { xs: '450px', md: '700px' },
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
          {/* Spline iframe with lazy loading to prevent page lags */}
          <iframe 
            src='https://my.spline.design/r4xbot-RL8mkZJYNfpQUEvxv928NmaI/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            loading='lazy'
            style={{ border: 'none', width: '100%', height: '100%' }}
          ></iframe>
        </motion.div>
      </Box>

    </Box>
  );
}
