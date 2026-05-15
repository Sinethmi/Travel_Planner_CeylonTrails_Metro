/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effaf3',
          100: '#d9f3e0',
          200: '#b4e6c4',
          300: '#82d2a1',
          400: '#4eb87b',
          500: '#2a9d5d',
          600: '#1d7d49',
          700: '#19633c',
          800: '#174f33',
          900: '#13412b',
        },
        sun: {
          400: '#ffb938',
          500: '#ff9a1f',
          600: '#e87b0c',
        },
      },
      fontFamily: {
        sans: ['System'],
        display: ['System'],
      },
    },
  },
  plugins: [],
};
