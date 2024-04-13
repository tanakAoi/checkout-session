/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans"],
      serif: ["Bitter", "serif"]
    },
    colors: {
      "main": "#96af9a",
      "base": "#d9d1c7",
      "dark": "#222",
      "light": "#f2f2f2"
    },
    extend: {},
  },
  plugins: [require("daisyui")],
};
