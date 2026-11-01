/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,html}'],
  darkMode: 'class',
  theme: { extend: { colors: { cart_witnessing_manager: { light: '##ef4444', dark: '##f87171' } } } }
};
