export interface GeofenceProximityState {
  riderDistanceMeters: number;
  isWithinHandshakeThreshold: boolean; // <= 200m
  isOtpRevealed: boolean;
  otpCode: string;
  courierName: string;
  courierVehicleNumber: string;
}

export interface HandshakeVerificationResult {
  verified: boolean;
  timestampIso: string;
  verificationHash: string;
  orderDelivered: boolean;
}

/**
 * Computes whether courier has arrived inside the secure 200-meter doorstep geofence.
 */
export function checkGeofenceHandshake(
  riderLat: number,
  riderLon: number,
  customerLat: number,
  customerLon: number
): { distanceMeters: number; isWithinThreshold: boolean } {
  // Haversine formula
  const R = 6371e3; // meters
  const phi1 = (riderLat * Math.PI) / 180;
  const phi2 = (customerLat * Math.PI) / 180;
  const deltaPhi = ((customerLat - riderLat) * Math.PI) / 180;
  const deltaLambda = ((customerLon - riderLon) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceMeters = Math.round(R * c);
  return {
    distanceMeters,
    isWithinThreshold: distanceMeters <= 200,
  };
}

/**
 * Validates 4-digit numeric handshake OTP.
 */
export function verifyDeliveryOtp(
  enteredOtp: string,
  actualOtp: string = '8492'
): HandshakeVerificationResult {
  const verified = enteredOtp === actualOtp;
  return {
    verified,
    timestampIso: new Date().toISOString(),
    verificationHash: verified ? `SIG-VERIF-${Math.random().toString(36).substring(2, 9).toUpperCase()}` : '',
    orderDelivered: verified,
  };
}
