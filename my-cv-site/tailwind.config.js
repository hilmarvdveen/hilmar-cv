export const content = [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      red: {
        500: "oklch(63.7% .237 25.331)",
        600: "oklch(57.7% .245 27.325)",
      },
      orange: {
        500: "oklch(70.5% .213 47.604)",
      },
      amber: {
        100: "oklch(96.2% .059 95.617)",
        400: "oklch(82.8% .189 84.429)",
        600: "oklch(66.6% .179 58.318)",
        800: "oklch(47.3% .137 46.201)",
      },
      lime: {
        500: "oklch(76.8% .233 130.85)",
      },
      green: {
        500: "oklch(72.3% .219 149.579)",
        700: "oklch(52.7% .154 150.069)",
      },
      emerald: {
        500: "oklch(69.6% .17 162.48)",
        600: "oklch(59.6% .145 163.225)",
        800: "oklch(43.2% .095 166.913)",
      },
      teal: {
        500: "oklch(70.4% .14 182.503)",
        600: "oklch(60% .118 184.704)",
      },
      sky: {
        500: "oklch(68.5% .169 237.323)",
        700: "oklch(50% .134 242.749)",
      },
      blue: {
        100: "oklch(93.2% .032 255.585)",
        500: "oklch(62.3% .214 259.815)",
        600: "oklch(54.6% .245 262.881)",
        700: "oklch(48.8% .243 264.376)",
      },
      purple: {
        500: "oklch(62.7% .265 303.9)",
      },
      fuchsia: {
        500: "oklch(66.7% .295 322.15)",
      },
      pink: {
        300: "oklch(82.3% .12 346.018)",
      },
      gray: {
        500: "oklch(55.1% .027 264.364)",
        800: "oklch(27.8% .033 256.848)",
      },
      neutral: {
        200: "oklch(92.2% 0 0)",
        300: "oklch(87% 0 0)",
      },
      black: "#000",
      white: "#fff",
    },
    fontFamily: {
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
      ],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
    borderRadius: {
      xs: "0.125rem",
      sm: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
    },
    dropShadow: {
      sm: "0 1px 2px #00000026",
    },
    blur: {
      xs: "4px",
      lg: "16px",
      "2xl": "40px",
    },
    transitionTimingFunction: {
      in: "cubic-bezier(.4,0,1,1)",
      out: "cubic-bezier(0,0,.2,1)",
      "in-out": "cubic-bezier(.4,0,.2,1)",
    },
    keyframes: {
      scroll: {
        "0%": { transform: "translateX(0%)" },
        "100%": { transform: "translateX(-50%)" },
      },
    },
    animation: {
      "scroll-infinite": "scroll 30s linear infinite",
    },
  },
  safelist: ["pause"],
};
export const plugins = [];
