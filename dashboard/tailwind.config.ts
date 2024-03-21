import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        sleep: "#B4DFD8",
        sleepText: "#8DCEC3",
        sleepHeader: "#51b5a5", // Header colors are 35% darker base color
        physical: "#F9F5E3",
        physicalText: "#F1E7BC",
        physicalHeader: "#dcc45a",
        emotional: "#E4EFFF",
        emotionalText: "#ADCEFF",
        emotionalHeader: "#3b8bff",
        productivity: "#E8DACE",
        productivityText: "#D8C0AC",
        productivityHeader: "#b78b66",
        social: "#FFCBB4",
        socialText: "#FFA985",
        socialHeader: "#ff611c",
      },
      boxShadow: {
        custom: "5px 5px 10px rgb(0 0 0 / 10%)",
      },
    },
  },
  plugins: [],
};
export default config;
