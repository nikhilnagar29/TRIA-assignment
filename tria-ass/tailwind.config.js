// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/**/*.{js,jsx,ts,tsx}', // This is the key line
      './public/index.html',
      './index.html',
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };