/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        }
      },
      boxShadow: {
        'profile': '0 0 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    // Add simple versions of the plugins' functionality since you mentioned installation issues
    function({ addComponents }) {
      addComponents({
        '.form-input': {
          'border-width': '1px',
          'border-radius': '0.25rem',
          'padding': '0.5rem 0.75rem',
          '&:focus': {
            'outline': 'none',
            '--tw-ring-color': '#fbbf24',
            '--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
            '--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
            'box-shadow': 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)'
          }
        },
        '.aspect-w-16': {
          'position': 'relative',
          'padding-bottom': 'calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%)',
        },
        '.aspect-h-9': {
          '--tw-aspect-h': '9',
        },
        '.aspect-w-16 > *': {
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
      })
    }
  ],
  darkMode: 'class',
};