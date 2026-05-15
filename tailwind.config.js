export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 80px rgba(15, 23, 42, 0.35)',
        card: 'var(--card-shadow)',
      },
      colors: {
        'brand-coral': '#fb7185',
        'brand-emerald': '#10b981',
        'brand-blue': '#3b82f6',
        'brand-blue-light': '#2563eb',
        'brand-coral-light': '#e11d48',
        'surface': 'var(--surface)',
        'card': 'var(--card-bg)',
        'border-card': 'var(--card-border)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
    },
  },
  plugins: [],
};
