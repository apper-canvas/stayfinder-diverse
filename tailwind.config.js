/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          50: '#E6F2FF',
          100: '#CCE5FF',
          500: '#0066CC',
          600: '#0054A3',
          700: '#004080',
          800: '#002D5C',
          900: '#001A38'
        },
        secondary: {
          DEFAULT: '#004080',
          500: '#004080',
          600: '#003366'
        },
        accent: {
          DEFAULT: '#00A8E8',
          500: '#00A8E8'
        },
        surface: '#FFFFFF',
        background: '#F5F8FA',
        gold: '#FFB800',
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#D63031',
        info: '#0984E3'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-lg': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.5', fontWeight: '400' }]
      },
      boxShadow: {
        'card-rest': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'form': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'nav': '0 1px 3px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}