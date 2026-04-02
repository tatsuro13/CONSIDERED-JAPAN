import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"],
        jp: ["var(--font-jp)", "Hiragino Kaku Gothic ProN", "sans-serif"],
      },
      aspectRatio: {
        cinematic: "2.40 / 1",
      },
      colors: {
        ink: "#111111",
        paper: "#F8F8F6",
        muted: "#888888",
        border: "#E0E0E0",
      },
      letterSpacing: {
        widest: "0.2em",
        editorial: "0.1em",
      },
    },
  },
  plugins: [],
};

export default config;
