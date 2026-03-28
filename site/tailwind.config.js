/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"PP Fragmente Glare"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FA5A50',
          light: '#FA8982',
          xlight: '#FAB8B4',
          dark: '#D94A41',
          xdark: '#A63832',
        },
        secondary: {
          xdark: '#690037',
          dark: '#802655',
          DEFAULT: '#994D74',
          xlight: '#FAB9FF',
          mid: '#C785CC',
          muted: '#A26CA6',
        },
        navy: {
          DEFAULT: '#000050',
          mid: '#242459',
          light: '#393973',
        },
        ocean: {
          light: '#B4DCFA',
          mid: '#8CB3D9',
          muted: '#6B8FB3',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-bar': 'pulseBar 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseBar: {
          '0%, 100%': { width: '20%' },
          '50%': { width: '80%' },
        },
      },
    },
  },
  plugins: [],
}
