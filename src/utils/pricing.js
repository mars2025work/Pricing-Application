// src/utils/pricing.js

export const GST = 0.18;
export const USD_INR = 90;

export const PLANS = {
  standard: { basePrice: 8700, flatDiscount: 1740 },
  custom: { basePrice: 13800, flatDiscount: 3120 },
};

export const MONTHLY_PLANS = {
  standard: { base: 950, discountPct: 0.20 },
  custom: { base: 1420, discountFlat: 280 },
};

export const HR_PLANS = { hr_standard: 90, hr_custom: 120 };

export const SUB_DISCOUNTS = {
  1: 0,
  2: 0.09,
  3: 0.14,
  4: 0.1583329502,
  5: 0.18,
};

export const SUB_DISCOUNTS_CUSTOM = {
  1: 0,
  2: 0.08869565217,
  3: 0.1386956522,
  4: 0.1572463768,
  5: 0.1790217391,
};

export const IMPL_COSTS = {
  25: 95570, 50: 186153, 75: 281723, 100: 332416, 125: 415520,
  150: 498624, 175: 581728, 200: 664831, 225: 747936, 250: 831040,
  275: 914144, 300: 997248,
};

export const PLAN_BENEFITS = {
  standard: {
    icon: '✨',
    title: 'Standard Plan',
    benefits: [
      { text: 'Access to all apps (Except Odoo Studio & Automation)' },
      { text: 'Hosting: Odoo Online only' },
    ],
  },
  custom: {
    icon: '🚀',
    title: 'Custom Plan',
    benefits: [
      { text: 'All apps' },
      { text: 'Odoo Online / Odoo.sh / On-premise' },
      { text: 'Odoo Studio' },
      { text: 'Multi-Company' },
      { text: 'External API' },
    ],
  },
};

// ─── Formatters ───────────────────────────────────────────────────────────────
export const fmtINR = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export const fmtUSD = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export const fmtPct = (n) => n.toFixed(1) + '%';

// ─── Multi-Year Calculation ───────────────────────────────────────────────────
export function getMultiYearCalc(dur, users, planData, isRenewal, planType) {
  const discTable = planType === 'custom' ? SUB_DISCOUNTS_CUSTOM : SUB_DISCOUNTS;
  const y1Base = planData.basePrice * users;
  const flatDisc = isRenewal ? 0 : planData.flatDiscount * users;
  const y1Cost = y1Base - flatDisc;
  const subRate = discTable[dur] || 0;
  const subCostPerUser = planData.basePrice * (1 - subRate);
  const subTotal = dur > 1 ? subCostPerUser * users * (dur - 1) : 0;
  const contractUntaxed = y1Cost + subTotal;
  const nonContractUntaxed = y1Cost + planData.basePrice * users * (dur - 1);
  const savingsAmt = nonContractUntaxed - contractUntaxed;
  const savingsPct = nonContractUntaxed > 0 ? (savingsAmt / nonContractUntaxed) * 100 : 0;
  return {
    contractUntaxed,
    nonContractUntaxed,
    savingsAmt,
    savingsPct,
    y1Base,
    flatDisc,
    y1Cost,
    subRate,
    subCostPerUser,
    subTotal,
  };
}

// ─── License Calculation ─────────────────────────────────────────────────────
export function calcLicenseResult(licType, users, dur, isRenewal) {
  const planData = PLANS[licType];
  const d = getMultiYearCalc(dur, users, planData, isRenewal, licType);
  const tax = d.contractUntaxed * GST;
  const total = d.contractUntaxed + tax;
  const avgYearly = dur > 0 ? total / dur : 0;
  const ncTax = d.nonContractUntaxed * GST;
  const ncFinal = d.nonContractUntaxed + ncTax;
  return { ...d, tax, total, avgYearly, ncTax, ncFinal, planData };
}

// ─── Comparison Calculation ──────────────────────────────────────────────────
export function calcCompResult(compType, users, isRenewal) {
  const planData = PLANS[compType];
  const mp = MONTHLY_PLANS[compType];

  const fyBase = planData.basePrice * users;
  const fyDisc = isRenewal ? 0 : planData.flatDiscount * users;
  const fyNet = fyBase - fyDisc;
  const fyGST = fyNet * GST;
  const fyTotal = fyNet + fyGST;

  const mBase = mp.base * users;
  const mDisc =
    compType === 'standard' ? mBase * mp.discountPct : mp.discountFlat * users;
  const mNet = isRenewal ? mBase : mBase - mDisc;
  const mGST = mNet * GST;
  const mTotal = mNet + mGST;
  const mAnnual = mTotal * 12;

  const savings = mAnnual - fyTotal;
  const savingsPct = fyTotal > 0 ? (savings / fyTotal) * 100 : 0;

  const rYearly = planData.basePrice * users * (1 + GST);
  const rMonthly = mp.base * users * (1 + GST) * 12;

  return {
    fyBase, fyDisc, fyNet, fyGST, fyTotal,
    mBase, mDisc, mNet, mGST, mTotal, mAnnual,
    savings, savingsPct, rYearly, rMonthly,
  };
}

// ─── HR Calculation ───────────────────────────────────────────────────────────
export function calcHrResult(hrType, users) {
  if (users < 50) return null;
  const monthlyRate = HR_PLANS[hrType];
  const monthly = monthlyRate * users;
  const annual = monthly * 12;
  const gst = annual * GST;
  const total = annual + gst;
  return { monthly, annual, gst, total, monthlyRate };
}

// ─── Implementation Calculation ───────────────────────────────────────────────
export function calcImplResult(hours, discPct) {
  const base = IMPL_COSTS[hours] || 0;
  const disc = base * (discPct / 100);
  const net = base - disc;
  const gst = net * GST;
  const total = net + gst;
  return { base, disc, net, gst, total };
}
