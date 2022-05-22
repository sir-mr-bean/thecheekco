// eslint-ignore-next-line
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
      },
      fontFamily: {
        gothic: ["'Gothic A1'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
