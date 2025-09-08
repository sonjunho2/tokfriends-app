// src/navigation/RootNavigator.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';

// ===== 메인 탭 =====
import HomeScreen from '../screens/main/HomeScreen';
import ExploreScreen from '../screens/explore/ExploreScreen';
import ChatsScreen from '../screens/main/ChatsScreen';
import ShopScreen from '../screens/shop/ShopScreen';
import MyPageScreen from '../screens/my/MyPageScreen';

// ===== 스택 푸시 =====
import HotRecommendScreen from '../screens/recommend/HotRecommendScreen';
import ChatRoomScreen from '../screens/main/ChatRoomScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// ===== 인증 플로우 =====
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import AgreementScreen from '../screens/auth/AgreementScreen';
import AgeScreen from '../screens/auth/AgeScreen';
import NicknameScreen from '../screens/auth/NicknameScreen';
import GenderScreen from '../screens/auth/GenderScreen';
import LocationScreen from '../screens/auth/LocationScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap = {
            Home: focused ? 'people' : 'people-outline',
            Explore: focused ? 'compass' : 'compass-outline',
            Chats: focused ? 'chatbubbles' : 'chatbubbles-outline',
            Shop: focused ? 'bag' : 'bag-outline',
            MyPage: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '홈' }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ tabBarLabel: '탐색' }} />
      <Tab.Screen name="Chats" component={ChatsScreen} options={{ tabBarLabel: '대화' }} />
      <Tab.Screen name="Shop" component={ShopScreen} options={{ tabBarLabel: '상점' }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ tabBarLabel: '마이페이지' }} />
    </Tab.Navigator>
  );
}

function AppFlow() {
  return (
    <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="HotRecommend" component={HotRecommendScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, token, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ✅ 핵심 수정: "토큰만 있어도" 로그인된 것으로 간주
  const hasToken = !!token;
  const hasUser = !!user && (user.id != null || user._id != null);
  const isSignedIn = hasToken || hasUser;

  return isSignedIn ? <AppFlow /> : <AuthFlow />;
}
