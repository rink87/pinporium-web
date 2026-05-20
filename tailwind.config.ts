import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        "primary-accent": "var(--primary-accent)",
        "foreground-accent": "var(--foreground-accent)",
        "hero-background": "var(--hero-background)",
        navy: "#2C3345",
        coral: {
          DEFAULT: "#E8734A",
          dark: "#D4612F",
        },
        cream: {
          DEFAULT: "#FFF9F5",
          warm: "#FEF3EC",
          muted: "#F7F0EA",
        },
        gold: {
          DEFAULT: "#F0B961",
          light: "#FFF4DE",
          deco: "#C9A84C",
        },
        deco: {
          dark: "#1A1A2E",
          ink: "#2C3345",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        deco: "0.08em",
        "deco-wide": "0.14em",
      },
      boxShadow: {
        deco: "0 2px 8px rgba(201, 168, 76, 0.2)",
        frame: "inset 0 0 0 1px rgba(201, 168, 76, 0.35), 0 12px 40px rgba(44, 51, 69, 0.12)",
        card: "0 2px 12px rgba(44, 51, 69, 0.08)",
      },
      borderRadius: {
        deco: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
