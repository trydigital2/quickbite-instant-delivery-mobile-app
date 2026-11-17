import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  ActiveDeliveryOrder,
  OrderLifecycleState,
  calculateDeliveryBillBreakdown,
  calculateEstimatedEta,
} from '../utils/deliveryLogisticsEngine';

interface LiveOrderTrackerCardProps {
  order: ActiveDeliveryOrder;
  onCallRiderPress?: (phone: string) => void;
}

const LIFECYCLE_STEPS: { state: OrderLifecycleState; label: string; icon: string }[] = [
  { state: 'ORDER_CONFIRMED', label: 'Confirmed', icon: '📝' },
  { state: 'KITCHEN_PREPARING', label: 'Kitchen', icon: '🍳' },
  { state: 'RIDER_ASSIGNED', label: 'Assigned', icon: '🛵' },
  { state: 'OUT_FOR_DELIVERY', label: 'On Route', icon: '⚡' },
  { state: 'DELIVERED_SUCCESS', label: 'Delivered', icon: '🎉' },
];

export const LiveOrderTrackerCard: React.FC<LiveOrderTrackerCardProps> = ({
  order,
  onCallRiderPress,
}) => {
  const [currentState, setCurrentState] = useState<OrderLifecycleState>(order.state);
  const etaInfo = calculateEstimatedEta(currentState, order.prepTimeMinutes, order.distanceKm);
  const bill = calculateDeliveryBillBreakdown(order.items, order.distanceKm);

  const getStepIndex = (st: OrderLifecycleState) => {
    return LIFECYCLE_STEPS.findIndex((s) => s.state === st);
  };

  const currentStepIdx = getStepIndex(currentState);

  const handleStepAdvance = () => {
    const nextIdx = Math.min(LIFECYCLE_STEPS.length - 1, currentStepIdx + 1);
    setCurrentState(LIFECYCLE_STEPS[nextIdx].state);
  };

  const handleCallRider = () => {
    if (order.rider) {
      Alert.alert('Calling Courier', `Dialing ${order.rider.name} at ${order.rider.phone}`);
      if (onCallRiderPress) onCallRiderPress(order.rider.phone);
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Banner */}
      <View style={styles.headerRow}>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>🔴 LIVE ORDER • OTP {order.otpCode}</Text>
        </View>
        <Text style={styles.orderIdText}>#{order.orderId}</Text>
      </View>

      <Text style={styles.restaurantName}>{order.restaurantName}</Text>
      <Text style={styles.addressText}>{order.deliveryAddress}</Text>

      {/* ETA Highlight */}
      <View style={styles.etaContainer}>
        <Text style={styles.etaTime}>{etaInfo.totalEtaMinutes} MINS</Text>
        <Text style={styles.etaSubtitle}>{etaInfo.etaText}</Text>
      </View>

      {/* Stepper */}
      <View style={styles.stepperRow}>
        {LIFECYCLE_STEPS.map((step, idx) => {
          const isDone = idx <= currentStepIdx;
          const isCurrent = idx === currentStepIdx;
          return (
            <View key={step.state} style={styles.stepCol}>
              <View
                style={[
                  styles.stepCircle,
                  isDone && styles.stepCircleDone,
                  isCurrent && styles.stepCircleCurrent,
                ]}
              >
                <Text style={styles.stepIcon}>{step.icon}</Text>
              </View>
              <Text style={[styles.stepLabel, isDone && styles.stepLabelDone]}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Rider Info Card */}
      {order.rider && (
        <View style={styles.riderBox}>
          <View style={styles.riderAvatar}>
            <Text style={styles.riderAvatarText}>🛵</Text>
          </View>
          <View style={styles.riderDetails}>
            <Text style={styles.riderName}>{order.rider.name}</Text>
            <Text style={styles.riderSub}>
              {order.rider.vehicleNumber} • {order.rider.isEvVehicle ? '🌱 Green EV' : 'Standard'}
            </Text>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={handleCallRider}>
            <Text style={styles.callButtonText}>📞 Call</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Item Summary */}
      <View style={styles.itemsBox}>
        <Text style={styles.itemsHeader}>Order Items</Text>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemQty}>{item.quantity}x</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>
              ₹{((item.quantity * item.unitPricePaise) / 100).toFixed(0)}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount (Incl. GST)</Text>
          <Text style={styles.totalValue}>{bill.formattedTotal}</Text>
        </View>
      </View>

      {/* Advance simulation button */}
      {currentState !== 'DELIVERED_SUCCESS' && (
        <TouchableOpacity
          style={styles.advanceButton}
          onPress={handleStepAdvance}
          activeOpacity={0.8}
        >
          <Text style={styles.advanceButtonText}>Simulate Next Order Status ➔</Text>
        </TouchableOpacity>
      )}
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
  liveBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  orderIdText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  restaurantName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  addressText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  etaContainer: {
    backgroundColor: '#FFF7ED',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  etaTime: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  etaSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryDark,
    marginTop: 2,
    fontWeight: typography.fontWeight.medium,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  stepCol: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCircleDone: {
    backgroundColor: '#FFEDD5',
  },
  stepCircleCurrent: {
    backgroundColor: colors.primary,
  },
  stepIcon: {
    fontSize: 14,
  },
  stepLabel: {
    fontSize: 9,
    color: colors.textMuted,
  },
  stepLabelDone: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  riderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  riderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  riderAvatarText: {
    fontSize: 18,
  },
  riderDetails: {
    flex: 1,
  },
  riderName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  riderSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  callButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  callButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  itemsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  itemsHeader: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  itemQty: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    width: 24,
  },
  itemName: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    flex: 1,
  },
  itemPrice: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 6,
    paddingTop: 6,
  },
  totalLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  advanceButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  advanceButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
});
