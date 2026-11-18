import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  UserLoyaltyState,
  RewardVoucher,
  getSampleLoyaltyProfile,
} from '../utils/loyaltyRewardsEngine';

export const LoyaltyRewardsCard: React.FC = () => {
  const [profile, setProfile] = useState<UserLoyaltyState>(getSampleLoyaltyProfile());

  const handleRedeem = (voucher: RewardVoucher) => {
    if (profile.currentBiteCoinsBalance < voucher.coinCost) {
      Alert.alert('Insufficient BiteCoins', `You need ${voucher.coinCost} BiteCoins to unlock this deal.`);
      return;
    }

    setProfile((prev) => ({
      ...prev,
      currentBiteCoinsBalance: prev.currentBiteCoinsBalance - voucher.coinCost,
    }));

    Alert.alert(
      'Voucher Unlocked! 🎉',
      `Redeemed "${voucher.title}". Code applied automatically at checkout.`
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⭐ {profile.tier} VIP MEMBER</Text>
        </View>
        <Text style={styles.streakText}>🔥 {profile.currentStreakDays}-Day Streak</Text>
      </View>

      <Text style={styles.title}>BiteCoins & Dining Rewards</Text>
      <Text style={styles.subtitle}>Order daily to keep your 1.5x streak multiplier alive</Text>

      {/* Balance Banner */}
      <View style={styles.balanceBanner}>
        <View style={styles.coinIconBox}>
          <Text style={styles.coinIcon}>🪙</Text>
        </View>
        <View style={styles.coinInfo}>
          <Text style={styles.coinCount}>{profile.currentBiteCoinsBalance} Coins</Text>
          <Text style={styles.coinWorth}>Worth ₹{profile.currentBiteCoinsBalance} in order discounts</Text>
        </View>
      </View>

      {/* Streak Tracker Dots */}
      <Text style={styles.sectionHeading}>Weekly Dining Streak (Mon - Sun)</Text>
      <View style={styles.streakDaysRow}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
          const isCompleted = idx < profile.currentStreakDays;
          return (
            <View key={idx} style={styles.dayCol}>
              <View style={[styles.dayCircle, isCompleted && styles.dayCircleDone]}>
                <Text style={[styles.dayCircleText, isCompleted && styles.dayCircleTextDone]}>
                  {isCompleted ? '✓' : day}
                </Text>
              </View>
              <Text style={styles.dayLabel}>{day}</Text>
            </View>
          );
        })}
      </View>

      {/* Redeem Catalog */}
      <Text style={styles.sectionHeading}>Redeem BiteCoins</Text>
      <View style={styles.voucherList}>
        {profile.availableVouchers.map((v) => (
          <View key={v.voucherId} style={styles.voucherItem}>
            <View style={styles.voucherInfo}>
              <Text style={styles.voucherTitle}>{v.title}</Text>
              <Text style={styles.voucherSub}>
                Min order ₹{(v.minOrderValuePaise / 100).toFixed(0)} • Valid {v.expiryDays}d
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.redeemBtn,
                profile.currentBiteCoinsBalance < v.coinCost && styles.redeemBtnDisabled,
              ]}
              onPress={() => handleRedeem(v)}
              disabled={profile.currentBiteCoinsBalance < v.coinCost}
              activeOpacity={0.8}
            >
              <Text style={styles.redeemBtnText}>{v.coinCost} 🪙</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: '#D97706',
    letterSpacing: 0.5,
  },
  streakText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  balanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  coinIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FED7AA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  coinIcon: {
    fontSize: 22,
  },
  coinInfo: {
    flex: 1,
  },
  coinCount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  coinWorth: {
    fontSize: 11,
    color: colors.primaryDark,
    marginTop: 1,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  streakDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: 6,
  },
  dayCol: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayCircleDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayCircleText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.bold,
  },
  dayCircleTextDone: {
    color: colors.white,
  },
  dayLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 4,
  },
  voucherList: {
    gap: 8,
  },
  voucherItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  voucherInfo: {
    flex: 1,
  },
  voucherTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  voucherSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  redeemBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  redeemBtnDisabled: {
    backgroundColor: colors.border,
  },
  redeemBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
});
