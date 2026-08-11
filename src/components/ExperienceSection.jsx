import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { motion } from 'framer-motion';

export default function ExperienceSection() {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '80vh', bgcolor: '#fff' }}>
      
      {/* 1. Left: White block with rotated text */}
      <Box sx={{ 
        width: { xs: '100%', md: '180px' }, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 4,
        position: 'relative',
        borderRight: '1px solid rgba(0,0,0,0.05)'
      }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              fontSize: 'clamp(3rem, 6vw, 6rem)', 
              color: '#111827',
              transform: { md: 'rotate(-90deg)' },
              whiteSpace: 'nowrap',
              letterSpacing: '-0.03em'
            }}
          >
            Experience
          </Typography>
        </motion.div>
      </Box>

      {/* 2. Middle: Dark block */}
      <Box sx={{ 
        flex: 1, 
        bgcolor: '#050A14', 
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        p: { xs: 4, md: 8, lg: 10 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Navigation arrows (top right of this block) */}
        <Box sx={{ position: 'absolute', top: 40, right: 40, display: 'flex', gap: 2 }}>
          <IconButton sx={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ArrowBackRoundedIcon />
          </IconButton>
          <IconButton sx={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ArrowForwardRoundedIcon />
          </IconButton>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Typography 
            sx={{ 
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', 
              fontWeight: 600, 
              lineHeight: 1.25,
              maxWidth: 600,
              letterSpacing: '-0.02em'
            }}
          >
            A team of 12,000+ verified specialists, backed by AI — delivering world-class care to every corner of India.
          </Typography>
        </motion.div>
      </Box>

      {/* 3. Right: Spline Viewer Container */}
      <Box sx={{ 
        flex: 1, 
        position: 'relative',
        minHeight: { xs: '400px', md: 'auto' },
        bgcolor: '#E5E7EB'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%', minHeight: '100%' }}
        >
          {/* Doctor Image Placeholder (Black & White) */}
          <Box 
            sx={{ 
              width: '100%', 
              height: '100%', 
              backgroundImage: 'url(https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=1000)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(100%)'
            }} 
          />
        </motion.div>
      </Box>
    </Box>
  );
}
