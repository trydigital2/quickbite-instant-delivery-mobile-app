import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  GroupOrderSession,
  GroupParticipant,
  getSampleGroupSession,
} from '../utils/groupCartSplitEngine';

interface GroupCartSplitCardProps {
  onLockAndPay?: (totalPaise: number) => void;
}

export const GroupCartSplitCard: React.FC<GroupCartSplitCardProps> = ({ onLockAndPay }) => {
  const [session, setSession] = useState<GroupOrderSession>(getSampleGroupSession());
  const [locked, setLocked] = useState<boolean>(false);

  const toggleSettle = (userId: string) => {
    setSession((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.userId === userId ? { ...p, hasSettled: !p.hasSettled } : p
      ),
    }));
  };

  const handleCopyUpiLink = (participant: GroupParticipant) => {
    Alert.alert(
      'Payment Link Copied',
      `Payment request of ${participant.formattedShare} for ${participant.name} copied to clipboard (Deep link: ${participant.upiPaymentLink}).`
    );
  };

  const handleLockOrder = () => {
    setLocked(true);
    Alert.alert(
      'Group Order Locked!',
      `Collective total ₹${(session.totalOrderPayablePaise / 100).toFixed(0)} dispatched to ${session.restaurantName}. Payment requests sent to all members.`
    );
    if (onLockAndPay) onLockAndPay(session.totalOrderPayablePaise);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>👥 GROUP ORDER SPLIT</Text>
        </View>
        <Text style={styles.sessionIdText}>#{session.sessionId}</Text>
      </View>

      <Text style={styles.title}>{session.restaurantName}</Text>
      <Text style={styles.subtitle}>Hosted by {session.hostName} • Pro-rata shared fees</Text>

      {/* Financial Overview */}
      <View style={styles.overviewBox}>
        <View style={styles.overviewCol}>
          <Text style={styles.overviewLabel}>Order Total</Text>
          <Text style={styles.overviewVal}>
            ₹{(session.totalOrderPayablePaise / 100).toFixed(0)}
          </Text>
        </View>
        <View style={styles.overviewDivider} />
        <View style={styles.overviewCol}>
          <Text style={styles.overviewLabel}>Shared Overheads</Text>
          <Text style={[styles.overviewVal, { color: colors.primary }]}>
            ₹{((session.sharedDeliveryFeePaise + session.sharedGstPaise + session.sharedTipPaise) / 100).toFixed(0)}
          </Text>
        </View>
        <View style={styles.overviewDivider} />
        <View style={styles.overviewCol}>
          <Text style={styles.overviewLabel}>Members</Text>
          <Text style={styles.overviewVal}>{session.participants.length} Split</Text>
        </View>
      </View>

      {/* Member Cards */}
      <View style={styles.membersList}>
        {session.participants.map((p) => (
          <View key={p.userId} style={styles.memberRow}>
            <Text style={styles.memberEmoji}>{p.avatarEmoji}</Text>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>
                {p.name} {p.isHost && '⭐ (Payer)'}
              </Text>
              <Text style={styles.memberSub}>
                Food: ₹{(p.itemSubtotalPaise / 100).toFixed(0)} + Fees Share
              </Text>
            </View>
            <View style={styles.memberActionCol}>
              <Text style={styles.shareAmount}>{p.formattedShare}</Text>
              <TouchableOpacity
                style={[styles.settleBtn, p.hasSettled && styles.settleBtnDone]}
                onPress={() => (p.isHost ? handleCopyUpiLink(p) : toggleSettle(p.userId))}
              >
                <Text style={styles.settleBtnText}>
                  {p.hasSettled ? '✓ Paid' : 'Request UPI'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Lock and Order Button */}
      <TouchableOpacity
        style={[styles.orderButton, locked && styles.orderButtonLocked]}
        disabled={locked}
        onPress={handleLockOrder}
        activeOpacity={0.8}
      >
        <Text style={styles.orderButtonText}>
          {locked ? '✓ Order Confirmed with Kitchen' : 'Lock Cart & Place Group Order'}
        </Text>
      </TouchableOpacity>
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
    backgroundColor: '#FFF7ED',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  sessionIdText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
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
  overviewBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  overviewCol: {
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  overviewVal: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginTop: 2,
  },
  overviewDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.border,
  },
  membersList: {
    marginBottom: spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  memberEmoji: {
    fontSize: 22,
    marginRight: spacing.sm,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  memberSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  memberActionCol: {
    alignItems: 'flex-end',
  },
  shareAmount: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  settleBtn: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 3,
  },
  settleBtnDone: {
    backgroundColor: '#ECFDF5',
    borderColor: colors.success,
  },
  settleBtnText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  orderButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  orderButtonLocked: {
    backgroundColor: '#10B981',
  },
  orderButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
});
