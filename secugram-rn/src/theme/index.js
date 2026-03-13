export const DarkColors = {
  bg:        '#000000',
  surface:   '#0D0D0D',
  card:      '#161616',
  border:    'rgba(255,255,255,0.08)',
  accent:    '#FF6B00',
  accentDim: 'rgba(255,107,0,0.12)',
  accentGlow:'rgba(255,107,0,0.35)',
  cyan:      '#00CFFF',
  danger:    '#FF453A',
  success:   '#32D74B',
  warning:   '#FFD60A',
  textPri:   '#FFFFFF',
  textSec:   'rgba(255,255,255,0.5)',
  textMut:   'rgba(255,255,255,0.22)',
  overlay:   'rgba(0,0,0,0.72)',
};

export const LightColors = {
  bg:        '#FFFFFF',
  surface:   '#F5F5F5',
  card:      '#FFFFFF',
  border:    'rgba(0,0,0,0.1)',
  accent:    '#FF6B00',
  accentDim: 'rgba(255,107,0,0.08)',
  accentGlow:'rgba(255,107,0,0.25)',
  cyan:      '#0099CC',
  danger:    '#FF3B30',
  success:   '#28A745',
  warning:   '#FF9500',
  textPri:   '#000000',
  textSec:   'rgba(0,0,0,0.55)',
  textMut:   'rgba(0,0,0,0.3)',
  overlay:   'rgba(0,0,0,0.6)',
};

// Fallback export (dark) for any file not yet migrated
export const Colors = DarkColors;

export const Typography = {
  display: { fontWeight: '800', letterSpacing: -1 },
  heading: { fontWeight: '700', letterSpacing: -0.4 },
  subhead: { fontWeight: '600', letterSpacing: -0.2 },
  body:    { fontWeight: '400' },
  caption: { fontWeight: '400', letterSpacing: 0.2 },
  mono:    { fontFamily: 'Courier New', fontWeight: '500' },
};

export const Radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   22,
  xxl:  32,
  full: 999,
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};
