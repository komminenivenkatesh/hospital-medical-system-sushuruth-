import { useState } from 'react';
import { Box } from '@mui/material';
import { tokens } from '../theme/theme';

// Image with graceful gradient fallback if the remote source fails to load.
export default function SmartImage({ src, alt = '', sx, fallback, fallbackColor, ...props }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <Box
        sx={{
          background: fallback || `linear-gradient(135deg, ${tokens.primarySoft}, ${tokens.surfaceTintGreen})`,
          width: '100%', height: '100%', ...sx,
        }}
        {...props}
      />
    );
  }
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      sx={{ objectFit: 'cover', display: 'block', ...sx }}
      {...props}
    />
  );
}
