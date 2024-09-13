/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans"],
      serif: ["Bitter", "serif"]
    },
    colors: {
      "leaf": "#96af9a",
      "coffee": "#e4ded8",
      "sky": "#6699cc",
      "blossom": "#ff9090",
      "dark": "#222",
      "light": "#f2f2f2"
    },
    extend: {},
  },
  plugins: [require("daisyui")],
};
