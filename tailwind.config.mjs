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
        orange: {
          primary: '#FF6B00',
          hover: '#FF8533',
          dark: '#E05E00',
          50: '#FFF5EB',
          100: '#FFE6D1',
          500: '#FF6B00',
          600: '#E05E00',
        },
        matte: {
          950: '#0A0A0A',
          900: '#121214',
          800: '#18181B',
          700: '#27272A',
        },
        obsidian: {
          950: '#07080a',
          900: '#0c0d12',
          800: '#14161f',
          700: '#1d202b',
        }
      },
      fontFamily: {
        royal: ['Syne', 'sans-serif'], // Heavy bold geometric sans-serif
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
