/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#0b0e14',
          card: '#121722',
          cardBorder: '#1e2638',
          subtle: '#182030',
          hover: '#222d42',
          buy: '#10b981',
          buyLight: 'rgba(16, 185, 129, 0.12)',
          sell: '#ef4444',
          sellLight: 'rgba(239, 68, 68, 0.12)',
          accent: '#3b82f6',
          gold: '#f59e0b',
          textMuted: '#94a3b8',
          textDim: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-buy': '0 0 15px -3px rgba(16, 185, 129, 0.35)',
        'glow-sell': '0 0 15px -3px rgba(239, 68, 68, 0.35)',
        'glow-accent': '0 0 20px -5px rgba(59, 130, 246, 0.35)'
      }
    },
  },
  plugins: [],
}
