/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'; // Importa as cores padrão

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Você pode definir cores primárias, secundárias etc. aqui
        // Ex: primary: colors.blue[600],
        gray: colors.neutral, // Usar 'neutral' para cinzas mais sóbrios
      },
      fontFamily: {
        // Garante que Inter é a fonte padrão
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
         // Ajustar os raios de borda se necessário
         'lg': '0.5rem', // Padrão Tailwind
         'xl': '0.75rem', // Padrão Tailwind
         '2xl': '1rem', // Padrão Tailwind
      },
      boxShadow: {
         // Ajustar sombras se necessário
         'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // Padrão
         'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // Padrão
      },
      keyframes: {
        // Suas keyframes existentes...
         float: { /* ... */ },
         fadeInUp: { /* ... */ },
         // ...
      },
      animation: {
        // Suas animações existentes...
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards', // Duração um pouco menor
        // ...
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Outros plugins se houver
  ],
}