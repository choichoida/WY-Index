/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Noto Sans KR"', 'sans-serif'],
                number: ['Roboto', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#1A315E', // Deep Blue
                    light: '#2A4575',
                    dark: '#112242',
                },
                accent: {
                    DEFAULT: '#7C3AED', // Welfare Purple
                    light: '#9F67FF',
                    dark: '#5B21B6',
                },
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                }
            }
        },
    },
    plugins: [],
}
