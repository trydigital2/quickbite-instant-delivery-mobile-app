import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  CartNutritionAnalysis,
  SmartDietarySwap,
  analyzeCartMacros,
} from '../utils/nutritionMacroEngine';

export const NutritionMacroCard: React.FC = () => {
  const [analysis, setAnalysis] = useState<CartNutritionAnalysis>(
    analyzeCartMacros([
      { name: 'Dum Handi Murg Biryani', quantity: 1, unitPricePaise: 54900, isVeg: false },
      { name: 'Garlic Butter Naan', quantity: 2, unitPricePaise: 9000, isVeg: true },
    ])
  );

  const handleApplySwap = (swap: SmartDietarySwap) => {
    Alert.alert(
      'Healthy Swap Applied!',
      `Replaced "${swap.originalItemName}" with "${swap.recommendedSwapName}". You saved ${swap.caloriesSavedKcal} kcal and boosted protein by +${swap.proteinAddedGrams}g.`
    );
  };

  const { totalMacros, compliance } = analysis;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🥗 SMART NUTRITION & MACROS</Text>
        </View>
        <Text style={styles.calText}>{totalMacros.caloriesKcal} kcal</Text>
      </View>

      <Text style={styles.title}>Cart Macro Breakdown & Health Index</Text>
      <Text style={styles.subtitle}>Nutritional transparency & dietary goal tracker</Text>

      {/* Macro Pills Grid */}
      <View style={styles.macroGrid}>
        <View style={styles.macroCol}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={[styles.macroVal, { color: colors.primary }]}>
            {totalMacros.proteinGrams}g
          </Text>
          <Text style={styles.rdaText}>{analysis.rdaProteinPercent}% RDA</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroCol}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroVal}>{totalMacros.carbsGrams}g</Text>
          <Text style={styles.rdaText}>{compliance.glycemicIndexTier} GI</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroCol}>
          <Text style={styles.macroLabel}>Fats</Text>
          <Text style={styles.macroVal}>{totalMacros.fatsGrams}g</Text>
          <Text style={styles.rdaText}>Healthy Lipids</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroCol}>
          <Text style={styles.macroLabel}>Fiber</Text>
          <Text style={[styles.macroVal, { color: colors.accent }]}>
            {totalMacros.fiberGrams}g
          </Text>
          <Text style={styles.rdaText}>Prebiotic</Text>
        </View>
      </View>

      {/* Compliance Badges */}
      <View style={styles.complianceRow}>
        {compliance.isHighProtein && (
          <View style={styles.compPill}>
            <Text style={styles.compPillText}>💪 High Protein (40g+)</Text>
          </View>
        )}
        <View style={styles.compPill}>
          <Text style={styles.compPillText}>⚡ Sodium {totalMacros.sodiumMilligrams}mg</Text>
        </View>
        <View style={styles.compPill}>
          <Text style={styles.compPillText}>🌾 Medium Carb Index</Text>
        </View>
      </View>

      {/* Smart Dietary Swaps */}
      <Text style={styles.sectionHeading}>Smart Health Swaps</Text>
      <View style={styles.swapList}>
        {analysis.suggestedSwaps.map((s, idx) => (
          <View key={idx} style={styles.swapItem}>
            <View style={styles.swapInfo}>
              <Text style={styles.swapTitle}>Swap with {s.recommendedSwapName}</Text>
              <Text style={styles.swapSub}>
                Save {s.caloriesSavedKcal} kcal • +{s.proteinAddedGrams}g Protein
              </Text>
            </View>
            <TouchableOpacity
              style={styles.swapButton}
              onPress={() => handleApplySwap(s)}
              activeOpacity={0.8}
            >
              <Text style={styles.swapButtonText}>Swap</Text>
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
  calText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.heavy,
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
  macroGrid: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  macroCol: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  macroVal: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginTop: 2,
  },
  rdaText: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 1,
  },
  macroDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  complianceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  compPill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  compPillText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.semibold,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  swapList: {
    gap: 6,
  },
  swapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  swapInfo: {
    flex: 1,
  },
  swapTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  swapSub: {
    fontSize: 10,
    color: colors.accent,
    marginTop: 2,
  },
  swapButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.md,
  },
  swapButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
});
