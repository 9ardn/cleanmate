import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Legacy brand (kept so non-migrated screens compile)
        brand: { DEFAULT: '#D4824A', dark: '#A35A2B', light: '#F5EDE0' },
        cream: { DEFAULT: '#FAF4EB', dark: '#F5EDE0' },

        // CleanMate pixel-art palette (cool sky / lavender)
        ink: { DEFAULT: '#1F2840', soft: '#4A5570', mute: '#8A92A8' },
        line: { DEFAULT: '#C5CFDD', soft: '#DDE4ED' },
        paper: '#F4F7FB',
        surface: { DEFAULT: '#E8EEF5', deep: '#D8E2EE' },
        moss: { DEFAULT: '#5B8DB8', deep: '#3F6F94', soft: '#BDD3E5' },
        terra: { DEFAULT: '#B886D9', deep: '#8A5FB0', soft: '#DEC5EE' },
        berry: '#D9627A',
        sky: '#87C4DC',
        gold: '#F2C94C',
        state: {
          clean: '#5B8DB8',
          ok: '#F2C94C',
          dirty: '#E8895C',
          critical: '#D9627A',
        },
      },
      fontFamily: {
        sans: [
          '"IBM Plex Sans KR"',
          '"Pretendard Variable"',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Apple SD Gothic Neo"',
          'sans-serif',
        ],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['Caveat', 'cursive'],
      },
      animation: {
        'slide-up': 'slideUp 400ms ease-out',
        'fade-in': 'fadeIn 500ms ease-out',
        'bounce-in': 'bounceIn 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
