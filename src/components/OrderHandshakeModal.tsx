import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  checkGeofenceHandshake,
  verifyDeliveryOtp,
} from '../utils/orderHandshakeEngine';

interface OrderHandshakeModalProps {
  orderId?: string;
}

export const OrderHandshakeModal: React.FC<OrderHandshakeModalProps> = ({
  orderId = 'QB-DEL-98421',
}) => {
  const [distance, setDistance] = useState<number>(180); // 180 meters away (inside geofence)
  const [isHandedOver, setIsHandedOver] = useState<boolean>(false);
  const actualOtp = '8492';

  const geofence = checkGeofenceHandshake(28.4682, 77.0914, 28.4695, 77.0921);

  const handleSimulateDelivery = () => {
    const result = verifyDeliveryOtp(actualOtp, actualOtp);
    if (result.verified) {
      setIsHandedOver(true);
      Alert.alert(
        'Delivery Handshake Complete! 🎉',
        `OTP ${actualOtp} accepted. Verification Signature: ${result.verificationHash}. Enjoy your meal!`
      );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>📍 GEOFENCED 4-DIGIT OTP</Text>
        </View>
        <Text style={styles.distText}>{distance}m away</Text>
      </View>

      <Text style={styles.title}>Secure Doorstep Handshake</Text>
      <Text style={styles.subtitle}>
        OTP unlocks automatically when courier reaches within 200m of your door
      </Text>

      {/* OTP Display Box */}
      <View style={styles.otpContainer}>
        <Text style={styles.otpLabel}>Share this OTP with courier:</Text>
        <View style={styles.otpBoxesRow}>
          {actualOtp.split('').map((digit, idx) => (
            <View key={idx} style={styles.digitBox}>
              <Text style={styles.digitText}>{digit}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.otpSecurityNote}>🔒 Encrypted single-use handshake token</Text>
      </View>

      {/* Courier Status */}
      <View style={styles.courierRow}>
        <Text style={styles.courierEmoji}>🛵</Text>
        <View style={styles.courierInfo}>
          <Text style={styles.courierName}>Amit Kumar (DL 04 EV 9912)</Text>
          <Text style={styles.courierSub}>Arrived at building entry gate</Text>
        </View>
        <TouchableOpacity
          style={[styles.verifyBtn, isHandedOver && styles.verifyBtnDone]}
          onPress={handleSimulateDelivery}
          disabled={isHandedOver}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyBtnText}>
            {isHandedOver ? '✓ Verified' : 'Confirm Handover'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: '#ECFDF5',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: '#059669',
    letterSpacing: 0.5,
  },
  distText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.heavy,
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
  otpContainer: {
    backgroundColor: '#FFF7ED',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  otpLabel: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.medium,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: spacing.sm,
  },
  digitBox: {
    width: 44,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  otpSecurityNote: {
    fontSize: 10,
    color: colors.textMuted,
  },
  courierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  courierEmoji: {
    fontSize: 22,
    marginRight: spacing.sm,
  },
  courierInfo: {
    flex: 1,
  },
  courierName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  courierSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  verifyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  verifyBtnDone: {
    backgroundColor: '#10B981',
  },
  verifyBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
});
