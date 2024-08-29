import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        xxs: "420px",
        xs: "520px",
      },
    },
    extend: {
      screens: {
        xxs: "420px",
        xs: "520px",
      },
      boxShadow: {
        menu: "0px 159px 95px rgba(13,12,34,0.01), 0px 71px 71px rgba(13,12,34,0.02), 0px 18px 39px rgba(13,12,34,0.02), 0px 0px 0px rgba(13,12,34,0.02)",
        searchBar:"0px 8px 20px rgba(0,0,0,0.06)" 
      },
      colors: {
        "nav-border": "#EBEAEA",
        "light-white": "#FAFAFB",
        "light-white-100": "#F1F4F5",
        "light-white-200": "#d7d7d7",
        "light-white-300": "#F3F3F4",
        "light-white-400": "#E2E5F1",
        "light-white-500": "#E4E4E4",
        gray: "#4D4A4A",
        "gray-100": "#3d3d4e",
        "black-100": "#252525",
        "primary-purple": "#9747FF",
        "gray-50": "#D9D9D9",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
