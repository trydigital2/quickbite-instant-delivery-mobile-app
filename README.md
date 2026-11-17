# 🍕 QuickBite: Hyperlocal Instant Delivery & Dynamic Surge Dispatch Platform

<div align="center">

  <img src="https://img.shields.io/badge/Platform-React_Native_%7C_Expo-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Language-TypeScript_5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Engine-Hyperlocal_Dispatch-EA580C?style=for-the-badge&logo=fastapi&logoColor=white" alt="Dispatch" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />

  <p align="center">
    <strong>Production-grade 10-20 minute quick commerce delivery architecture, live order state machine, weather/surge fee algorithm, and courier GPS tracking engine.</strong>
  </p>

</div>

---

## 🚀 Key Engineering Capabilities

1. **Deterministic Order Lifecycle State Machine:**
   Models strict finite-state transitions: `ORDER_CONFIRMED` ➔ `KITCHEN_PREPARING` ➔ `RIDER_ASSIGNED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED_SUCCESS`.

2. **Hyperlocal Surge & Rain Weather Multipliers:**
   Dynamic delivery slab calculation incorporates distance ($d > 3.0\text{ km}$ surcharge), rain multipliers ($1.4\times$), small order surcharges ($< \text{₹199}$), and statutory restaurant & delivery GST splits.

3. **Courier Transit Velocity & Accurate ETA:**
   Calculates realistic doorstep arrival ETA based on kitchen prep timers combined with two-wheeler urban road speeds ($v_{\text{urban}} \approx 22\text{ km/h}$).

4. **Secure OTP Handshake:**
   End-to-end 4-digit numeric verification OTP before delivery completion to prevent misdeliveries.

---

## 📐 Mathematical Formulation

### 1. Dynamic Delivery Fee Calculation
$$\text{Fee}_{\text{delivery}} = \left(\text{Base}_{\text{slab}} + \max(0, d - 3.0) \times r_{\text{km}}\right) \times M_{\text{rain}} + S_{\text{peak}}$$

### 2. Live Doorstep ETA
$$\text{ETA}_{\text{remaining}} = T_{\text{prep}} \times (1 - \alpha_{\text{kitchen}}) + \left(\frac{d_{\text{transit}}}{v_{\text{urban}}} \times 60\right)\text{ (minutes)}$$

---

## 📁 Architecture Overview

```
quickbite-instant-delivery-mobile-app/
├── src/
│   ├── components/
│   │   └── LiveOrderTrackerCard.tsx     # Live status stepper & rider calling
│   ├── utils/
│   │   └── deliveryLogisticsEngine.ts   # Surge pricing & ETA mathematics
│   └── theme/
│       └── index.ts                     # Warm saffron delivery design system
├── App.tsx                              # Active orders container
├── package.json
└── tsconfig.json
```

---

## 🛠️ Getting Started

```bash
# Clone the repository
git clone git@github.com:trydigital2/quickbite-instant-delivery-mobile-app.git

# Install dependencies
npm install

# Run on iOS / Android Simulator
npx expo start
```

---

<div align="center">
  <sub>Engineered with precision by <strong>Trydigital</strong> · © 2026 All Rights Reserved</sub>
</div>
