/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0D0D12',
          800: '#14141B',
          700: '#1C1C27',
          600: '#252533',
          500: '#32324A',
        },
        accent: {
          primary: '#6C5CE7',
          secondary: '#A29BFE',
          light: '#DDD6FE',
        },
        success: '#00C9A7',
        warning: '#FFC048',
        danger: '#FF6B6B',
        info: '#4DA6FF',
        muted: '#6B7280',
      },
    },
  },
  plugins: [],
};
