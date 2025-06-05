/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-in-up': 'slideInUp 0.5s ease-out',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'bounce-slow': 'bounce 2s infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
          slideInUp: {
            '0%': { transform: 'translateY(20px)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
        },
        colors: {
          orchid: {
            50: '#fdf2ff',
            100: '#f6e5ff',
            200: '#efccff',
            300: '#e5a3ff',
            400: '#d66cff',
            500: '#c23dff',
            600: '#b016f7',
            700: '#9a0bd9',
            800: '#800db0',
            900: '#6b0f8f',
            950: '#470064',
          },
        },
      },
    },
    darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orchid: {
          500: '#DA70D6', // Orchid
          700: '#BA55D3', // Darker Orchid
        },
      },
    },
  },
  plugins: [],

  };
  