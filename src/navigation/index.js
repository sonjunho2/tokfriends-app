import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import LiveNowScreen from '../screens/main/LiveNowScreen';
import NearbyScreen from '../screens/main/NearbyScreen';
import RecommendScreen from '../screens/main/RecommendScreen';
import ChatsScreen from '../screens/main/ChatsScreen';
import ChatRoomScreen from '../screens/main/ChatRoomScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/** 네이티브 네비 테마: 배경 하얀 깜빡임 방지 */
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background, // 앱 배경과 일치
    card: colors.backgroundSecondary,
    border: colors.border,
    text: colors.textPrimary || '#111827',
    primary: colors.primary,
  },
};

/** 딥링크 설정: app.json의 scheme: "ddakchin" 에 맞춤 */
const linking = {
  prefixes: ['ddakchin://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Home: 'home',
          LiveNow: 'live',
          Nearby: 'nearby',
          Recommend: 'recommend',
          Chats: 'chats',
        },
      },
      ChatRoom: 'chat/:id',
      Profile: 'profile',
      // 비로그인 스택
      Login: 'login',
      Signup: 'signup',
      Welcome: 'welcome',
    },
  },
};

const authScreenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={authScreenOptions}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ellipse';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'LiveNow') iconName = focused ? 'pulse' : 'pulse-outline';
          else if (route.name === 'Nearby') iconName = focused ? 'location' : 'location-outline';
          else if (route.name === 'Recommend') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Chats') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '홈' }} />
      <Tab.Screen name="LiveNow" component={LiveNowScreen} options={{ tabBarLabel: '실시간' }} />
      <Tab.Screen name="Nearby" component={NearbyScreen} options={{ tabBarLabel: '내주변' }} />
      <Tab.Screen name="Recommend" component={RecommendScreen} options={{ tabBarLabel: '추천' }} />
      <Tab.Screen name="Chats" component={ChatsScreen} options={{ tabBarLabel: '채팅' }} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme} linking={linking} fallback={<View style={styles.loadingContainer} />}>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
