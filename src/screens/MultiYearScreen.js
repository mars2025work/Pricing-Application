// src/screens/MultiYearScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors, Radius } from '../theme/colors';
import {
  Card,
  SectionTitle,
  SegmentControl,
  ResultPanel,
  BreakdownBox,
  DurationButtons,
  NumberInput,
  SavingsBadge,
  Toggle,
} from '../components';
import {
  calcLicenseResult,
  fmtINR,
  fmtPct,
  getMultiYearCalc,
  PLANS,
} from '../utils/pricing';

export default function MultiYearScreen() {
  const [licType, setLicType] = useState('standard');
  const [users, setUsers] = useState(10);
  const [duration, setDuration] = useState(1);
  const [isRenewal, setIsRenewal] = useState(false);

  const result = useMemo(
    () => calcLicenseResult(licType, users, duration, isRenewal),
    [licType, users, duration, isRenewal],
  );

  const savingsData = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((i) =>
        getMultiYearCalc(i, users, PLANS[licType], isRenewal, licType),
      ),
    [users, licType, isRenewal],
  );

  const breakdownRows = useMemo(() => {
    const rows = [
      {
        label: `Base Price (${users} users × ${duration} yr${duration > 1 ? 's' : ''})`,
        value: fmtINR(result.planData.basePrice * users * duration),
      },
      {
        label: `Year 1 Discount (${isRenewal ? 'None' : 'Flat'})`,
        value: `-${fmtINR(result.flatDisc)}`,
        highlight: true,
      },
    ];
    if (duration > 1) {
      rows.push({
        label: `Years 2–${duration} (${(result.subRate * 100).toFixed(1)}% discount)`,
        value: fmtINR(result.subTotal),
      });
    }
    rows.push(
      { label: 'Subtotal (excl. GST)', value: fmtINR(result.contractUntaxed) },
      { label: 'GST (18%)', value: fmtINR(result.tax) },
      {
        label: `${duration}-Year Total (incl. GST)`,
        value: fmtINR(result.total),
        bold: true,
      },
    );
    if (duration > 1) {
      rows.push({
        label: 'Average Per Year',
        value: fmtINR(result.avgYearly),
        highlight: true,
      });
    }
    return rows;
  }, [result, users, duration, isRenewal]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      {/* Plan Type */}
      <Card accentColor={Colors.primary}>
        <SectionTitle
          icon="📋"
          title="License Type"
          subtitle="Choose your Odoo plan"
        />
        <SegmentControl
          options={[
            { label: '✨ Standard', value: 'standard' },
            { label: '🚀 Custom', value: 'custom' },
          ]}
          selected={licType}
          onSelect={setLicType}
        />
        <View style={styles.benefitsList}>
          {(licType === 'standard'
            ? ['All apps (excl. Studio & Automation)', 'Odoo Online hosting only']
            : [
                'All apps',
                'Odoo Online / .sh / On-premise',
                'Odoo Studio',
                'Multi-Company',
                'External API',
              ]
          ).map((b, i) => (
            <Text key={i} style={styles.benefitItem}>
              ✓ {b}
            </Text>
          ))}
        </View>
      </Card>

      {/* Users */}
      <Card accentColor={Colors.secondary}>
        <SectionTitle icon="👥" title="Number of Users" />
        <NumberInput
          value={users}
          onChange={setUsers}
          min={1}
          max={9999}
          label="Users"
        />
        <Text style={styles.helperText}>
          Base price: {fmtINR(PLANS[licType].basePrice)} / user / year
        </Text>
      </Card>

      {/* Duration */}
      <Card>
        <SectionTitle icon="📅" title="Contract Duration" />
        <DurationButtons selected={duration} onChange={(y) => {
          setDuration(y);
          if (y > 1) setIsRenewal(false);
        }} />
        {duration === 1 && (
          <Toggle
            label="Renewal Order (no first-year discount)"
            value={isRenewal}
            onChange={setIsRenewal}
          />
        )}
      </Card>

      {/* Result */}
      <ResultPanel
        label={`${duration}-Year Plan Total`}
        value={fmtINR(result.total)}
        subLabel="Avg. per year"
        subValue={fmtINR(result.avgYearly)}
        style={{ backgroundColor: Colors.primary }}
      />

      {/* Breakdown */}
      <Card>
        <Text style={styles.cardSubheading}>Price Breakdown</Text>
        <BreakdownBox rows={breakdownRows} />
      </Card>

      {/* Savings (multi-year only) */}
      {duration > 1 && (
        <Card accentColor={Colors.secondaryDark}>
          <Text style={styles.cardSubheading}>Contract Savings</Text>
          <View style={styles.badgeRow}>
            <SavingsBadge
              label="You Save"
              value={fmtINR(result.savingsAmt)}
              color={Colors.secondary}
            />
            <View style={{ width: 12 }} />
            <SavingsBadge
              label="Saving %"
              value={fmtPct(result.savingsPct)}
              color={Colors.secondary}
            />
          </View>

          <Text style={[styles.cardSubheading, { marginTop: 20 }]}>
            Savings by Duration
          </Text>
          {savingsData.map((d, i) => (
            <View key={i} style={styles.savBar}>
              <Text style={styles.savBarLabel}>{i + 1}Y</Text>
              <View style={styles.savBarTrack}>
                <View
                  style={[
                    styles.savBarFill,
                    { width: `${Math.min(100, d.savingsPct)}%` },
                  ]}
                />
              </View>
              <Text style={styles.savBarPct}>{fmtPct(d.savingsPct)}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* Non-contract comparison (multi-year only) */}
      {duration > 1 && (
        <Card>
          <Text style={styles.cardSubheading}>
            Non-Contract Price ({duration} years)
          </Text>
          <BreakdownBox
            rows={[
              {
                label: 'Non-Contract Total (excl. GST)',
                value: fmtINR(result.nonContractUntaxed),
              },
              { label: 'GST (18%)', value: fmtINR(result.ncTax) },
              {
                label: 'Non-Contract Total (incl. GST)',
                value: fmtINR(result.ncFinal),
                bold: true,
              },
            ]}
          />
        </Card>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBody },
  content: { padding: 16 },
  benefitsList: { marginTop: 8 },
  benefitItem: { fontSize: 13, color: Colors.textMuted, paddingVertical: 3 },
  helperText: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  cardSubheading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 12,
  },
  badgeRow: { flexDirection: 'row', marginBottom: 8 },
  savBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  savBarLabel: {
    width: 24,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  savBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.grayLight,
    overflow: 'hidden',
  },
  savBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  savBarPct: { width: 44, fontSize: 12, fontWeight: '700', color: Colors.primary, textAlign: 'right' },
});
