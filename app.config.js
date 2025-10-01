export default ({ config }) => ({
  ...config,
  plugins: [...(config.plugins ?? []), './app.plugin.js'],
  extra: {
    ...(config.extra ?? {}),
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE_URL ??
      config?.extra?.apiBaseUrl ??
      'https://tok-friends-api.onrender.com',
    eas: {
      projectId: 'eb3c1b74-5c41-4ce0-9574-d0d3eb932d72',
    },
  },
});
