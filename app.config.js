// app.config.js
// Expo는 이 파일을 최우선으로 읽습니다. (app.json은 사용하지 않음)
export default ({ config }) => ({
  // 앱 기본 정보
  name: 'Ddakchin',                  // ✅ 영문 고정
  slug: 'ddakchin',
  scheme: 'ddakchin',
  version: '1.0.0',
  orientation: 'portrait',

  // 아이콘/스플래시
  icon: './assets/logo.png',
  splash: {
    image: './assets/logo.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },

  assetBundlePatterns: ['**/*'],

  // Android 설정
  android: {
    package: 'com.sonjunho.ddakchin',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#111827',
    },
    permissions: [],
  },

  // iOS 설정
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.sonjunho.ddakchin',
  },

  // 웹 파비콘
  web: {
    favicon: './assets/favicon.png',
  },

  // 플러그인
 plugins: [
  './app.plugin.js',
  [
    'expo-build-properties',
    {
      android: {
        gradlePluginVersion: '8.5.2',
        kotlinVersion: '2.0.0',
        compileSdkVersion: 34,
        targetSdkVersion: 34,
        minSdkVersion: 24,
        // ✅ 문제되는 속성 비활성화
        enableBundleCompression: false
      }
    }
  ]
],

  // EAS/런타임 변수
  extra: {
    eas: {
      projectId: 'eb3c1b74-5c41-4ce0-9574-d0d3eb932d72',
    },
    // 공개 환경변수 우선 → 없으면 기본값
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE_URL ??
      'https://tok-friends-api.onrender.com',
    testScreen: 'auth',
  },
});
