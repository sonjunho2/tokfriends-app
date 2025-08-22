// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as SecureStore from 'expo-secure-store';
import { 
 useFonts,
 NotoSansKR_400Regular,
 NotoSansKR_500Medium,
 NotoSansKR_700Bold 
} from '@expo-google-fonts/noto-sans-kr';
import Navigation from './src/navigation';
import authStore from './src/store/auth';
import colors from './src/theme/colors';

export default function App() {
 const [isReady, setIsReady] = useState(false);
 const [fontsLoaded] = useFonts({
   NotoSansKR_400Regular,
   NotoSansKR_500Medium,
   NotoSansKR_700Bold,
 });

 useEffect(() => {
   initializeApp();
 }, []);

 const initializeApp = async () => {
   try {
     // Auth Store 초기화 (토큰 확인 및 자동 로그인)
     await authStore.init();
   } catch (error) {
     console.error('App initialization error:', error);
   } finally {
     setIsReady(true);
   }
 };

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
     <StatusBar 
       style="dark" 
       backgroundColor={colors.backgroundSecondary}
       translucent={false}
     />
     <AuthProvider>
       <Navigation />
     </AuthProvider>
   </View>
 );
}

// AuthProvider 컴포넌트
function AuthProvider({ children }) {
 const [authState, setAuthState] = useState({
   user: authStore.user,
   token: authStore.token,
   loading: authStore.loading,
 });

 useEffect(() => {
   // Auth Store 구독
   const unsubscribe = authStore.subscribe((state) => {
     setAuthState(state);
   });

   return unsubscribe;
 }, []);

 return (
   <AuthContext.Provider value={authState}>
     {children}
   </AuthContext.Provider>
 );
}

// Auth Context 생성
const AuthContext = React.createContext({
 user: null,
 token: null,
 loading: true,
});

// Context Hook export
export const useAuth = () => React.useContext(AuthContext);

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: colors.background,
 },
 loadingContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: colors.background,
 },
});
