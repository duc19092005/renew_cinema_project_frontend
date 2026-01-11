/** @type {import('tailwindcss').Config} */
export default {
  // ... các phần khác
  theme: {
    extend: {
      // ... các extend cũ (nếu có)
      animation: {
        'spin-slow': 'spin 8s linear infinite', // Quay chậm
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Nhấp nháy chậm
        'shine': 'shine 1.5s ease-in-out infinite', // Hiệu ứng nút bấm
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}