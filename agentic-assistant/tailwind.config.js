/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'background': {
                    primary: '#FFFFFF',
                    secondary: '#F9FAFB',
                    tertiary: '#F3F4F6',
                },
                'primary': {
                    DEFAULT: '#2D7FF9',
                    light: '#5B9BFA',
                    dark: '#1B66E5',
                },
                'secondary': {
                    DEFAULT: '#6B7280',
                    light: '#9CA3AF',
                    dark: '#4B5563',
                },
                'accent': {
                    blue: '#60A5FA',
                    indigo: '#818CF8',
                    purple: '#A78BFA',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '26': '6.5rem',
                '34': '8.5rem',
            },
            gridTemplateColumns: {
                'main': '300px 1fr',
            },
            transitionDuration: {
                '200': '200ms',
            },
            borderWidth: {
                'thin': '1px',
            },
        },
    },
    plugins: [],
}
