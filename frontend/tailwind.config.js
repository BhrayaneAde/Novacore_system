/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales : Or et Bleu
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Or principal
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#055169', // Bleu pétrole principal
          600: '#044a5c',
          700: '#03404f',
          800: '#023642',
          900: '#012c35',
          950: '#001f28',
        },
        // Alias pour faciliter l'usage
        gold: {
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
        teal: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#055169',
          600: '#044a5c',
          700: '#03404f',
          800: '#023642',
          900: '#012c35',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(245, 158, 11, 0.15)',
        'teal': '0 4px 14px 0 rgba(5, 81, 105, 0.15)',
      },
      backgroundImage: {
        'gradient-gold-teal': 'linear-gradient(135deg, #f59e0b 0%, #055169 100%)',
        'gradient-teal-gold': 'linear-gradient(135deg, #055169 0%, #f59e0b 100%)',
      }
    },
  },
  plugins: [],
}