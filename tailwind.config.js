/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // dùng class "dark"
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.05' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        'fade-pulse': 'fadePulse 1.5s ease-in-out infinite'
      },
      fontFamily: {
        averta: ['"Averta CY"', 'sans-serif']
      },
      colors: {
        // Text
        'text-hi': '#1F252E',
        'text-hi-dark': '#FFFFFF',

        'text-me': '#647082',
        'text-me-dark': '#C5CBD3',

        'text-lo': '#9AA4B2',
        'text-lo-dark': '#8B97A7',

        'text-muted': '#D9DDE2',
        'text-muted-dark': '#596373',

        // Background
        'bg-canvas': '#FFFFFF',
        'bg-canvas-dark': '#142334',

        'bg-primary': '#FFFFFF',
        'bg-primary-dark': '#1E2D3E',

        'bg-secondary': '#FFFFFF',
        'bg-secondary-dark': '#24374C',

        'bg-tertiary': '#FFFFFF',
        'bg-tertiary-dark': '#2E4560',

        'bg-mute': '#F5F5F5',
        'bg-mute-dark': '#182A3F',

        'bg-input': '#FAFAFA',
        'bg-input-dark': '#111D2D',

        'bg-hover-gray': 'rgba(229, 229, 229, 0.5)',
        'bg-hover-gray-dark': 'rgba(37, 64, 96, 1)',

        'bg-white-glass': 'rgba(255, 255, 255, 0.5)',
        'bg-white-glass-dark': 'rgba(34, 56, 89, 0.5)',

        // White & Black
        white: '#FFFFFF',
        black: '#1D1D1D',

        // Border
        border: '#F1F2F4',
        'border-dark': '#2D4F76',

        'border-element': '#F1F2F4',
        'border-element-dark': '#1E344E',

        // Primary
        primary: '#FF7530',
        'primary-dark': '#FF8A4D',

        'primary-hi': '#FF6619',
        'primary-hi-dark': '#FFBC99',

        'primary-border': '#FFBB99',
        'primary-border-dark': '#794006',

        'primary-bg': '#FFF5F0',
        'primary-bg-dark': '#612405',

        // Red
        red: '#D14F47',
        'red-dark': '#DD523C',

        'red-hi': '#CC3B33',
        'red-hi-dark': '#E06552',

        'red-border': '#F5AAA3',
        'red-border-dark': '#681E13',

        'red-bg': '#FDF2F1',
        'red-bg-dark': '#57190F',

        // Green
        green: '#27BE2A',
        'green-dark': '#60B966',

        'green-hi': '#3E8E44',
        'green-hi-dark': '#71C177',

        'green-border': '#AAEEAC',
        'green-border-dark': '#255528',

        'green-bg': '#F2FCF3',
        'green-bg-dark': '#1F4723',

        // Yellow
        yellow: '#FDBE02',
        'yellow-dark': '#FDC11C',

        'yellow-hi': '#E39802',
        'yellow-hi-dark': '#FDC835',

        'yellow-border': '#FEEEC3',
        'yellow-border-dark': '#795901',

        'yellow-bg': '#FFFBF0',
        'yellow-bg-dark': '#644B02',

        // Blue
        blue: '#259DF4',
        'blue-dark': '#55B3F6',

        'blue-hi': '#0186E4',
        'blue-hi-dark': '#1BA0FE',

        'blue-border': '#D6E9FF',
        'blue-border-dark': '#00287A',

        'blue-bg': '#F5FBFF',
        'blue-bg-dark': '#003C66',

        // Pink
        pink: '#7B25F4',
        'pink-dark': '#B686F9'
      },
      fontSize: {
        xs: '10px',
        sm: '13px',
        base: '15px',
        lg: '17px'
      },
      boxShadow: {
        xxs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        xs: '0 1px 3px 0 rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
        md: 'rgba(0, 0, 0, 0.03) 0px 4px 6px -2px, rgba(0, 0, 0, 0.08) 0px 12px 16px -4px',
        lg: '0 20px 24px -4px rgba(0, 0, 0, 0.12), 0 8px 8px -4px rgba(0, 0, 0, 0.06)',
        table: '-1px 0 0 0 #FFFFFF, -1px 0 3px 0 rgba(0,0,0,0.10), -1px 0 2px 0 rgba(0,0,0,0.06)',
        'table-dark': '-1px 0 0 0 #163754, -1px 0 3px 0 rgba(0, 0, 0, 0.25), -1px 0 2px 0 rgba(0, 0, 0, 0.08)',
        menuItem: '2px 2px 4px 0 rgba(255, 255, 255, 0.50) inset, -2px -2px 4px 0 rgba(18, 18, 18, 0.12) inset;'
      },
      // borderWidth: {
      //   DEFAULT: '1.25px'
      // },
      borderRadius: {
        sidebar: '16px 0 16px 16px'
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(180deg, #00A7FF 0%, #0075F4 100%)',
        'yellow-gradient': 'linear-gradient(180deg, #FFD812 0%, #FF8900 100%)',
        'green-gradient': 'linear-gradient(168deg, #1BCE74 40.83%, #00BFA1 91.21%)',
        'purple-gradient': 'linear-gradient(168deg, #58B3F1 -1.52%, #3B55F0 48.86%)'
      },
      breakpoints: {
        '2xl': '1440px',
        '3xl': '1920px',
        '4xl': '2560px'
      }
    }
  },
  plugins: []
};
