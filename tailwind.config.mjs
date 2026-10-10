/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf9f1',
          100: '#f5f0db',
          200: '#ebe0b4',
          300: '#dec784',
          400: '#d0ad56',
          500: '#d4af37', // Royal Gold
          600: '#b88d29',
          700: '#936a23',
          800: '#785422',
          900: '#644621',
        },
        obsidian: {
          950: '#07080a',
          900: '#0c0d12',
          800: '#14161f',
          700: '#1d202b',
        }
      },
      fontFamily: {
        royal: ['Cinzel', 'serif'],
        display: ['Syne', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif']
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
};
