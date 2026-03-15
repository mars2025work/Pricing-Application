// src/screens/ImplementationScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Radius } from '../theme/colors';
import { Card, SectionTitle, ResultPanel, BreakdownBox } from '../components';
import { calcImplResult, fmtINR, IMPL_COSTS } from '../utils/pricing';

const HOUR_OPTIONS = Object.keys(IMPL_COSTS).map(Number);
const DISC_OPTIONS = [0, 5, 10, 15, 20, 25, 30];

export default function ImplementationScreen() {
  const [hours, setHours] = useState(25);
  const [discPct, setDiscPct] = useState(15);

  const result = useMemo(() => calcImplResult(hours, discPct), [hours, discPct]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      <Card accentColor={Colors.secondaryDark}>
        <SectionTitle
          icon="🛠️"
          title="Success Pack"
          subtitle="Implementation hours pricing"
        />
        <Text style={styles.sectionLabel}>Pack Size (Hours)</Text>
        <View style={styles.pillsWrap}>
          {HOUR_OPTIONS.map((h) => (
            <TouchableOpacity
              key={h}
              style={[styles.pill, hours === h && styles.pillActive]}
              onPress={() => setHours(h)}
              activeOpacity={0.8}>
              <Text style={[styles.pillText, hours === h && styles.pillTextActive]}>
                {h}h
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle icon="🎁" title="Discount" subtitle="Partner discount applied" />
        <Text style={styles.sectionLabel}>Discount Percentage</Text>
        <View style={styles.pillsWrap}>
          {DISC_OPTIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.pill, discPct === d && styles.pillActiveGreen]}
              onPress={() => setDiscPct(d)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.pillText,
                  discPct === d && styles.pillTextActive,
                ]}>
                {d}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <ResultPanel
        label={`${hours}h Success Pack Total`}
        value={fmtINR(result.total)}
        subLabel="Discount"
        subValue={`${discPct}% (${fmtINR(result.disc)})`}
        style={{ backgroundColor: Colors.secondaryDark }}
      />

      <Card>
        <Text style={styles.cardSubheading}>💰 Price Breakdown</Text>
        <BreakdownBox
          rows={[
            { label: `Success Pack Base (${hours} hours)`, value: fmtINR(result.base) },
            {
              label: `Partner Discount (${discPct}%)`,
              value: `-${fmtINR(result.disc)}`,
              highlight: true,
            },
            { label: 'Net Price (excl. GST)', value: fmtINR(result.net) },
            { label: 'GST (18%)', value: fmtINR(result.gst) },
            {
              label: 'Total (incl. GST)',
              value: fmtINR(result.total),
              bold: true,
            },
          ]}
        />
      </Card>

      <Card>
        <Text style={styles.cardSubheading}>📊 All Pack Sizes (at {discPct}% discount)</Text>
        {HOUR_OPTIONS.map((h) => {
          const r = calcImplResult(h, discPct);
          return (
            <TouchableOpacity
              key={h}
              style={[styles.packRow, h === hours && styles.packRowActive]}
              onPress={() => setHours(h)}
              activeOpacity={0.8}>
              <View style={styles.packRowLeft}>
                <Text style={[styles.packHours, h === hours && { color: Colors.primary }]}>
                  {h}h
                </Text>
                <Text style={styles.packBase}>{fmtINR(r.base)}</Text>
              </View>
              <Text style={[styles.packTotal, h === hours && { color: Colors.primary }]}>
                {fmtINR(r.total)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Card>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBody },
  content: { padding: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    backgroundColor: Colors.grayLighter,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillActiveGreen: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  pillText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  pillTextActive: { color: Colors.white },
  cardSubheading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 12,
  },
  packRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
    marginBottom: 4,
  },
  packRowActive: { backgroundColor: 'rgba(113,75,103,0.08)' },
  packRowLeft: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  packHours: { fontSize: 14, fontWeight: '800', color: Colors.textMain, width: 36 },
  packBase: { fontSize: 12, color: Colors.textMuted },
  packTotal: { fontSize: 14, fontWeight: '700', color: Colors.textMain },
});
