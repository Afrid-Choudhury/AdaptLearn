/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0E14',
        surface: '#151925',
        surfaceHighlight: '#1E2332',
      },
    },
  },
  plugins: [],
};
