// src/components/ChatListItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import Avatar from './Avatar';

export default function ChatListItem({ item = {}, onPress }) {
  // ✅ 호환 레이어: 다른 화면/더미 데이터의 키 이름도 수용
  const name = item.name ?? '';
  const age = item.age ?? item.ageLabel ?? '';
  const points = item.points ?? 0;
  const pinned = !!item.pinned;

  const preview = item.preview ?? item.snippet ?? ''; // 메시지 미리보기
  const lastSeenLabel = item.lastSeenLabel ?? item.timeLabel ?? ''; // 시간 배지
  const regionLabel = item.regionLabel ?? item.region ?? '';
  const distanceKm = item.distanceKm ?? item.distance ?? '';

  const unread = Number(item.unread || 0);
  const online = !!item.online;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.wrap}>
      {/* 아바타 + 온라인 점 */}
      <View style={styles.avatarWrap}>
        <Avatar name={name} size="medium" />
        <View
          style={[
            styles.dot,
            { backgroundColor: online ? '#22C55E' : '#9AA2AF' },
          ]}
        />
      </View>

      {/* 중앙 영역 */}
      <View style={styles.center}>
        {/* 타이틀 줄: 이름, 나이, 포인트, 핀 아이콘 */}
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {name}{age ? `, ${age}` : ''}
          </Text>

          {!!points && <Text style={styles.point}>{points}P</Text>}

          {pinned && (
            <Ionicons name="flag" size={14} color={colors.primary} style={{ marginLeft: 6 }} />
          )}
        </View>

        {/* 미리보기 한 줄 */}
        {!!preview && (
          <Text numberOfLines={1} style={styles.preview}>
            {preview}
          </Text>
        )}

        {/* 배지 줄: 시간, 위치/거리 */}
        <View style={styles.badgeRow}>
          {!!lastSeenLabel && (
            <View style={[styles.badge, styles.badgePink]}>
              <Text style={styles.badgePinkText}>{lastSeenLabel}</Text>
            </View>
          )}

          {(regionLabel || distanceKm !== '') && (
            <View style={styles.badge}>
              <Ionicons name="location" size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>
                {regionLabel}{regionLabel && distanceKm !== '' ? ' · ' : ''}{distanceKm !== '' ? `${distanceKm}km` : ''}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 우측 상태: 미확인/읽음 */}
      <View style={styles.right}>
        {unread > 0 ? (
          <View style={styles.unreadBubble}>
            <Text style={styles.unreadText}>{unread}</Text>
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
    backgroundColor: colors.backgroundSecondary, // ✅ 톤 통일
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10, // ✅ HOT추천 리스트와 동일한 간격감
  },
  avatarWrap: { marginRight: 12 },
  dot: {
    position: 'absolute',
    bottom: 6,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.backgroundSecondary,
  },

  center: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: colors.text },
  point: { marginLeft: 6, fontSize: 12, fontWeight: '800', color: colors.primary },

  preview: { marginTop: 4, fontSize: 13, color: colors.textSecondary },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    // gap은 RN 버전에 따라 미지원일 수 있어 대신 marginRight 사용
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    marginRight: 8, // ← gap 대체
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
