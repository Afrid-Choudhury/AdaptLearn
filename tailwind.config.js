/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDF5',
        accent: '#8B5CF6',
        'accent-dark': '#7C3AED',
        secondary: '#F472B6',
        tertiary: '#FBBF24',
        quaternary: '#34D399',
        foreground: '#1E293B',
        'border-dark': '#1E293B',
        surface: '#FFFFFF',
      },
      fontFamily: {
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        blob: '24px 24px 24px 4px',
        arch: '9999px 9999px 24px 24px',
      },
      boxShadow: {
        pop: '4px 4px 0px 0px #1E293B',
        'pop-hover': '6px 6px 0px 0px #1E293B',
        'pop-active': '2px 2px 0px 0px #1E293B',
        'pop-pink': '6px 6px 0px 0px #F472B6',
        'pop-yellow': '6px 6px 0px 0px #FBBF24',
        'pop-green': '6px 6px 0px 0px #34D399',
        'pop-violet': '6px 6px 0px 0px #8B5CF6',
        'pop-soft': '8px 8px 0px 0px #E2E8F0',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '75%': { transform: 'rotate(-3deg)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '60%': { transform: 'translateY(2px)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.4s ease-in-out',
        'pop-in': 'pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'bounce-in': 'bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'float-slower': 'float 5s ease-in-out infinite',
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
