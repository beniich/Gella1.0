/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "hsl(260, 80%, 60%)",
                secondary: "hsl(210, 30%, 20%)",
                accent: "hsl(45, 90%, 55%)",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Outfit", "system-ui", "sans-serif"],
            },
            boxShadow: {
                glass: "0 4px 30px rgba(0,0,0,0.1)",
            },
        },
    },
    plugins: [],
};
