/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          light: '#8B5CF6',
          dark: '#5B21B6',
        },
        navy: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
        },
        accent: '#00D4AA',
        danger: '#FF5757',
        bg: {
          light: '#F8FAFC',
          dark: '#0F0E17',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        input: '12px',
        pill: '9999px',
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0,0,0,0.08)',
        hover: '0 20px 40px -10px rgba(124,58,237,0.15)',
        card: '0 4px 24px rgba(108,71,255,0.08)',
        'card-hover': '0 8px 32px rgba(108,71,255,0.16)',
      },
    },
  },
  plugins: [],
};
