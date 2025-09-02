// tokfriends-app/src/navigation/RootNavigator.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import FeedScreen from '../screens/FeedScreen';
import TopicsScreen from '../screens/TopicsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
 return (
   <Stack.Navigator
     screenOptions={{
       headerStyle: { backgroundColor: '#111827' },
       headerTintColor: '#fff',
       headerTitleStyle: { fontFamily: 'NotoSansKR_500Medium' },
     }}
   >
     <Stack.Screen 
       name="Login" 
       component={LoginScreen} 
       options={{ title: '로그인' }}
     />
     <Stack.Screen 
       name="Signup" 
       component={SignupScreen} 
       options={{ title: '회원가입' }}
     />
   </Stack.Navigator>
 );
};

const MainTabs = () => {
 return (
   <Tab.Navigator
     screenOptions={({ route }) => ({
       tabBarIcon: ({ focused, color, size }) => {
         let iconName;
         if (route.name === 'Feed') {
           iconName = focused ? 'home' : 'home-outline';
         } else if (route.name === 'Topics') {
           iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
         } else if (route.name === 'Profile') {
           iconName = focused ? 'person' : 'person-outline';
         }
         return <Ionicons name={iconName} size={size} color={color} />;
       },
       tabBarActiveTintColor: '#10B981',
       tabBarInactiveTintColor: '#9CA3AF',
       tabBarStyle: {
         backgroundColor: '#111827',
         borderTopColor: '#1F2937',
       },
       tabBarLabelStyle: {
         fontFamily: 'NotoSansKR_400Regular',
       },
       headerStyle: {
         backgroundColor: '#111827',
       },
       headerTintColor: '#fff',
       headerTitleStyle: {
         fontFamily: 'NotoSansKR_500Medium',
       },
     })}
   >
     <Tab.Screen 
       name="Feed" 
       component={FeedScreen} 
       options={{ title: '피드' }}
     />
     <Tab.Screen 
       name="Topics" 
       component={TopicsScreen} 
       options={{ title: '토픽' }}
     />
     <Tab.Screen 
       name="Profile" 
       component={ProfileScreen} 
       options={{ title: '프로필' }}
     />
   </Tab.Navigator>
 );
};

export default function RootNavigator() {
 const { token, initializing } = useAuth();

 if (initializing) {
   return (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
       <ActivityIndicator size="large" color="#10B981" />
     </View>
   );
 }

 return token ? <MainTabs /> : <AuthStack />;
}
