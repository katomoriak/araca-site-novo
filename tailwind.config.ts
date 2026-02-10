import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class', 'class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			araca: {
  				'cafe-escuro': 'var(--araca-cafe-escuro)',
  				'laranja-queimado': 'var(--araca-laranja-queimado)',
  				'chocolate-amargo': 'var(--araca-chocolate-amargo)',
  				'dourado-ocre': 'var(--araca-dourado-ocre)',
  				'verde-pinho-escuro': 'var(--araca-verde-pinho-escuro)',
  				'mineral-green': 'var(--araca-mineral-green)',
  				'vinho-escuro': 'var(--araca-vinho-escuro)',
  				ameixa: 'var(--araca-ameixa)',
  				'rifle-green': 'var(--araca-rifle-green)',
  				'bege-claro': 'var(--araca-bege-claro)',
  				'cafe-medio': 'var(--araca-cafe-medio)',
  				'laranja-medio': 'var(--araca-laranja-medio)',
  				'dourado-claro': 'var(--araca-dourado-claro)',
  				'verde-medio': 'var(--araca-verde-medio)',
  				'verde-claro': 'var(--araca-verde-claro)',
  				'ameixa-medio': 'var(--araca-ameixa-medio)',
  				'bege-medio': 'var(--araca-bege-medio)',
  				creme: 'var(--araca-creme)'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				'50': '#eff6ff',
  				'100': '#dbeafe',
  				'200': '#bfdbfe',
  				'300': '#93c5fd',
  				'400': '#60a5fa',
  				'500': '#3b82f6',
  				'600': '#2563eb',
  				'700': '#1d4ed8',
  				'800': '#1e40af',
  				'900': '#1e3a8a',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': '#faf5ff',
  				'100': '#f3e8ff',
  				'200': '#e9d5ff',
  				'300': '#d8b4fe',
  				'400': '#c084fc',
  				'500': '#a855f7',
  				'600': '#9333ea',
  				'700': '#7e22ce',
  				'800': '#6b21a8',
  				'900': '#581c87',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			neutral: {
  				'50': '#fafafa',
  				'100': '#f5f5f5',
  				'200': '#e5e5e5',
  				'300': '#d4d4d4',
  				'400': '#a3a3a3',
  				'500': '#737373',
  				'600': '#525252',
  				'700': '#404040',
  				'800': '#262626',
  				'900': '#171717'
  			},
  			success: '#22c55e',
  			warning: '#f59e0b',
  			error: '#ef4444',
  			info: '#3b82f6',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			display: [
  				'var(--font-display)',
  				'serif'
  			],
  			body: [
  				'var(--font-body)',
  				'sans-serif'
  			],
  			primary: [
  				'var(--font-primary)',
  				'sans-serif'
  			],
  			secondary: [
  				'var(--font-secondary)',
  				'serif'
  			],
  			mono: [
  				'var(--font-mono)',
  				'monospace'
  			]
  		},
  		borderRadius: {
  			DEFAULT: 'var(--radius)',
  			glass: '1.25rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			glass: 'var(--glass-shadow)'
  		},
  		backdropBlur: {
  			glass: 'var(--glass-blur)'
  		},
  		animation: {
  			'scroll-down': 'scroll-down 2s ease-in-out infinite',
  			'fade-in': 'fade-in 0.5s ease-out forwards',
  			'slide-up': 'slide-up 0.5s ease-out forwards',
  			'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
  			marquee: 'marquee 40s linear infinite',
  			'marquee-reverse': 'marquee 40s linear infinite reverse',
  			'marquee-vertical': 'marquee-vertical 30s linear infinite',
  			'marquee-vertical-reverse': 'marquee-vertical-reverse 30s linear infinite'
  		},
  		keyframes: {
  			marquee: {
  				'0%': {
  					transform: 'translateX(0)'
  				},
  				'100%': {
  					transform: 'translateX(-33.333%)'
  				}
  			},
  			'marquee-vertical': {
  				'0%': {
  					transform: 'translateY(0)'
  				},
  				'100%': {
  					transform: 'translateY(-50%)'
  				}
  			},
  			'marquee-vertical-reverse': {
  				'0%': {
  					transform: 'translateY(-50%)'
  				},
  				'100%': {
  					transform: 'translateY(0)'
  				}
  			},
  			'scroll-down': {
  				'0%, 100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				},
  				'50%': {
  					transform: 'translateY(8px)',
  					opacity: '0.5'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'slide-up': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'pulse-dot': {
  				'0%, 100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				},
  				'50%': {
  					opacity: '0.4',
  					transform: 'scale(0.8)'
  				}
  			}
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
}
export default config
