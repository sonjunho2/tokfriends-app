// src/components/ChatListItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import Avatar from './Avatar';

export default function ChatListItem({ item, onPress }) {
    const isUnread = item.unread > 0;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, styles.shadow]}>
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          <Avatar name={item.name} size={54} shape="circle" style={styles.avatar} />

          <View style={styles.meta}>
            <View style={styles.titleRow}>
              <Text numberOfLines={1} style={styles.title}>
                {item.name}, {item.age}
              </Text>
              {!!item.points && (
                <View style={styles.pointBadge}>
                  <Text style={styles.pointBadgeTxt}>{item.points}P</Text>
                </View>
              )}
            </View>

            <Text numberOfLines={1} style={styles.preview}>
              {item.snippet}
            </Text>
          </View>
        </View>

        <View style={styles.statusColumn}>
          {item.favorite && (
            <Ionicons name="star" size={18} color="#F9C23C" style={styles.favoriteIcon} />
          )}
          {isUnread ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadTxt}>{item.unread}</Text>
            </View>
                    ) : (
            <Text style={styles.readTxt}>읽음</Text>  
          )}
        </View>
      </View>

      <View style={styles.badgesRow}>
        {!!item.timeLabel && (
          <View style={[styles.badge, styles.timeBadge]}>
            <Ionicons name="time-outline" size={12} color={colors.primary} style={styles.badgeIcon} />
            <Text style={styles.timeText}>{item.timeLabel}</Text>
          </View>
        )}
                 <View style={[styles.badge, styles.locationBadge]}>
          <Ionicons name="location" size={12} color={colors.textSecondary} style={styles.badgeIcon} />
          <Text style={styles.badgeText}>
            {item.regionLabel} · {item.distanceKm}km
          </Text>
        </View> 
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    marginBottom: 8,
  },
  shadow: {
    shadowColor: '#F8A7C1',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 14,
  },
  meta: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  pointBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(243,108,147,0.12)',
  },
  pointBadgeTxt: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  preview: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 12,
    gap: 6,
    minWidth: 42,
  },
  favoriteIcon: {
    marginBottom: 2,
  },
  unreadBadge: {
    minWidth: 26,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadTxt: {
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: '800',
  },
  readTxt: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  timeBadge: {
    backgroundColor: colors.primaryLight,
  },
  timeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  locationBadge: {
    backgroundColor: '#EEF1F8',
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
});
