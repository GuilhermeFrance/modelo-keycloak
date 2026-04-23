/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pmvc: {
          blue: '#1660AB',
          lightBlue: '#2B7BC9',
          accent: '#006BA6',
          dark: '#1E2939',
          gray: '#4A5565',
          bg: '#F3F4F6',
          input: '#F9FAFB',
          rose: '#D81B60',
          yellow: '#FCD116',
          footerBg: '#050A0F',
          footerCard: '#0D1520',
        },
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
//   theme: {
//     extend: {
//       colors: {
//         // Cores Institucionais (Cidadão/Portal)
//         pmvc: {
//           blue: '#1660AB',
//           lightBlue: '#2B7BC9',
//           dark: '#1E2939',
//           gray: '#4A5565',
//           bg: '#F3F4F6',
//           input: '#F9FAFB',
//         },
//       },
//       keyframes: {
//         fadeInUp: {
//           '0%': { opacity: '0', transform: 'translateY(20px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//         fadeInDown: {
//           '0%': { opacity: '0', transform: 'translateY(-20px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//       },
//       animation: {
//         'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
//         'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
//       },
//     },
//   },
//   plugins: [],
// };
