/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./App.tsx",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary dark theme colors
        primary: {
          DEFAULT: "#1a1a1a",
          dark: "#0f0f0f",
          light: "#2a2a2a",
        },

        // Surface colors for elevated elements
        surface: {
          DEFAULT: "#2a2a2a",
          elevated: "#3a3a3a",
          subtle: "#333333",
        },

        // Modern accent colors
        accent: {
          DEFAULT: "#4a9eff",
          light: "#64b5f6",
          dark: "#2196f3",
          secondary: "#00bcd4",
        },

        // Text colors with proper contrast
        text: {
          primary: "#ffffff",
          secondary: "#b0b0b0",
          muted: "#808080",
          disabled: "#666666",
        },

        // Status colors
        status: {
          success: "#4caf50",
          warning: "#ff9800",
          error: "#f44336",
          info: "#2196f3",
        },

        // Border colors
        border: {
          DEFAULT: "#404040",
          subtle: "#333333",
          strong: "#666666",
        },

        // Gradient colors
        gradient: {
          start: "#1a1a1a",
          end: "#2a2a2a",
        },

        // Legacy colors (keeping for backward compatibility)
        secondary: "#151312",
        light: {
          100: "#D6C6FF",
          200: "#A8B5DB",
          300: "#9CA4AB",
        },
        dark: {
          100: "#221F3D",
          200: "#0F0D23",
        },
      },

      // Modern spacing scale
      spacing: {
        18: "72px",
        22: "88px",
        26: "104px",
      },

      // Modern border radius
      borderRadius: {
        "4xl": "32px",
        "5xl": "48px",
      },

      // Modern shadows
      boxShadow: {
        "dark-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        "dark-md": "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
        "dark-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
        "dark-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.6)",
      },

      // Modern font sizes
      fontSize: {
        "2xs": "10px",
        "3xl": "32px",
        "4xl": "48px",
      },

      // Animation durations
      transitionDuration: {
        250: "250ms",
        400: "400ms",
      },

      // Modern gradients
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
        "gradient-overlay":
          "linear-gradient(180deg, transparent 0%, rgba(26, 26, 26, 0.8) 100%)",
        "gradient-card": "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)",
      },
    },
  },
  plugins: [],
};
