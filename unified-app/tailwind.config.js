/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    light: '#f1d592',
                    DEFAULT: '#d4af37',
                    dark: '#b8860b',
                },
                dark: {
                    base: '#0a0a0a',
                    card: '#1a1a1a',
                    border: 'rgba(255, 255, 255, 0.1)',
                }
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
