/**
 * Design tokens for 영업 시스템.
 * Export structure is compatible with Tailwind CSS theme (e.g. use in tailwind.config.ts).
 */

/**
 * Color palette tokens.
 * Primary, secondary (3–5 shades each), accent, grayscale (5+ shades).
 */
const colors = {
  /** Primary brand color scale */
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    500: '#2563eb',
    700: '#1d4ed8',
  },
  /** Secondary accent color scale */
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    500: '#64748b',
    700: '#334155',
  },
  /** Accent color for highlights and calls to action */
  accent: '#3b82f6',
  /** Grayscale (lightest to darkest) */
  grayscale: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
} as const;

/**
 * Typography & font tokens.
 * Font families (headings, body), font sizes (h1–h6, body, caption, small, large), font weights.
 */
const typography = {
  /** Font families: one for headings, one for body text */
  fontFamily: {
    heading: ['Pretendard', 'system-ui', 'sans-serif'],
    body: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
  },
  /** Font size scale: h1–h6, body, caption, small, large */
  fontSize: {
    h1: ['2rem', { lineHeight: '1.2' }],
    h2: ['1.5rem', { lineHeight: '1.3' }],
    h3: ['1.25rem', { lineHeight: '1.4' }],
    h4: ['1.125rem', { lineHeight: '1.4' }],
    h5: ['1rem', { lineHeight: '1.5' }],
    h6: ['0.875rem', { lineHeight: '1.5' }],
    body: ['1rem', { lineHeight: '1.5' }],
    caption: ['0.875rem', { lineHeight: '1.43' }],
    small: ['0.75rem', { lineHeight: '1.33' }],
    large: ['1.125rem', { lineHeight: '1.5' }],
  },
  /** Font weights: light, regular, medium, bold */
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
} as const;

/**
 * Theme object for use in tailwind.config.ts.
 * Example: export default { theme: { extend: theme } }
 */
export const theme = {
  colors,
  fontFamily: typography.fontFamily,
  fontSize: typography.fontSize,
  fontWeight: typography.fontWeight,
} as const;

export default theme;
