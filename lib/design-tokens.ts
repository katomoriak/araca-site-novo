/**
 * Design Tokens - Aracá Interiores Design System
 * Paleta natural e terrosa | Glassmorphism premium
 */

export const tokens = {
  colors: {
    araca: {
      cafeEscuro: '#30160C',
      laranjaQueimado: '#944B20',
      chocolateAmargo: '#473018',
      douradoOcre: '#DB9847',
      verdePinhoEscuro: '#111913',
      mineralGreen: '#3C5945',
      vinhoEscuro: '#26161B',
      ameixa: '#502632',
      rifleGreen: '#444340',
      begeClaro: '#ECE5DB',
      cafeMedio: '#5A3020',
      laranjaMedio: '#B86938',
      douradoClaro: '#E8B56F',
      verdeMedio: '#4A6B54',
      verdeClaro: '#658972',
      ameixaMedio: '#6D3D4C',
      begeMedio: '#D4C8BA',
      creme: '#F5F1ED',
    },
    semantic: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      primary: 'var(--primary)',
      primaryForeground: 'var(--primary-foreground)',
      secondary: 'var(--secondary)',
      secondaryForeground: 'var(--secondary-foreground)',
      accent: 'var(--accent)',
      accentForeground: 'var(--accent-foreground)',
      muted: 'var(--muted)',
      mutedForeground: 'var(--muted-foreground)',
    },
    charts: {
      chart1: 'var(--chart-1)',
      chart2: 'var(--chart-2)',
      chart3: 'var(--chart-3)',
      chart4: 'var(--chart-4)',
      chart5: 'var(--chart-5)',
    },
  },
  fontFamily: {
    display: 'var(--font-display)',
    body: 'var(--font-body)',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    DEFAULT: 'var(--radius)',
    glass: '1.25rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  glass: {
    blur: 'var(--glass-blur)',
    shadow: 'var(--glass-shadow)',
  },
} as const
