// tokfriends-app/App.tsx
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import LoginScreen from './src/screens/Login';
import DiscoverScreen from './src/screens/Discover';
import FriendRequestsScreen from './src/screens/FriendRequests';
import ChatScreen from './src/screens/Chat';

import { tokenStore } from './src/lib/api';

type RootStackParamList = { Auth: undefined; Main: undefined; };

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarIcon: ({ color, size }) => {
          let name: keyof typeof Ionicons.glyphMap = 'ellipse';
          if (route.name === 'Discover') name = 'search';
          if (route.name === 'FriendRequests') name = 'people';
          if (route.name === 'Chat') name = 'chatbubble-ellipses';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ title: '탐색' }} />
      <Tab.Screen name="FriendRequests" component={FriendRequestsScreen} options={{ title: '친구요청' }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ title: '채팅' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // 초기 토큰 로드
    setAuthed(!!tokenStore.get());
    setBooting(false);
    // 토큰 변경 구독 → 상태 동기화
    const unsub = tokenStore.subscribe((tk) => setAuthed(!!tk));
    return () => { unsub?.(); };
  }, []);

  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authed ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
