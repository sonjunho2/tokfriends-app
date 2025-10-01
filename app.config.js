export default ({ config }) => ({
  ...config,
  plugins: [...(config.plugins ?? []), './app.plugin.js'],
  extra: {
    ...(config.extra ?? {}),
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE_URL ??
      config?.extra?.apiBaseUrl ??
      'https://tok-friends-api.onrender.com',
  },
});
