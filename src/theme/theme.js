import { createTheme } from '@mui/material/styles';
import '@fontsource/manrope/300.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';

/* ============================================================
   NeuroCare Design Token System
   World-class healthcare color palette inspired by
   One Medical · Apollo247 · Zocdoc · Practo
   ============================================================ */

const accentPalettes = {
  blue: {
    primary:      '#0F52BA',   // Deep medical blue — authority & trust
    primaryDark:  '#0A3D8F',   // Pressed / hover state
    primaryLight: '#1E6FE8',   // Lighter variant
    primarySoft:  '#EFF6FF',   // Tinted background
    primaryGlow:  'rgba(15, 82, 186, 0.25)',
    gradient:     'linear-gradient(135deg, #0F52BA 0%, #0A3D8F 100%)',
    gradientSoft: 'linear-gradient(135deg, #EFF6FF 0%, #E0EEFF 100%)',
  },
  teal: {
    primary:      '#0D9488',
    primaryDark:  '#0F766E',
    primaryLight: '#14B8A6',
    primarySoft:  '#F0FDFA',
    primaryGlow:  'rgba(13, 148, 136, 0.25)',
    gradient:     'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
    gradientSoft: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
  },
  purple: {
    primary:      '#6D28D9',
    primaryDark:  '#5B21B6',
    primaryLight: '#7C3AED',
    primarySoft:  '#F3F0FF',
    primaryGlow:  'rgba(109, 40, 217, 0.25)',
    gradient:     'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)',
    gradientSoft: 'linear-gradient(135deg, #F3F0FF 0%, #EDE9FE 100%)',
  },
  green: {
    primary:      '#059669',
    primaryDark:  '#047857',
    primaryLight: '#10B981',
    primarySoft:  '#ECFDF5',
    primaryGlow:  'rgba(5, 150, 105, 0.25)',
    gradient:     'linear-gradient(135deg, #059669 0%, #047857 100%)',
    gradientSoft: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
  },
  amber: {
    primary:      '#D97706',
    primaryDark:  '#B45309',
    primaryLight: '#F59E0B',
    primarySoft:  '#FFFBEB',
    primaryGlow:  'rgba(217, 119, 6, 0.25)',
    gradient:     'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
    gradientSoft: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
  },
};

export const makeTokens = (mode = 'light', accentColor = 'blue') => {
  const accent = accentPalettes[accentColor] || accentPalettes.blue;
  const dark = mode === 'dark';

  return {
    /* Brand */
    ...accent,
    teal:          '#0D9488',
    tealDark:      '#0F766E',
    tealSoft:      '#F0FDFA',

    /* Surfaces */
    canvas:         dark ? '#0B0F1A' : '#F5F7FB',
    surface:        dark ? '#141824' : '#FFFFFF',
    surfaceMuted:   dark ? '#1A1F2E' : '#F8FAFC',
    surfaceElevated: dark ? '#1E2437' : '#FDFEFF',
    surfaceTintBlue: dark ? `${accent.primary}18` : accent.primarySoft,
    surfaceTintGreen: dark ? '#064e3b18' : '#ECFDF5',
    surfaceTintAmber: dark ? '#78350f18' : '#FFFBEB',
    surfaceTintPurple: dark ? '#4c1d9518' : '#F3F0FF',

    /* Text */
    ink:          dark ? '#F9FAFB' : '#0B1220',
    textPrimary:  dark ? '#F9FAFB' : '#111827',
    textSecondary: dark ? '#9CA3AF' : '#4B5563',
    textTertiary:  dark ? '#6B7280' : '#9CA3AF',

    /* Borders */
    border:       dark ? '#252D3D' : '#E5E7EB',
    borderStrong: dark ? '#374060' : '#D1D5DB',
    borderFocus:  accent.primary,

    /* Status */
    success:      '#059669',
    successSoft:  dark ? '#064e3b28' : '#ECFDF5',
    successText:  dark ? '#34D399' : '#065F46',
    warning:      '#D97706',
    warningSoft:  dark ? '#78350f22' : '#FFFBEB',
    warningText:  dark ? '#FCD34D' : '#92400E',
    danger:       '#DC2626',
    dangerSoft:   dark ? '#7f1d1d22' : '#FEF2F2',
    dangerText:   dark ? '#FCA5A5' : '#991B1B',
    info:         '#0EA5E9',
    infoSoft:     dark ? '#0c4a6e22' : '#F0F9FF',

    /* Shadows — 3-level system */
    cardShadow:      dark
      ? '0 1px 3px rgba(0,0,0,0.4)'
      : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    cardShadowHover: dark
      ? '0 4px 16px rgba(0,0,0,0.5)'
      : '0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)',
    cardShadowLg:    dark
      ? '0 12px 32px rgba(0,0,0,0.6)'
      : '0 12px 32px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)',
    cardShadowXl:    dark
      ? '0 24px 48px rgba(0,0,0,0.7)'
      : '0 24px 48px rgba(0,0,0,0.10), 0 8px 16px rgba(0,0,0,0.05)',
    shadowBlue:      `0 8px 24px ${accent.primaryGlow}`,
    shadowTeal:      '0 8px 24px rgba(13, 148, 136, 0.25)',

    /* Glass morphism */
    glassBg:       dark ? 'rgba(20, 24, 36, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    glassBorder:   dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
    glassBlur:     'blur(20px) saturate(180%)',

    /* Gradients */
    blueGradient:  `linear-gradient(135deg, ${accent.primary} 0%, ${accent.primaryDark} 100%)`,
    blueGradientSoft: accent.gradientSoft,
    tealGradient:  'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
    heroGradient:  dark
      ? 'linear-gradient(135deg, #1A1F2E 0%, #141824 50%, #1E2437 100%)'
      : 'linear-gradient(135deg, #F0F6FF 0%, #EEF4FF 50%, #F5FBFF 100%)',
    navGradient:   `linear-gradient(135deg, ${accent.primaryDark} 0%, ${accent.primary} 100%)`,
    cardGradient:  dark
      ? `linear-gradient(135deg, ${accent.primary}22 0%, transparent 60%)`
      : `linear-gradient(135deg, ${accent.primarySoft} 0%, transparent 60%)`,

    /* Motion — consistent timing */
    motionFast:   '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    motionNormal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    motionSlow:   '400ms cubic-bezier(0.4, 0, 0.2, 1)',
    motionSpring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',

    /* Border Radii */
    radiusSm:  '8px',
    radiusMd:  '12px',
    radiusLg:  '16px',
    radiusXl:  '24px',
    radiusFull: '100px',
  };
};

