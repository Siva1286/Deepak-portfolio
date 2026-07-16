import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",
        primary: "#00E5FF",
        secondary: "#8B5CF6",
        accent: "#38BDF8",
        dark: {
          900: "#0B0F19",
          850: "#0F1424",
          800: "#131B30",
          700: "#1D284C",
          600: "#334155",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 229, 255, 0.3)",
        "neon-purple": "0 0 20px rgba(139, 92, 246, 0.3)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
        "glass-glow": "0 8px 32px 0 rgba(0, 229, 255, 0.05)",
      },
      backdropBlur: {
        glass: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
