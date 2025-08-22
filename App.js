// App.js — 테스트 화면 선택 토글 래퍼
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Constants from 'expo-constants';

// app.json의 extra에서 토글/화면선택 읽기
const extra =
  (Constants?.expoConfig && Constants.expoConfig.extra) ||
  (Constants?.manifest && Constants.manifest.extra) ||
  {};
// 우선순위: testScreen 값 → 개별 boolean 토글 → 기본(AppRoot)
const screenFromString = typeof extra.testScreen === 'string' ? extra.testScreen.toLowerCase() : null;
const screen =
  screenFromString ||
  (extra.showTestAuthScreen ? 'auth' :
   extra.showTestTopicsScreen ? 'topics' :
   extra.showTestCommunityScreen ? 'community' : null);

// 원래 앱
let AppRoot = () => null;
try {
  AppRoot = require('./src/AppRoot').default || require('./src/AppRoot');
} catch (e) {
  console.warn('AppRoot not found:', e?.message);
}

// 테스트 화면 로더
function Loader({ name }) {
  let Comp = null;
  if (name === 'auth') {
    Comp = require('./src/screens/TestAuthScreen').default;
  } else if (name === 'topics') {
    Comp = require('./src/screens/TestTopicsScreen').default;
  } else if (name === 'community') {
    Comp = require('./src/screens/TestCommunityScreen').default;
  } else {
    return <AppRoot />;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      <Comp />
    </SafeAreaView>
  );
}

export default function App() {
  return screen ? <Loader name={screen} /> : <AppRoot />;
}
