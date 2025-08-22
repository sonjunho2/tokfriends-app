// App.js
import ErrorBoundary from './src/components/ErrorBoundary';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  NotoSansKR_400Regular,
  NotoSansKR_500Medium,
  NotoSansKR_700Bold,
} from '@expo-google-fonts/noto-sans-kr';

import Navigation from './src/navigation';
import colors from './src/theme/colors';
import authStore from './src/store/auth';
import { AuthProvider } from './src/context/AuthContext'; // ✅ 외부 컨텍스트 사용

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    NotoSansKR_400Regular,
    NotoSansKR_500Medium,
    NotoSansKR_700Bold,
  });

  useEffect(() => {
    (async () => {
      try {
        await authStore.init?.();
      } catch (e) {
        console.error('App initialization error:', e);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  if (!fontsLoaded || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={colors.backgroundSecondary} translucent={false} />
      <AuthProvider>
        <ErrorBoundary>
         <Navigation />
        </ErrorBoundary>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
