// App.js (테스트 화면 토글 래퍼)
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Constants from 'expo-constants';

// app.json의 extra에서 토글 읽기
const extra =
  (Constants?.expoConfig && Constants.expoConfig.extra) ||
  (Constants?.manifest && Constants.manifest.extra) ||
  {};
const showTest = !!extra.showTestAuthScreen;

// 원래 앱 불러오기(방금 백업해둔 파일)
let AppRoot = () => null;
try {
  AppRoot = require('./src/AppRoot').default || require('./src/AppRoot');
} catch (e) {
  console.warn('AppRoot not found:', e?.message);
}

// 테스트 화면 불러오기
function TestScreenWrapper() {
  const TestAuthScreen = require('./src/screens/TestAuthScreen').default;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      <TestAuthScreen />
    </SafeAreaView>
  );
}

export default function App() {
  return showTest ? <TestScreenWrapper /> : <AppRoot />;
}
