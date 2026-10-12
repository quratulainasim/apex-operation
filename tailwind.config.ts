import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9F8F6',
        foreground: '#5A4A42',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#5A4A42',
          hover: '#EFE9E3',
        },
        surface: {
          50: '#F9F8F6',
          100: '#EFE9E3',
          800: '#D9CFC7',
          850: '#C9B59C',
          900: '#9A8A82',
          950: '#7A6A62',
        },
        primary: {
          DEFAULT: '#C9B59C',
          foreground: '#FFFFFF',
          hover: '#B8A589',
          glow: 'rgba(201, 181, 156, 0.15)',
        },
        secondary: {
          DEFAULT: '#EFE9E3',
          foreground: '#5A4A42',
          hover: '#D9CFC7',
        },
        success: {
          DEFAULT: '#8B9D83',
          foreground: '#FFFFFF',
          glow: 'rgba(139, 157, 131, 0.15)',
        },
        warning: {
          DEFAULT: '#D4A574',
          foreground: '#FFFFFF',
          glow: 'rgba(212, 165, 116, 0.15)',
        },
        danger: {
          DEFAULT: '#C97B7B',
          foreground: '#FFFFFF',
          glow: 'rgba(201, 123, 123, 0.15)',
        },
        ai: {
          DEFAULT: '#A0B4B7',
          foreground: '#FFFFFF',
          glow: 'rgba(160, 180, 183, 0.15)',
        },
        border: 'rgba(201, 181, 156, 0.2)',
        'border-highlight': 'rgba(201, 181, 156, 0.35)',
        muted: '#9A8A82',
      },
      fontFamily: {
        sans: ['Geist Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        'stream-flow': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        'beacon': {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.7)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(245, 158, 11, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(245, 158, 11, 0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'stream-flow': 'stream-flow 1.5s linear infinite',
        'beacon': 'beacon 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};

export default config;
