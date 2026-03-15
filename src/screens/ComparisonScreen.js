// src/screens/ComparisonScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Radius } from '../theme/colors';
import {
  Card,
  SectionTitle,
  SegmentControl,
  ResultPanel,
  BreakdownBox,
  NumberInput,
  SavingsBadge,
  Toggle,
} from '../components';
import { calcCompResult, fmtINR, fmtPct, PLANS, MONTHLY_PLANS } from '../utils/pricing';

export default function ComparisonScreen() {
  const [compType, setCompType] = useState('standard');
  const [users, setUsers] = useState(10);
  const [isRenewal, setIsRenewal] = useState(false);

  const r = useMemo(
    () => calcCompResult(compType, users, isRenewal),
    [compType, users, isRenewal],
  );

  const extraCost = r.mAnnual - r.fyTotal;
  const isYearlyBetter = extraCost > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      {/* Plan Type */}
      <Card accentColor={Colors.secondary}>
        <SectionTitle icon="⚖️" title="Plan Comparison" subtitle="Yearly vs Monthly pricing" />
        <SegmentControl
          options={[
            { label: '✨ Standard', value: 'standard' },
            { label: '🚀 Custom', value: 'custom' },
          ]}
          selected={compType}
          onSelect={setCompType}
        />
      </Card>

      {/* Users & Renewal */}
      <Card>
        <SectionTitle icon="👥" title="Users & Order Type" />
        <NumberInput value={users} onChange={setUsers} min={1} max={9999} label="Users" />
        <Toggle
          label="Renewal Order (no first-year discount)"
          value={isRenewal}
          onChange={setIsRenewal}
        />
      </Card>

      {/* Side-by-side result */}
      <View style={styles.dualPanel}>
        <View style={[styles.panelCard, { backgroundColor: Colors.primary }]}>
          <Text style={styles.panelIcon}>💎</Text>
          <Text style={styles.panelLbl}>Yearly Plan</Text>
          <Text style={styles.panelVal}>{fmtINR(r.fyTotal)}</Text>
          <Text style={styles.panelSub}>incl. GST</Text>
        </View>
        <View style={[styles.panelCard, { backgroundColor: Colors.secondary }]}>
          <Text style={styles.panelIcon}>📅</Text>
          <Text style={styles.panelLbl}>Monthly × 12</Text>
          <Text style={styles.panelVal}>{fmtINR(r.mAnnual)}</Text>
          <Text style={styles.panelSub}>incl. GST</Text>
        </View>
      </View>

      {/* Savings banner */}
      <View style={[styles.savBanner, { backgroundColor: isYearlyBetter ? Colors.successBg : Colors.dangerBg }]}>
        <Text style={[styles.savBannerTitle, { color: isYearlyBetter ? Colors.secondary : Colors.danger }]}>
          {isYearlyBetter ? '💡 Yearly saves you' : '⚠️ Monthly costs more by'}
        </Text>
        <Text style={[styles.savBannerAmt, { color: isYearlyBetter ? Colors.secondaryDark : Colors.danger }]}>
          {fmtINR(Math.abs(extraCost))} / year ({fmtPct(Math.abs(r.savingsPct))})
        </Text>
      </View>

      {/* Yearly breakdown */}
      <Card>
        <Text style={styles.cardSubheading}>💎 Yearly Plan Breakdown</Text>
        <BreakdownBox
          rows={[
            { label: `Base (${users} users × ₹${PLANS[compType].basePrice}/user)`, value: fmtINR(r.fyBase) },
            { label: isRenewal ? 'Discount' : 'First-Year Discount', value: `-${fmtINR(r.fyDisc)}`, highlight: true },
            { label: 'Net (excl. GST)', value: fmtINR(r.fyNet) },
            { label: 'GST (18%)', value: fmtINR(r.fyGST) },
            { label: 'Yearly Total (incl. GST)', value: fmtINR(r.fyTotal), bold: true },
            { label: 'Per User / Month', value: fmtINR(r.fyTotal / users / 12), highlight: true },
          ]}
        />
      </Card>

      {/* Monthly breakdown */}
      <Card>
        <Text style={styles.cardSubheading}>📅 Monthly Plan Breakdown (×12)</Text>
        <BreakdownBox
          rows={[
            { label: `Base Rate (${users} users × ₹${MONTHLY_PLANS[compType].base}/user/mo)`, value: fmtINR(r.mBase) },
            { label: isRenewal ? 'Discount' : 'New-Order Discount', value: `-${fmtINR(r.mDisc)}`, highlight: true },
            { label: 'Net / Month (excl. GST)', value: fmtINR(r.mNet) },
            { label: 'GST (18%)', value: fmtINR(r.mGST) },
            { label: 'Monthly Total (incl. GST)', value: fmtINR(r.mTotal) },
            { label: 'Annual Total (× 12)', value: fmtINR(r.mAnnual), bold: true },
          ]}
        />
      </Card>

      {/* Renewal comparison */}
      <Card>
        <Text style={styles.cardSubheading}>🔄 Renewal Year (no discount)</Text>
        <BreakdownBox
          rows={[
            { label: 'Yearly Renewal (incl. GST)', value: fmtINR(r.rYearly) },
            { label: 'Monthly × 12 Renewal (incl. GST)', value: fmtINR(r.rMonthly) },
            {
              label: 'Difference',
              value: fmtINR(Math.abs(r.rMonthly - r.rYearly)),
              bold: true,
              highlight: true,
            },
          ]}
        />
      </Card>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBody },
  content: { padding: 16 },
  dualPanel: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  panelCard: {
    flex: 1,
    borderRadius: Radius.md,
    padding: 16,
    alignItems: 'center',
  },
  panelIcon: { fontSize: 22, marginBottom: 4 },
  panelLbl: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  panelVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  panelSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  savBanner: {
    borderRadius: Radius.md,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  savBannerTitle: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  savBannerAmt: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  cardSubheading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 12,
  },
});
