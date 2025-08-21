// tokfriends-app/src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
 View,
 Text,
 TextInput,
 TouchableOpacity,
 StyleSheet,
 KeyboardAvoidingView,
 Platform,
 ScrollView,
 Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
 const { login } = useAuth();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
   if (!email || !password) {
     Alert.alert('입력 오류', '이메일과 비밀번호를 입력해주세요.');
     return;
   }
   
   setLoading(true);
   const result = await login(email, password);
   setLoading(false);
 };

 return (
   <KeyboardAvoidingView 
     style={styles.container}
     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
   >
     <ScrollView contentContainerStyle={styles.scrollContent}>
       <Text style={styles.title}>TokFriends</Text>
       <Text style={styles.subtitle}>로그인</Text>
       
       <View style={styles.form}>
         <TextInput
           style={styles.input}
           placeholder="이메일"
           placeholderTextColor="#6B7280"
           value={email}
           onChangeText={setEmail}
           keyboardType="email-address"
           autoCapitalize="none"
         />
         
         <TextInput
           style={styles.input}
           placeholder="비밀번호"
           placeholderTextColor="#6B7280"
           value={password}
           onChangeText={setPassword}
           secureTextEntry
         />
         
         <TouchableOpacity 
           style={[styles.button, loading && styles.buttonDisabled]}
           onPress={handleLogin}
           disabled={loading}
         >
           <Text style={styles.buttonText}>
             {loading ? '로그인 중...' : '로그인'}
           </Text>
         </TouchableOpacity>
         
         <TouchableOpacity
           style={styles.linkButton}
           onPress={() => navigation.navigate('Signup')}
         >
           <Text style={styles.linkText}>회원가입</Text>
         </TouchableOpacity>
       </View>
     </ScrollView>
   </KeyboardAvoidingView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#111827',
 },
 scrollContent: {
   flexGrow: 1,
   justifyContent: 'center',
   padding: 20,
 },
 title: {
   fontSize: 32,
   fontFamily: 'NotoSansKR_700Bold',
   color: '#10B981',
   textAlign: 'center',
   marginBottom: 10,
 },
 subtitle: {
   fontSize: 20,
   fontFamily: 'NotoSansKR_500Medium',
   color: '#fff',
   textAlign: 'center',
   marginBottom: 30,
 },
 form: {
   width: '100%',
 },
 input: {
   backgroundColor: '#1F2937',
   borderRadius: 8,
   padding: 15,
   marginBottom: 15,
   color: '#fff',
   fontSize: 16,
   fontFamily: 'NotoSansKR_400Regular',
 },
 button: {
   backgroundColor: '#10B981',
   borderRadius: 8,
   padding: 15,
   alignItems: 'center',
   marginTop: 10,
 },
 buttonDisabled: {
   opacity: 0.6,
 },
 buttonText: {
   color: '#fff',
   fontSize: 16,
   fontFamily: 'NotoSansKR_500Medium',
 },
 linkButton: {
   marginTop: 20,
   alignItems: 'center',
 },
 linkText: {
   color: '#10B981',
   fontSize: 14,
   fontFamily: 'NotoSansKR_400Regular',
 },
});