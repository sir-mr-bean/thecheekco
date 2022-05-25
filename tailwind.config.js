// eslint-ignore-next-line
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        enter: "enter 200ms ease-out forwards",
        leave: "leave 200ms ease-in forwards",
      },
      keyframes: {
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      colors: {
        "header-brown": "#7e3e15",
        "header-text": "#f8dac1",
        "bg-tan": "#F5E7DD",
        "text-primary": "#602d0d",
        "text-secondary": "#a75e2f",
        "bg-lighttan": "#FAF3EE",
        button: "#E3BB9D",
        "shopping-cart": "#A75E2F",
        "shopping-cart-badge": "#926E68",
      },
      backgroundImage: {
        "paper-bg": "url(../public/images/paper-brown-texture.jpg)",
        "hero-pattern":
          "linear-gradient(to right bottom, rgba('#7ed56f',0.8), rgba('#28b485',0.8)), url('https://images.unsplash.com/photo-1523772354886-34a1dc2f72e7?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=736')",
      },
      fontFamily: {
        gothic: ["'Gothic A1'", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
