import { Box } from '@mui/material';

/**
 * Sushruth Premium Logo
 * Neural network / brain connectivity motif
 * Variants: full (icon + wordmark), compact (icon only), light (white version)
 */
export default function Logo({ size = 36, light = false, showWordmark = false, wordmarkSize = 18 }) {
  const primary = light ? '#FFFFFF' : '#0F52BA';
  const teal    = light ? 'rgba(255,255,255,0.8)' : '#0D9488';
  const glow    = light ? 'rgba(255,255,255,0.3)' : 'rgba(15,82,186,0.3)';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: showWordmark ? 1 : 0,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Icon Mark */}
      <Box
        className="logo-glow"
        sx={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'filter 300ms ease, transform 300ms ease',
          '&:hover': {
            filter: `drop-shadow(0 0 10px ${glow})`,
            transform: 'scale(1.05)',
          },
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Sushruth logo"
        >
          {/* Background circle (subtle) */}
          <circle cx="20" cy="20" r="18" fill={light ? 'rgba(255,255,255,0.12)' : 'rgba(15,82,186,0.08)'} />

          {/* Neural network nodes — outer ring */}
          <circle cx="20" cy="5"  r="3" fill={primary} opacity="0.9" />
          <circle cx="35" cy="12" r="2.5" fill={teal}   opacity="0.85" />
          <circle cx="35" cy="28" r="2.5" fill={teal}   opacity="0.85" />
          <circle cx="20" cy="35" r="3"   fill={primary} opacity="0.9" />
          <circle cx="5"  cy="28" r="2.5" fill={teal}   opacity="0.85" />
          <circle cx="5"  cy="12" r="2.5" fill={teal}   opacity="0.85" />

          {/* Center core */}
          <circle cx="20" cy="20" r="5" fill={primary} />
          <circle cx="20" cy="20" r="3" fill={light ? 'rgba(255,255,255,0.9)' : '#EFF6FF'} />

          {/* Neural connection lines — from center to outer nodes */}
          <line x1="20" y1="15" x2="20" y2="8"   stroke={primary} strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="24" y1="17" x2="32.5" y2="13" stroke={teal}   strokeWidth="1.5" strokeOpacity="0.55" />
          <line x1="24" y1="23" x2="32.5" y2="27" stroke={teal}   strokeWidth="1.5" strokeOpacity="0.55" />
          <line x1="20" y1="25" x2="20" y2="32"   stroke={primary} strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="16" y1="23" x2="7.5" y2="27"  stroke={teal}   strokeWidth="1.5" strokeOpacity="0.55" />
          <line x1="16" y1="17" x2="7.5" y2="13"  stroke={teal}   strokeWidth="1.5" strokeOpacity="0.55" />

          {/* Inner node connections (hexagonal web) */}
          <line x1="20" y1="8"  x2="32.5" y2="13" stroke={primary} strokeWidth="0.75" strokeOpacity="0.3" />
          <line x1="32.5" y1="13" x2="32.5" y2="27" stroke={teal}  strokeWidth="0.75" strokeOpacity="0.3" />
          <line x1="32.5" y1="27" x2="20"  y2="32" stroke={teal}   strokeWidth="0.75" strokeOpacity="0.3" />
          <line x1="20"  y1="32" x2="7.5" y2="27" stroke={primary} strokeWidth="0.75" strokeOpacity="0.3" />
          <line x1="7.5" y1="27" x2="7.5" y2="13" stroke={teal}   strokeWidth="0.75" strokeOpacity="0.3" />
          <line x1="7.5" y1="13" x2="20"  y2="8"  stroke={teal}   strokeWidth="0.75" strokeOpacity="0.3" />

          {/* Cross/Plus medical symbol in center */}
          <rect x="18.5" y="16" width="3" height="8" rx="1" fill={light ? '#0F52BA' : '#FFFFFF'} />
          <rect x="16"   y="18.5" width="8" height="3" rx="1" fill={light ? '#0F52BA' : '#FFFFFF'} />
        </svg>
      </Box>

      {/* Wordmark */}
      {showWordmark && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 800,
              fontSize: wordmarkSize,
              letterSpacing: '-0.02em',
              color: light ? '#FFFFFF' : '#0F52BA',
              lineHeight: 1.1,
            }}
          >
            Sushruth
          </Box>
          <Box
            component="span"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 500,
              fontSize: wordmarkSize * 0.6,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: light ? 'rgba(255,255,255,0.65)' : '#0D9488',
              lineHeight: 1.2,
            }}
          >
            Healthcare
          </Box>
        </Box>
      )}
    </Box>
  );
}
