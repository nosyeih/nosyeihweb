/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
    "./jsons/**/*.json"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syncopate', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: {
          900: '#050505',
          800: '#0a0a0a',
          700: '#141414',
          border: '#1f1f1f',
          accent: '#ffffff',
          muted: '#6b7280'
        },
        light: {
          900: '#ffffff',
          800: '#f8f9fa',
          700: '#f1f5f9',
          border: '#e2e8f0',
          accent: '#050505',
          muted: '#64748b'
        }
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
