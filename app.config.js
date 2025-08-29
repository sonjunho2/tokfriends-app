// Expo가 app.json 대신 이 파일을 읽습니다.
// 커스텀 플러그인(app.plugin.js)을 주입하고, API_BASE_URL도 extra로 전달합니다.
export default ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    './app.plugin.js', // ← Gradle wrapper 패치 플러그인
  ],
  extra: {
    ...(config.extra ?? {}),
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE_URL ||
      config?.extra?.apiBaseUrl ||
      'https://tok-friends-api.onrender.com',
  },
});
