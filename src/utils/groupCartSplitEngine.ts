export interface GroupParticipant {
  userId: string;
  name: string;
  avatarEmoji: string;
  isHost: boolean;
  itemSubtotalPaise: number;
  assignedItemsCount: number;
  paymentSharePaise: number;
  formattedShare: string;
  upiPaymentLink: string;
  hasSettled: boolean;
}

export interface GroupOrderSession {
  sessionId: string;
  hostName: string;
  restaurantName: string;
  collectiveSubtotalPaise: number;
  sharedDeliveryFeePaise: number;
  sharedGstPaise: number;
  sharedTipPaise: number;
  totalOrderPayablePaise: number;
  participants: GroupParticipant[];
  lockCutoffTimestampIso: string;
}

/**
 * Calculates itemized pro-rata bill split across group ordering members.
 * Formula for each participant i:
 * Share_i = ItemSubtotal_i + (ItemSubtotal_i / TotalSubtotal) * (Delivery + GST + Tip)
 */
export function calculateGroupProRataSplit(
  participantsItems: { userId: string; name: string; avatarEmoji: string; isHost: boolean; itemSubtotalPaise: number }[],
  deliveryFeePaise: number = 4000,
  gstPaise: number = 8500,
  sharedTipPaise: number = 5000,
  hostUpiId: string = 'trydigital@oksbi'
): GroupParticipant[] {
  const collectiveSubtotal = participantsItems.reduce((acc, p) => acc + p.itemSubtotalPaise, 0);
  const sharedOverheads = deliveryFeePaise + gstPaise + sharedTipPaise;

  return participantsItems.map((p) => {
    let proRataOverhead = 0;
    if (collectiveSubtotal > 0) {
      proRataOverhead = Math.round((p.itemSubtotalPaise / collectiveSubtotal) * sharedOverheads);
    }
    const paymentSharePaise = p.itemSubtotalPaise + proRataOverhead;
    const shareRupees = (paymentSharePaise / 100).toFixed(0);

    const upiPaymentLink = `upi://pay?pa=${encodeURIComponent(hostUpiId)}&pn=${encodeURIComponent(
      'QuickBite Group Order'
    )}&am=${shareRupees}&cu=INR`;

    return {
      userId: p.userId,
      name: p.name,
      avatarEmoji: p.avatarEmoji,
      isHost: p.isHost,
      itemSubtotalPaise: p.itemSubtotalPaise,
      assignedItemsCount: Math.max(1, Math.round(p.itemSubtotalPaise / 18000)),
      paymentSharePaise,
      formattedShare: `₹${shareRupees}`,
      upiPaymentLink,
      hasSettled: p.isHost, // Host pays restaurant upfront
    };
  });
}

export function getSampleGroupSession(): GroupOrderSession {
  const initialItems = [
    { userId: 'USR-1', name: 'Kewal (Host)', avatarEmoji: '🧑‍💻', isHost: true, itemSubtotalPaise: 42000 },
    { userId: 'USR-2', name: 'Rohan Sharma', avatarEmoji: '🍕', isHost: false, itemSubtotalPaise: 29000 },
    { userId: 'USR-3', name: 'Pooja Verma', avatarEmoji: '🥗', isHost: false, itemSubtotalPaise: 35000 },
  ];

  const calculated = calculateGroupProRataSplit(initialItems, 4500, 5300, 3000);
  const total = calculated.reduce((acc, p) => acc + p.paymentSharePaise, 0);

  return {
    sessionId: 'GRP-LUNCH-991',
    hostName: 'Kewal Singh',
    restaurantName: 'Biryani Blues & Kebab Central',
    collectiveSubtotalPaise: 106000,
    sharedDeliveryFeePaise: 4500,
    sharedGstPaise: 5300,
    sharedTipPaise: 3000,
    totalOrderPayablePaise: total,
    participants: calculated,
    lockCutoffTimestampIso: '2026-11-18T06:15:00Z',
  };
}
