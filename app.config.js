export default ({ config }) => ({
  ...config,
  android: {
    ...(config.android ?? {}),
    package: 'com.sonjunho.ddakchin',
  },
  plugins: [
    ...(config.plugins ?? []),
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '2.0.21',
          gradlePluginVersion: '8.7.2',
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          minSdkVersion: 24
        }
      }
    ]
  ],
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
