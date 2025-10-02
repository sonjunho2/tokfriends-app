app.config.js
export default ({ config }) => {
  const isCI = process.env.EAS_BUILD === 'true' || process.env.CI === 'true';

  return {
    ...config,
    android: {
      ...(config.android ?? {}),
      package: 'com.sonjunho.ddakchin',
    },
    plugins: [
      ...(config.plugins ?? []),
      // EAS/CI에서만 네이티브 빌드 플러그인 적용 (Snack/Web에서는 제외)
      ...(isCI
        ? [
            [
              'expo-build-properties',
              {
                android: {
                  kotlinVersion: '2.0.21',
                  gradlePluginVersion: '8.7.2',
                  compileSdkVersion: 35,
                  targetSdkVersion: 35,
                  minSdkVersion: 24,
                },
              },
            ],
            './app.plugin.js',
          ]
        : []),
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
  };
};