// Default light-blue tokens for files that import tokens directly
export const tokens = makeTokens('light', 'blue');

export function createAppTheme(mode = 'light', accentColor = 'blue') {
  const t = makeTokens(mode, accentColor);
  const dark = mode === 'dark';

  return createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      primary:    { main: t.primary, dark: t.primaryDark, light: t.primaryLight, contrastText: '#FFFFFF' },
      secondary:  { main: t.teal, contrastText: '#FFFFFF' },
      success:    { main: t.success, light: t.successSoft, contrastText: '#FFFFFF' },
      error:      { main: t.danger,  light: t.dangerSoft },
      warning:    { main: t.warning, light: t.warningSoft },
      info:       { main: t.info,    light: t.infoSoft },
      background: { default: t.canvas, paper: t.surface },
      text:       { primary: t.textPrimary, secondary: t.textSecondary, disabled: t.textTertiary },
      divider:    t.border,
    },

    typography: {
      fontFamily: '"Manrope", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontWeightLight:   300,
      fontWeightRegular: 400,
      fontWeightMedium:  500,
      fontWeightBold:    700,

      /* Display sizes — for hero headlines */
      h1: { fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.1 },
      h2: { fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.025em', lineHeight: 1.2 },
      h3: { fontWeight: 700, fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', letterSpacing: '-0.02em', lineHeight: 1.3 },
      h4: { fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.01em' },
      h5: { fontWeight: 700, fontSize: '1rem' },
      h6: { fontWeight: 600, fontSize: '0.875rem' },

      /* Body */
      body1: { fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.65 },
      body2: { fontWeight: 400, fontSize: '0.875rem',  lineHeight: 1.6 },
      caption: { fontWeight: 500, fontSize: '0.75rem', color: t.textTertiary, letterSpacing: '0.01em' },
      overline: { fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase' },
      subtitle1: { fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.5 },
      subtitle2: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.5 },
      button: { fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.01em' },
    },

    shape: { borderRadius: 12 },

    /* Elevation system — 3 meaningful levels */
    shadows: [
      'none',
      '0 1px 2px rgba(0,0,0,0.04)',               // 1 — subtle
      t.cardShadow,                                 // 2 — card default
      t.cardShadowHover,                            // 3 — card hover
      t.cardShadowLg,                               // 4 — modal/drawer
      t.cardShadowXl,                               // 5 — overlay
      ...Array(19).fill('none'),
    ],

    components: {
      /* ---- Button ---- */
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none',
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 600,
            letterSpacing: '0.01em',
            boxShadow: 'none',
            paddingTop: 9,
            paddingBottom: 9,
            transition: `all ${t.motionFast}`,
            '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' },
            '&:active': { boxShadow: 'none', transform: 'translateY(0)' },
          },
          containedPrimary: {
            background: t.blueGradient,
            '&:hover': { background: `linear-gradient(135deg, ${t.primaryLight} 0%, ${t.primary} 100%)` },
          },
          containedSecondary: {
            background: t.tealGradient,
            '&:hover': { background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' },
          },
          outlinedPrimary: {
            borderColor: t.border,
            color: t.textPrimary,
            '&:hover': { borderColor: t.primary, backgroundColor: t.primarySoft, color: t.primary },
          },
          sizeSmall:  { paddingTop: 6, paddingBottom: 6, fontSize: '0.8125rem' },
          sizeLarge:  { paddingTop: 12, paddingBottom: 12, fontSize: '0.9375rem', borderRadius: 12 },
        },
      },

      /* ---- Card ---- */
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${t.border}`,
            borderRadius: 16,
            backgroundImage: 'none',
            boxShadow: t.cardShadow,
            transition: `box-shadow ${t.motionFast}, border-color ${t.motionFast}, transform ${t.motionFast}`,
            '&:hover': {
              borderColor: t.borderStrong,
              boxShadow: t.cardShadowHover,
            },
          },
        },
      },

      /* ---- Chip ---- */
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.01em',
            transition: `all ${t.motionFast}`,
          },
          sizeSmall: { height: 22, fontSize: '0.6875rem' },
        },
      },

      /* ---- Input ---- */
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: '10px !important',
            fontFamily: '"Manrope", sans-serif',
            fontSize: '0.9375rem',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: `border-color ${t.motionFast}`,
            '& fieldset': { borderColor: t.border, transition: `border-color ${t.motionFast}` },
            '&:hover fieldset': { borderColor: t.borderStrong },
            '&.Mui-focused fieldset': { borderColor: t.primary, borderWidth: 2 },
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
      },

      /* ---- Paper ---- */
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          elevation1: { boxShadow: t.cardShadow },
          elevation2: { boxShadow: t.cardShadowHover },
          elevation3: { boxShadow: t.cardShadowLg },
        },
      },

      /* ---- Tooltip ---- */
      MuiTooltip: {
        defaultProps: { arrow: true },
        styleOverrides: {
          tooltip: {
            fontFamily: '"Manrope", sans-serif',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: dark ? '#1E2437' : '#111827',
            borderRadius: 8,
            padding: '6px 12px',
          },
          arrow: { color: dark ? '#1E2437' : '#111827' },
        },
      },

      /* ---- Tabs ---- */
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
          },
        },
      },

      /* ---- Divider ---- */
      MuiDivider: {
        styleOverrides: { root: { borderColor: t.border } },
      },

      /* ---- Skeleton ---- */
      MuiSkeleton: {
        styleOverrides: {
          root: { borderRadius: 8 },
          wave: {
            '&::after': {
              background: `linear-gradient(90deg, transparent, ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'}, transparent)`,
            },
          },
        },
      },

      /* ---- Alert ---- */
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 12, fontFamily: '"Manrope", sans-serif' },
          standardSuccess: { backgroundColor: t.successSoft, color: t.successText },
          standardError:   { backgroundColor: t.dangerSoft,  color: t.dangerText },
          standardWarning: { backgroundColor: t.warningSoft,  color: t.warningText },
          standardInfo:    { backgroundColor: t.infoSoft,    color: t.info },
        },
      },

      /* ---- Badge ---- */
      MuiBadge: {
        styleOverrides: {
          badge: { fontFamily: '"Manrope", sans-serif', fontWeight: 700, fontSize: '0.625rem' },
        },
      },

      /* ---- Dialog ---- */
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 20, backgroundImage: 'none' },
        },
      },

      /* ---- Snackbar ---- */
      MuiSnackbarContent: {
        styleOverrides: {
          root: { borderRadius: 12, fontFamily: '"Manrope", sans-serif' },
        },
      },

      /* ---- Linear Progress ---- */
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 100, height: 6 },
          bar: { borderRadius: 100 },
        },
      },
    },
  });
}

export default createAppTheme('light', 'blue');
