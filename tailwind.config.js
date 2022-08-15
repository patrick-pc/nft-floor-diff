module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'],
  },
}
