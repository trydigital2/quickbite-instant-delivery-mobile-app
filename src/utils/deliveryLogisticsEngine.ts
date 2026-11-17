export type OrderLifecycleState =
  | 'ORDER_CONFIRMED'
  | 'KITCHEN_PREPARING'
  | 'RIDER_ASSIGNED'
  | 'OUT_FOR_DELIVERY'
  | 'REACHED_LOCATION'
  | 'DELIVERED_SUCCESS';

export interface DeliveryRider {
  riderId: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  rating: number;
  currentLat: number;
  currentLon: number;
  isEvVehicle: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPricePaise: number;
  isVeg: boolean;
}

export interface DeliveryCostBreakdown {
  subtotalPaise: number;
  baseDeliveryPaise: number;
  distanceSurchargePaise: number;
  rainSurgeMultiplier: number;
  peakHourSurgePaise: number;
  smallCartFeePaise: number;
  restaurantGstPaise: number;
  deliveryGstPaise: number;
  totalPayablePaise: number;
  formattedTotal: string;
  freeDeliveryThresholdMissingPaise: number;
}

export interface ActiveDeliveryOrder {
  orderId: string;
  restaurantName: string;
  restaurantAddress: string;
  deliveryAddress: string;
  state: OrderLifecycleState;
  items: OrderItem[];
  rider?: DeliveryRider;
  distanceKm: number;
  prepTimeMinutes: number;
  transitTimeMinutes: number;
  placedAtIso: string;
  otpCode: string;
}

/**
 * Computes dynamic delivery pricing with rain, distance, and cart value tiers.
 */
export function calculateDeliveryBillBreakdown(
  items: OrderItem[],
  distanceKm: number,
  options?: { isRaining?: boolean; isPeakDinnerHour?: boolean }
): DeliveryCostBreakdown {
  const subtotalPaise = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPricePaise,
    0
  );

  // Free delivery over ₹500
  const FREE_DELIVERY_THRESHOLD = 50000;
  const isFreeDelivery = subtotalPaise >= FREE_DELIVERY_THRESHOLD;
  const freeDeliveryThresholdMissingPaise = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotalPaise);

  let baseDeliveryPaise = isFreeDelivery ? 0 : 3500; // ₹35 base
  const extraKm = Math.max(0, distanceKm - 3.0);
  let distanceSurchargePaise = isFreeDelivery ? 0 : Math.round(extraKm * 1200); // ₹12/km

  const rainMultiplier = options?.isRaining ? 1.4 : 1.0;
  const peakSurgePaise = options?.isPeakDinnerHour ? 2000 : 0; // ₹20 peak surge

  if (!isFreeDelivery) {
    baseDeliveryPaise = Math.round(baseDeliveryPaise * rainMultiplier);
    distanceSurchargePaise = Math.round(distanceSurchargePaise * rainMultiplier);
  }

  // Small order fee if under ₹199
  const smallCartFeePaise = subtotalPaise < 19900 ? 2500 : 0;

  const totalDeliveryCostPaise = baseDeliveryPaise + distanceSurchargePaise + peakSurgePaise;
  const deliveryGstPaise = Math.round(totalDeliveryCostPaise * 0.18);
  const restaurantGstPaise = Math.round(subtotalPaise * 0.05); // 5% GST on F&B

  const totalPayablePaise =
    subtotalPaise +
    totalDeliveryCostPaise +
    deliveryGstPaise +
    restaurantGstPaise +
    smallCartFeePaise;

  return {
    subtotalPaise,
    baseDeliveryPaise,
    distanceSurchargePaise,
    rainSurgeMultiplier: rainMultiplier,
    peakHourSurgePaise: peakSurgePaise,
    smallCartFeePaise,
    restaurantGstPaise,
    deliveryGstPaise,
    totalPayablePaise,
    formattedTotal: `₹${(totalPayablePaise / 100).toFixed(0)}`,
    freeDeliveryThresholdMissingPaise,
  };
}

/**
 * Calculates estimated ETA minutes from prep duration and road transit distance.
 * Assumes average two-wheeler urban speed = 22 km/h.
 */
export function calculateEstimatedEta(
  state: OrderLifecycleState,
  prepTimeMinutes: number,
  distanceKm: number
): { totalEtaMinutes: number; etaText: string } {
  const transitMinutes = Math.max(6, Math.round((distanceKm / 22) * 60));

  let remainingMinutes = 0;
  let etaText = '';

  switch (state) {
    case 'ORDER_CONFIRMED':
    case 'KITCHEN_PREPARING':
      remainingMinutes = prepTimeMinutes + transitMinutes;
      etaText = `${remainingMinutes} mins (Preparing your fresh meal)`;
      break;
    case 'RIDER_ASSIGNED':
      remainingMinutes = Math.round(prepTimeMinutes * 0.4) + transitMinutes;
      etaText = `${remainingMinutes} mins (Rider waiting at outlet)`;
      break;
    case 'OUT_FOR_DELIVERY':
      remainingMinutes = transitMinutes;
      etaText = `${remainingMinutes} mins (On the way to your door)`;
      break;
    case 'REACHED_LOCATION':
      remainingMinutes = 2;
      etaText = `Arrived! Share OTP with rider`;
      break;
    case 'DELIVERED_SUCCESS':
      remainingMinutes = 0;
      etaText = `Delivered! Enjoy your meal`;
      break;
  }

  return { totalEtaMinutes: remainingMinutes, etaText };
}

export function getSampleActiveDeliveryOrders(): ActiveDeliveryOrder[] {
  return [
    {
      orderId: 'QB-DEL-98421',
      restaurantName: 'Punjab Grill & Biryani Central',
      restaurantAddress: 'Galleria Market, Sector 28, Gurugram',
      deliveryAddress: 'Flat 904, Tower B, Palm Springs, Golf Course Rd',
      state: 'OUT_FOR_DELIVERY',
      distanceKm: 4.2,
      prepTimeMinutes: 14,
      transitTimeMinutes: 11,
      placedAtIso: '2026-11-17T05:30:00Z',
      otpCode: '4892',
      rider: {
        riderId: 'RDR-AMIT-99',
        name: 'Amit Kumar (Urban Fleet)',
        phone: '+91 98711 02941',
        vehicleNumber: 'DL 04 EV 9912',
        rating: 4.91,
        currentLat: 28.4682,
        currentLon: 77.0914,
        isEvVehicle: true,
      },
      items: [
        {
          id: 'ITEM-1',
          name: 'Dum Handi Murg Biryani (1kg Family Pack)',
          quantity: 1,
          unitPricePaise: 54900,
          isVeg: false,
        },
        {
          id: 'ITEM-2',
          name: 'Garlic Butter Naan (2 pcs)',
          quantity: 2,
          unitPricePaise: 9000,
          isVeg: true,
        },
        {
          id: 'ITEM-3',
          name: 'Burani Garlic Raita & Mint Dip',
          quantity: 1,
          unitPricePaise: 6500,
          isVeg: true,
        },
      ],
    },
  ];
}
