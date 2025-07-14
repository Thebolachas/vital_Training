/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Garanta que este caminho está correto
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        bounceInText: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px) scale(0.8)',
          },
          '40%': {
            opacity: '1',
            transform: 'translateY(-5px) scale(1.05)',
          },
          '70%': {
            transform: 'translateY(2px) scale(0.98)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'bounce-in-text': 'bounceInText 0.8s ease-out forwards',
        'pop-in': 'popIn 0.5s ease-out forwards',
        blink: 'blink 1.5s infinite',
      },
    },
  },
  // Mantenha a seção de plugins se ela já existir e adicione @tailwindcss/typography
  plugins: [
    require('@tailwindcss/typography'),
  ],
}