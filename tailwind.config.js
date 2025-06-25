/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Garanta que este caminho está correto
  ],
  theme: {
    extend: {},
  },
  // Adicione a seção de plugins se ela não existir
  plugins: [
    require('@tailwindcss/typography'), // <-- ADICIONE ESTA LINHA
  ],
}