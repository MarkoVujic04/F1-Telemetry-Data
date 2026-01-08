/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: "hsl(0 0% 100%)",
                    foreground: "hsl(20 14.3% 4.1%)",
                },
                foreground: "hsl(20 14.3% 4.1%)",

                card: {
                    DEFAULT: "hsl(0 0% 100%)",
                    foreground: "hsl(20 14.3% 4.1%)",
                },
                popover: {
                    DEFAULT: "hsl(0 0% 100%)",
                    foreground: "hsl(20 14.3% 4.1%)",
                },
                primary: {
                    DEFAULT: "hsl(142.1 76.2% 36.3%)",
                    foreground: "hsl(60 9.1% 97.8%)",
                },
                secondary: {
                    DEFAULT: "hsl(60 4.8% 95.9%)",
                    foreground: "hsl(24 9.8% 10%)",
                },
                muted: {
                    DEFAULT: "hsl(60 4.8% 95.9%)",
                    foreground: "hsl(25 5.3% 44.7%)",
                },
                accent: {
                    DEFAULT: "hsl(60 4.8% 95.9%)",
                    foreground: "hsl(24 9.8% 10%)",
                },
                destructive: {
                    DEFAULT: "hsl(0 84.2% 60.2%)",
                    foreground: "hsl(60 9.1% 97.8%)",
                },
                border: "hsl(20 5.9% 90%)",
                input: "hsl(20 5.9% 90%)",
                ring: "hsl(142.1 76.2% 36.3%)",

                chart: {
                    1: "hsl(12 76% 61%)",
                    2: "hsl(173 58% 39%)",
                    3: "hsl(197 37% 24%)",
                    4: "hsl(43 74% 66%)",
                    5: "hsl(27 87% 67%)",
                },

                "dark-background": {
                    DEFAULT: "hsl(20 14.3% 4.1%)",
                    foreground: "hsl(60 9.1% 97.8%)",
                },
                "dark-foreground": "hsl(60 9.1% 97.8%)",

                "dark-card": {
                    DEFAULT: "hsl(20 14.3% 4.1%)",
                    foreground: "hsl(60 9.1% 97.8%)",
                },
                "dark-popover": {
                    DEFAULT: "hsl(20 14.3% 4.1%)",
                    foreground: "hsl(60 9.1% 97.8%)",
                },
                "dark-primary": {
                    DEFAULT: "hsl(142.1 76.2% 36.3%)",
                    foreground: "hsl(60 9.1% 97.8%)",
                },
                "dark-secondary": {
                    DEFAULT: "hsl(12 6.5% 15.1%)",
                    foreground: "hsl(60 9.1% 97.8%)",
                },
                "dark-muted": {
                    DEFAULT: "hsl(12 6.5% 15.1%)",
                    foreground: "hsl(24 5.4% 63.9%)",
                },
                "dark-accent": {
                    DEFAULT: "hsl(12 6.5% 15.1%)",
                    foreground: "hsl(60 9.1% 97.8%)",
                },
                "dark-destructive": {
                    DEFAULT: "hsl(0 72.2% 50.6%)",
                    foreground: "hsl(60 9.1% 97.8%)",
                },
                "dark-border": "hsl(12 6.5% 15.1%)",
                "dark-input": "hsl(12 6.5% 15.1%)",
                "dark-ring": "hsl(142.1 76.2% 36.3%)",
                "dark-chart": {
                    1: "hsl(220 70% 50%)",
                    2: "hsl(160 60% 45%)",
                    3: "hsl(30 80% 55%)",
                    4: "hsl(280 65% 60%)",
                    5: "hsl(340 75% 55%)",
                },
            },

            borderRadius: {
                lg: "0.65rem",
                xl: "0.75rem",
                "2xl": "1rem",
            },
        },
    },
    plugins: [],
};
