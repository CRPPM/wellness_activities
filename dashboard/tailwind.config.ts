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
        physical: "#F9F5E3",
        physicalText: "#F1E7BC",
        emotional: "#E4EFFF",
        emotionalText: "#ADCEFF",
        productivity: "#E8DACE",
        productivityText: "#D8C0AC",
        social: "#FFCBB4",
        socialText: "#FFA985",
      },
      boxShadow: {
        custom: "5px 5px 10px rgb(0 0 0 / 10%)",
      },
    },
  },
  plugins: [],
};
export default config;
