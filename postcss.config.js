module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      features: {
        'custom-properties': false
      }
    },
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
};
