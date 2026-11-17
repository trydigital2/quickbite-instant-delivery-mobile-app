import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native';
import { LiveOrderTrackerCard } from './src/components/LiveOrderTrackerCard';
import { getSampleActiveDeliveryOrders } from './src/utils/deliveryLogisticsEngine';
import { colors, spacing, typography } from './src/theme';

export default function App() {
  const orders = getSampleActiveDeliveryOrders();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.tag}>QUICKBITE INSTANT LOGISTICS</Text>
          <Text style={styles.title}>Live Order Dispatch</Text>
          <Text style={styles.subtitle}>
            10-20 min quick commerce, dynamic surge pricing & live courier tracking
          </Text>
        </View>

        {orders.map((order) => (
          <LiveOrderTrackerCard key={order.orderId} order={order} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.base,
  },
  header: {
    marginVertical: spacing.lg,
  },
  tag: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
