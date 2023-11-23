module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  plugins: [require.resolve('prettier-plugin-astro')],
  tabWidth: 2,
  useTabs: true,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
