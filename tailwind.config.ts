import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                protoss: {
                    bg: "#0B0F19", // Dark mode background
                    card: "#121726", // Slightly lighter for cards
                    text: "#CBD5E1", // Slate-300 for body
                    accent: {
                        blue: "#00F0FF", // Electric Blue
                        gold: "#FFD700", // Gold
                    },
                    border: "#1E293B",
                },
            },
            fontFamily: {
                mono: ["var(--font-jetbrains-mono)", "monospace"],
                serif: ["var(--font-noto-serif)", "serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;
