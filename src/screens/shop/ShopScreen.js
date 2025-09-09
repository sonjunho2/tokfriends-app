import React, { useMemo, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import colors from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const POINT_PACKAGES = [
  { id: 'p300', label: '300P', price: '5,900원' },
  { id: 'p600', label: '600P', price: '11,000원' },
  { id: 'p1200', label: '1200P', price: '17,000원' },
  { id: 'p2700', label: '2700P', price: '31,000원', recommended: true },
  { id: 'p9000', label: '9000P', price: '89,000원' },
  { id: 'p20000', label: '20000P', price: '180,000원' },
];

export default function ShopScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext) || {};
  const balance = useMemo(() => {
    // user?.points 또는 user?.balance 값이 있으면 사용, 없으면 0
    const p = user?.points ?? user?.balance ?? 0;
    return typeof p === 'number' ? p : parseInt(String(p).replace(/\D/g, ''), 10) || 0;
  }, [user]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>상점</Text>
        <View style={styles.pointBadge}>
          <Text style={styles.pointIcon}>P</Text>
          <Text style={styles.pointText}>{balance}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Promo Banner */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerSmall}>+50%의 추가 혜택</Text>
            <Text style={styles.bannerBig}>무통장 계좌결제 시{'\n'}1.5배 더 드려요!</Text>
          </View>
          <TouchableOpacity
            style={styles.bannerCta}
            activeOpacity={0.9}
            onPress={() => {
              // 무통장 스토어 이동(라우팅 이름은 추후 연결)
              // navigation.navigate('BankStore');
            }}
          >
            <Text style={styles.bannerCtaText}>무통장 스토어{'\n'}바로가기</Text>
            <Text style={styles.bannerCtaArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Product List */}
        <View style={{ gap: 14 }}>
          {POINT_PACKAGES.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.rowLeft}>
                <Image
                  source={require('../../assets/point-stack.png')}
                  style={styles.pointImg}
                />
                <Text style={styles.rowLabel}>
                  {item.label}{' '}
                  {item.recommended ? <Text style={styles.reco}>추천</Text> : null}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.buyBtn}
                activeOpacity={0.9}
                onPress={() => {
                  // 결제 플로우 연결 지점
                  // navigation.navigate('Purchase', { productId: item.id });
                }}
              >
                <Text style={styles.buyBtnText}>{item.price}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const RADIUS = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg || '#F7F7FA',
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary || '#222',
  },
  pointBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointIcon: {
    backgroundColor: colors.primary || '#7B61FF',
    color: '#fff',
    width: 22,
    height: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 11,
    fontWeight: '800',
  },
  pointText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary || '#7B61FF',
  },
  scroll: {
    paddingHorizontal: 16,
  },
  banner: {
    backgroundColor: '#D9ECFF',
    borderRadius: RADIUS,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    marginBottom: 18,
  },
  bannerSmall: {
    fontSize: 13,
    color: '#2C6FB8',
    fontWeight: '700',
    marginBottom: 6,
  },
  bannerBig: {
    fontSize: 18,
    color: '#2C6FB8',
    fontWeight: '800',
    lineHeight: 24,
  },
  bannerCta: {
    width: 112,
    backgroundColor: '#ffffff',
    borderRadius: RADIUS,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B7D6F7',
  },
  bannerCtaText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#2C6FB8',
    fontWeight: '700',
  },
  bannerCtaArrow: {
    marginTop: 6,
    fontSize: 22,
    color: '#2C6FB8',
    fontWeight: '800',
    lineHeight: 22,
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: RADIUS,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointImg: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  rowLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary || '#222',
  },
  reco: {
    fontSize: 14,
    color: colors.primary || '#7B61FF',
    fontWeight: '800',
  },
  buyBtn: {
    minWidth: 120,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.primary || '#7B61FF',
    backgroundColor: 'transparent',
  },
  buyBtnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary || '#7B61FF',
  },
});
