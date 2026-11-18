export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM_PRO';

export interface RewardVoucher {
  voucherId: string;
  title: string;
  coinCost: number;
  discountValuePaise: number;
  minOrderValuePaise: number;
  expiryDays: number;
}

export interface UserLoyaltyState {
  userId: string;
  userName: string;
  currentBiteCoinsBalance: number;
  currentStreakDays: number;
  longestStreakDays: number;
  tier: LoyaltyTier;
  coinsEarnedThisMonth: number;
  cashbackMultiplier: number;
  availableVouchers: RewardVoucher[];
}

/**
 * Calculates earned BiteCoins on completed orders based on dynamic tier cashback multipliers.
 * 1 BiteCoin = ₹1 savings on future orders.
 * Bronze = 2%, Silver = 4%, Gold = 6%, Platinum = 8% cashback in coins.
 */
export function calculateOrderBiteCoinsCashback(
  orderTotalPaise: number,
  tier: LoyaltyTier,
  streakDays: number
): { coinsEarned: number; streakBonusCoins: number; totalCoinsCredit: number } {
  const multipliers: Record<LoyaltyTier, number> = {
    BRONZE: 0.02,
    SILVER: 0.04,
    GOLD: 0.06,
    PLATINUM_PRO: 0.08,
  };

  const baseCoins = Math.round((orderTotalPaise / 100) * multipliers[tier]);
  // Streak milestone bonus (e.g. 5+ consecutive days = +15 bonus coins)
  const streakBonusCoins = streakDays >= 7 ? 25 : streakDays >= 3 ? 10 : 0;
  const totalCoinsCredit = baseCoins + streakBonusCoins;

  return {
    coinsEarned: baseCoins,
    streakBonusCoins,
    totalCoinsCredit,
  };
}

export function getSampleLoyaltyProfile(): UserLoyaltyState {
  return {
    userId: 'USR-VIP-9102',
    userName: 'Kewal Singh',
    currentBiteCoinsBalance: 340,
    currentStreakDays: 5,
    longestStreakDays: 14,
    tier: 'GOLD',
    coinsEarnedThisMonth: 120,
    cashbackMultiplier: 1.5,
    availableVouchers: [
      {
        voucherId: 'VCH-50-FLAT',
        title: '₹50 Flat Off on Biryani Central',
        coinCost: 50,
        discountValuePaise: 5000,
        minOrderValuePaise: 29900,
        expiryDays: 7,
      },
      {
        voucherId: 'VCH-FREE-DES',
        title: 'Free Gulab Jamun (2 pcs) with Meals',
        coinCost: 80,
        discountValuePaise: 8000,
        minOrderValuePaise: 34900,
        expiryDays: 10,
      },
      {
        voucherId: 'VCH-120-MEGA',
        title: '₹120 Off Weekend Party Orders',
        coinCost: 120,
        discountValuePaise: 12000,
        minOrderValuePaise: 59900,
        expiryDays: 14,
      },
    ],
  };
}
