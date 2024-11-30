module.exports = {
  darkMode: "class",
  corePlugins: {
    preflight: false,
  },
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textColor: ["active"],
      height: {
        "screen-d": "100dvh",
      },
      minHeight: {
        "screen-d": "100dvh",
        60: "15rem",
      },
      colors: {
        primary: "#172733",
      },
      fontFamily: {
        sans: ["var(--font-source-code)"],
        mono: ["Ubuntu Mono, monospace"],
      },
      minHeight: {
        "1/2": "half",
      },
      maxHeight: {
        48: "12rem",
      },
      aspectRatio: {
        "3/4": "3 / 4",
        "4/3": "4 / 3",
        "4/5": "4 / 5",
      },
      gridTemplateRows: {
        post: "192px minmax(min-content, 1fr)",
        homePosts: "repeat(2, 125px)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(64px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-in",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
