// src/navigation/RootNavigator.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';

// ===== Auth Screens =====
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import AgreementScreen from '../screens/auth/AgreementScreen';
import AgeScreen from '../screens/auth/AgeScreen';
import NicknameScreen from '../screens/auth/NicknameScreen';
import GenderScreen from '../screens/auth/GenderScreen';
import LocationScreen from '../screens/auth/LocationScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

// ===== Main Screens =====
import HomeScreen from '../screens/main/HomeScreen';
import LiveNowScreen from '../screens/main/LiveNowScreen';
import NearbyScreen from '../screens/main/NearbyScreen';
import RecommendScreen from '../screens/main/RecommendScreen';
import ChatsScreen from '../screens/main/ChatsScreen';
import ChatRoomScreen from '../screens/main/ChatRoomScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthFlow() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Agreement" component={AgreementScreen} />
      <Stack.Screen name="Age" component={AgeScreen} />
      <Stack.Screen name="Nickname" component={NicknameScreen} />
      <Stack.Screen name="Gender" component={GenderScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let icon = 'ellipse';
          if (route.name === 'Home') icon = focused ? 'home' : 'home-outline';
          else if (route.name === 'LiveNow') icon = focused ? 'pulse' : 'pulse-outline';
          else if (route.name === 'Nearby') icon = focused ? 'location' : 'location-outline';
          else if (route.name === 'Recommend') icon = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Chats') icon = focused ? 'chatbubbles' : 'chatbubbles-outline';
          return <Ionicons name={icon} size={size} color={color} />;
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

function AppFlow() {
  return (
    <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isSignedIn = !!user && (!!user.id || !!user.token);
  return isSignedIn ? <AppFlow /> : <AuthFlow />;
}
