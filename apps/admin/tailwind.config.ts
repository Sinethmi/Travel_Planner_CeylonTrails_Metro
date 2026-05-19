import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
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
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};

export default config;
