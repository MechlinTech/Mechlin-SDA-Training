/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./week1/day2/code/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
};