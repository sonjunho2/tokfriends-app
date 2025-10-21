// src/screens/my/SettingsScreen.js
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { user } = useAuth();
  const nickname = user?.nickname || user?.name || '회원님';
  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');

  const balance = useMemo(() => {
    const p = user?.points ?? user?.balance ?? 300;
    if (typeof p === 'number') return p;
    const numeric = parseInt(String(p).replace(/\D/g, ''), 10);
    return Number.isFinite(numeric) ? numeric : 0;
  }, [user]);

  const quickActions = [
    {
      key: 'charge',
      icon: 'card-outline',
      label: '충전하기',
      value: `${balance} P`,
      accent: colors.primary,
    },
    {
      key: 'attendance',
      icon: 'calendar-outline',
      label: '출석체크',
      value: '매일 도전해요',
      accent: '#3B82F6',
    },
    {
      key: 'level',
      icon: 'ribbon-outline',
      label: '푸시알림',
      value: '나이는 상관없어요!',
      accent: '#A855F7',
    },
  ];

  const supportLinks = [
    { key: 'blocked', icon: 'ban-outline', label: '내가 차단한 회원', value: '0명' },
    { key: 'faq', icon: 'help-circle-outline', label: '자주 묻는 질문' },
    { key: 'support', icon: 'chatbubble-ellipses-outline', label: '영자언니에게 문의하기' },
  ];

  const renderQuickAction = (item) => (
    <TouchableOpacity key={item.key} style={styles.quickItem} activeOpacity={0.85}>
      <View style={[styles.quickIcon, { backgroundColor: `${item.accent}1A` }]}> 
        <Ionicons name={item.icon} size={18} color={item.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.quickLabel}>{item.label}</Text>
        {!!item.value && <Text style={styles.quickValue}>{item.value}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  const renderSupportRow = (item) => (
    <TouchableOpacity key={item.key} style={styles.supportRow} activeOpacity={0.85}>
      <Ionicons name={item.icon} size={18} color={colors.textSecondary} style={{ width: 22 }} />
      <Text style={styles.supportLabel}>{item.label}</Text>
      {item.value ? <Text style={styles.supportValue}>{item.value}</Text> : null}
      <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <Avatar size={72} name={nickname} uri={user?.avatar} showBorder style={styles.profileAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{nickname}</Text>
            <Text style={styles.profileMeta}>{user?.location || '서울, 여자 27살'}</Text>
            <Text style={styles.profileNote}>대화친구 필요하신분? 나이는 상관없어요!</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>빠른 설정</Text>
          <View style={styles.card}>{quickActions.map(renderQuickAction)}</View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>환경 설정</Text>
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>푸시알림</Text>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ true: colors.primaryLight, false: '#E5E7EB' }}
                thumbColor={pushEnabled ? colors.primary : '#ffffff'}
              />
            </View>

            <View style={styles.fontRow}>
              <Text style={styles.toggleLabel}>폰트 크기</Text>
              <View style={styles.fontChoiceRow}>
                <TouchableOpacity
                  style={[styles.fontChoice, fontSize === 'medium' && styles.fontChoiceActive]}
                  onPress={() => setFontSize('medium')}
                >
                  <Text style={[styles.fontChoiceText, fontSize === 'medium' && styles.fontChoiceTextActive]}>기본</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.fontChoice, fontSize === 'large' && styles.fontChoiceActive]}
                  onPress={() => setFontSize('large')}
                >
                  <Text style={[styles.fontChoiceText, fontSize === 'large' && styles.fontChoiceTextActive]}>크게</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>다크모드</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ true: colors.textSecondary, false: '#E5E7EB' }}
                thumbColor={darkMode ? '#1F2937' : '#ffffff'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>도움말</Text>
          <View style={styles.card}>{supportLinks.map(renderSupportRow)}</View>
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>그냥 계속 해맑음.</Text>
          <Text style={styles.footerSubtitle}>오늘도 즐거운 하루 보내세요!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  headerSpacer: {
    width: 32,
  },
  profileCard: {
    marginTop: 16,
    marginHorizontal: 18,
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  profileAvatar: {
    borderWidth: 3,
    borderColor: '#F3F4F6',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  profileMeta: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  profileNote: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 18,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  quickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  quickValue: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  fontRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  fontChoiceRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  fontChoice: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  fontChoiceActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  fontChoiceText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  fontChoiceTextActive: {
    color: colors.primary,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  supportLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  supportValue: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 8,
  },
  footerCard: {
    marginTop: 32,
    marginHorizontal: 18,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  footerSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
