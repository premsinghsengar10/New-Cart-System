/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // CRED-inspired dark palette
                'cred': {
                    'black': '#0a0a0a',
                    'dark': '#111111',
                    'card': '#1a1a1a',
                    'border': '#2a2a2a',
                    'muted': '#6b7280',
                    'silver': '#e5e5e5',
                    'gold': '#fbbf24',
                }
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.1)' },
                    '100%': { boxShadow: '0 0 40px rgba(251, 191, 36, 0.2)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
