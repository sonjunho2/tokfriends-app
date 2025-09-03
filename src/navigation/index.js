// src/navigation/index.js
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import colors from '../theme/colors';

/** 네이티브 네비 테마: 앱 배경과 일치시켜 깜빡임 방지 */
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.backgroundSecondary,
    border: colors.border,
    text: colors.textPrimary || '#111827',
    primary: colors.primary,
  },
};

/** 딥링크: app.json의 scheme 과 맞춤 (예: "ddakchin") */
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

export default function Navigation() {
  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <RootNavigator />
    </NavigationContainer>
  );
}
