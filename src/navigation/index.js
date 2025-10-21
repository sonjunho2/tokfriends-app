// src/navigation/index.js
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import colors from '../theme/colors';
import { ProfileModalProvider } from '../context/ProfileModalContext';
import GlobalProfileModal from '../components/GlobalProfileModal';

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
      Home: {
        screens: {
          HomeMain: 'home',
          Explore: 'home/explore',
          UniversalList: 'home/list',
          HotRecommend: 'home/hot',
          Profile: 'home/profile',
        },
      },
      Chats: {
        screens: {
          ChatsMain: 'chats',
          ChatRoom: 'chat/:id',
          CreateChatRoom: 'chat/create',
        },
      },
      Shop: 'shop',
      MyPage: {
        screens: {
          MyPageMain: 'mypage',
          Settings: 'mypage/settings',
        },
      },
      Login: 'login',
      Signup: 'signup',
      Welcome: 'welcome',
      Agreement: 'agreement',
      Age: 'age',
      Nickname: 'nickname',
      Gender: 'gender',
      Location: 'location',
      ProfileSetup: 'profile-setup',
    },
  },
};

export default function Navigation() {
  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <ProfileModalProvider>
        <RootNavigator />
        <GlobalProfileModal />
      </ProfileModalProvider>
    </NavigationContainer>
  );
}
