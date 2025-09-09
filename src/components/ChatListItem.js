// src/components/ChatListItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import Avatar from './Avatar';

export default function ChatListItem({ item, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.row}>
      {/* 아바타 */}
      <Avatar
        name={item.name}
        size={56}
        shape="rounded"   // ← 이미지와 동일한 라운드 사각형
        style={{ marginRight: 12 }}
      />

      {/* 중앙 */}
      <View style={{ flex: 1 }}>
        <View style={styles.titleLine}>
          <Text numberOfLines={1} style={styles.title}>
            {item.name}, {item.age}
          </Text>
          {!!item.points && <Text style={styles.point}>{item.points}P</Text>}
        </View>

        <Text numberOfLines={1} style={styles.preview}>{item.snippet}</Text>

        <View style={styles.badges}>
          {/* 좌측 핑크 배지 (방금/1시간 등) */}
          {!!item.timeLabel && (
            <View style={[styles.badge, styles.badgePink]}>
              <Text style={styles.badgePinkText}>{item.timeLabel}</Text>
            </View>
          )}
          {/* 위치/거리 */}
          <View style={styles.badge}>
            <Ionicons name="location" size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>
              {item.regionLabel} · {item.distanceKm}km
            </Text>
          </View>
        </View>
      </View>

      {/* 읽음/미읽음 */}
      <View style={{ marginLeft: 8, alignItems: 'flex-end' }}>
        {item.unread > 0 ? (
          <View style={styles.unread}>
            <Text style={styles.unreadTxt}>{item.unread}</Text>
          </View>
        ) : (
          <Text style={styles.readTxt}>읽음</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background, // 리스트 배경과 동일하게
  },
  titleLine: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: colors.text },
  point: { marginLeft: 6, fontSize: 12, fontWeight: '800', color: colors.primary },
  preview: { marginTop: 4, fontSize: 13, color: colors.textSecondary },

  badges: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8, flexWrap: 'wrap' },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#F7F8FA',
  },
  badgeText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  badgePink: { backgroundColor: '#FDE7EE' },
  badgePinkText: { color: colors.primary, fontSize: 12, fontWeight: '800' },

  unread: {
    minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  unreadTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },
  readTxt: { color: colors.textTertiary, fontSize: 12 },
});
