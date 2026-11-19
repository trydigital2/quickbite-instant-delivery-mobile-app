export interface MacroNutrients {
  caloriesKcal: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  sodiumMilligrams: number;
}

export interface DietaryCompliance {
  isKetoCompliant: boolean;
  isHighProtein: boolean;
  isGlutenFree: boolean;
  isLowSodium: boolean;
  glycemicIndexTier: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SmartDietarySwap {
  originalItemName: string;
  recommendedSwapName: string;
  caloriesSavedKcal: number;
  proteinAddedGrams: number;
  priceDeltaPaise: number;
}

export interface CartNutritionAnalysis {
  totalMacros: MacroNutrients;
  compliance: DietaryCompliance;
  rdaProteinPercent: number; // Daily Recommended Allowance (approx 55g baseline)
  rdaCaloriesPercent: number; // Approx 2000 kcal baseline
  suggestedSwaps: SmartDietarySwap[];
}

/**
 * Calculates itemized nutritional macros for cart items and suggests smart healthy swaps.
 */
export function analyzeCartMacros(
  items: { name: string; quantity: number; unitPricePaise: number; isVeg: boolean }[]
): CartNutritionAnalysis {
  // Baseline synthetic macronutrient lookup for common order items
  let caloriesKcal = 0;
  let proteinGrams = 0;
  let carbsGrams = 0;
  let fatsGrams = 0;
  let fiberGrams = 0;
  let sodiumMilligrams = 0;

  for (const item of items) {
    const q = item.quantity;
    if (item.name.toLowerCase().includes('biryani')) {
      caloriesKcal += 720 * q;
      proteinGrams += 38 * q;
      carbsGrams += 85 * q;
      fatsGrams += 24 * q;
      fiberGrams += 4 * q;
      sodiumMilligrams += 850 * q;
    } else if (item.name.toLowerCase().includes('naan')) {
      caloriesKcal += 260 * q;
      proteinGrams += 7 * q;
      carbsGrams += 45 * q;
      fatsGrams += 8 * q;
      fiberGrams += 2 * q;
      sodiumMilligrams += 340 * q;
    } else {
      caloriesKcal += 180 * q;
      proteinGrams += 9 * q;
      carbsGrams += 14 * q;
      fatsGrams += 7 * q;
      fiberGrams += 3 * q;
      sodiumMilligrams += 210 * q;
    }
  }

  const rdaProteinPercent = Math.min(100, Math.round((proteinGrams / 55) * 100));
  const rdaCaloriesPercent = Math.min(100, Math.round((caloriesKcal / 2000) * 100));

  const compliance: DietaryCompliance = {
    isKetoCompliant: carbsGrams < 30,
    isHighProtein: proteinGrams > 40,
    isGlutenFree: false,
    isLowSodium: sodiumMilligrams < 1200,
    glycemicIndexTier: carbsGrams > 90 ? 'HIGH' : carbsGrams > 45 ? 'MEDIUM' : 'LOW',
  };

  const suggestedSwaps: SmartDietarySwap[] = [
    {
      originalItemName: 'Garlic Butter Naan',
      recommendedSwapName: 'Multigrain Roti (Tandoori)',
      caloriesSavedKcal: 110,
      proteinAddedGrams: 3,
      priceDeltaPaise: -2000, // ₹20 cheaper
    },
    {
      originalItemName: 'White Dum Rice',
      recommendedSwapName: 'Brown Basmati or Quinoa Bowl',
      caloriesSavedKcal: 85,
      proteinAddedGrams: 5,
      priceDeltaPaise: 3000,
    },
  ];

  return {
    totalMacros: {
      caloriesKcal,
      proteinGrams,
      carbsGrams,
      fatsGrams,
      fiberGrams,
      sodiumMilligrams,
    },
    compliance,
    rdaProteinPercent,
    rdaCaloriesPercent,
    suggestedSwaps,
  };
}
