/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // "Olhe" todos os arquivos .jsx
  ],
  theme: {
    extend: {
      // Sua paleta de cores (do PDF)
      colors: {
        'brand-primary': '#F4A64E', // Laranja/Caqui
        'brand-primary-dark': '#d18a3a', // Tom mais escuro para hover
        'brand-secondary': '#7C4A2D', // Marrom/Canela
        'brand-background': '#FFE2C8', // Bege claro
        'brand-accent': '#9C9B7A', // Verde Oliva
        'brand-text': '#4a2f20', // Marrom escuro para texto
      },
      // Suas fontes (do PDF)
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'], // Fonte para títulos
      },
    },
  },
  plugins: [],
}