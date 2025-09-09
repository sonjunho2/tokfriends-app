// src/components/ChatListItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import Avatar from './Avatar';

export default function ChatListItem({ item, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.wrap}>
      {/* 아바타 + 온라인 점 */}
      <View style={styles.avatarWrap}>
        <Avatar
          name={item.name}
          size={64}             // ✅ HOT추천/탐색과 동일 크기감
          rounded={14}
          online={item.online}
        />
      </View>

      {/* 중앙 */}
      <View style={styles.center}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {item.name}, {item.age ?? '-'}
          </Text>
          {!!item.points && <Text style={styles.point}>{item.points}P</Text>}
          {item.pinned && (
            <Ionicons name="flag" size={14} color={colors.primary} style={{ marginLeft: 6 }} />
          )}
        </View>

        {!!item.preview && (
          <Text numberOfLines={1} style={styles.preview}>
            {item.preview}
          </Text>
        )}

        <View style={styles.badgeRow}>
          {!!item.lastSeenLabel && (
            <View style={[styles.badge, styles.badgePink]}>
              <Text style={styles.badgePinkText}>{item.lastSeenLabel}</Text>
            </View>
          )}
          <View style={styles.badge}>
            <Ionicons name="location" size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>
              {item.regionLabel ?? '-'} · {item.distanceKm ?? '-'}km
            </Text>
          </View>
        </View>
      </View>

      {/* 우측 상태 */}
      <View style={styles.right}>
        {item.unread > 0 ? (
          <View style={styles.unreadBubble}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        ) : (
          <Text style={styles.readText}>읽음</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  avatarWrap: { marginRight: 12 },

  center: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: colors.text },
  point: { marginLeft: 6, fontSize: 12, fontWeight: '800', color: colors.primary },
  preview: { marginTop: 4, fontSize: 13, color: colors.textSecondary },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  badgePink: { backgroundColor: '#FDE7EE' },
  badgePinkText: { color: colors.primary, fontSize: 12, fontWeight: '800' },

  right: { marginLeft: 8, alignItems: 'flex-end' },
  unreadBubble: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  readText: { color: colors.textTertiary, fontSize: 12 },
});
