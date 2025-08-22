// src/components/ErrorBoundary.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.log('[RN_FATAL]', error, info);
  }
  onReload = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <View style={{ flex:1, alignItems:'center', justifyContent:'center', padding:24 }}>
          <Text style={{ fontSize:18, fontWeight:'700', marginBottom:8 }}>문제가 발생했어요</Text>
          <Text style={{ color:'#6b7280', textAlign:'center' }}>
            {String(this.state.error?.message || this.state.error)}
          </Text>
          <Pressable onPress={this.onReload} style={{ marginTop:16, backgroundColor:'#111827', paddingHorizontal:16, paddingVertical:10, borderRadius:8 }}>
            <Text style={{ color:'#fff', fontWeight:'700' }}>다시 시도</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
