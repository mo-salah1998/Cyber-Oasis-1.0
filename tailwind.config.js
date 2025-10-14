/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./script.js",
    "./admin.html",
    "./api/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'desert-night': '#0a0e1a',
        'desert-blue': '#1e293b',
        'desert-orange': '#ea580c',
        'desert-sand': '#f59e0b',
        'desert-gold': '#fbbf24',
        'desert-warm': '#fed7aa',
        'cyber-dark': '#0f172a',
        'cyber-blue': '#1e3a8a',
        'cyber-orange': '#ea580c',
        'cyber-sand': '#f59e0b',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
      },
      backgroundImage: {
        'desert-gradient': 'linear-gradient(135deg, #0a0e1a 0%, #1e293b 50%, #ea580c 100%)',
        'dune-gradient': 'linear-gradient(45deg, #f59e0b 0%, #ea580c 50%, #fbbf24 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #ea580c 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 2s ease-in-out',
        'slide-up': 'slideUp 1.5s ease-out',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'float-1': 'float1 6s ease-in-out infinite',
        'float-2': 'float2 8s ease-in-out infinite',
        'float-3': 'float3 7s ease-in-out infinite',
        'float-4': 'float4 9s ease-in-out infinite',
        'float-5': 'float5 5s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.6' },
        },
        float1: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-5px)' },
          '75%': { transform: 'translateY(-15px) translateX(8px)' },
        },
        float2: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-25px) translateX(-8px)' },
          '66%': { transform: 'translateY(-15px) translateX(12px)' },
        },
        float3: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-30px) translateX(-10px)' },
        },
        float4: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-18px) translateX(15px)' },
          '75%': { transform: 'translateY(-22px) translateX(-12px)' },
        },
        float5: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '40%': { transform: 'translateY(-12px) translateX(6px)' },
          '80%': { transform: 'translateY(-8px) translateX(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
