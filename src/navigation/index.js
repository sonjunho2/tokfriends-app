// src/navigation/index.js
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import colors from '../theme/colors';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.backgroundSecondary,
    border: colors.border,
    text: colors.text || '#111827',
    primary: colors.primary,
  },
};

const linking = {
  prefixes: ['ddakchin://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Home: 'home',
          Explore: 'explore',
          Chats: 'chats',
          Shop: 'shop',
          MyPage: 'mypage',
        },
      },
      HotRecommend: 'hot',
      ChatRoom: 'chat/:id',
      Profile: 'profile',
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
