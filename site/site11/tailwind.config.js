module.exports = {
  content: [
    "./index.html", // caminho para seus arquivos HTML
    "./src/**/*.{js,jsx,ts,tsx}", // ajuste conforme sua estrutura
  ],
  theme: {
    extend: {
      colors: {
        // Baseado nas cores que você está usando
        'brand': {
          'gray': {
            100: '#f3f4f6',
            200: '#e5e7eb',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
          'blue': {
            50: '#eff6ff',
            100: '#dbeafe',
            600: '#2563eb',
            700: '#1d4ed8',
          },
          'green': {
            100: '#dcfce7',
            600: '#16a34a',
            700: '#15803d',
          },
          'yellow': {
            100: '#fef9c3',
            600: '#ca8a04',
            700: '#a16207',
          },
        },
      },
    },
  },
  plugins: [],
}