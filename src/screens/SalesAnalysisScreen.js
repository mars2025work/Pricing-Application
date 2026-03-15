// src/screens/SalesAnalysisScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Colors, Radius } from '../theme/colors';
import {
  Card,
  SectionTitle,
  SegmentControl,
  BreakdownBox,
  NumberInput,
  Toggle,
} from '../components';
import {
  calcLicenseResult,
  calcImplResult,
  fmtINR,
  fmtPct,
  PLANS,
  MONTHLY_PLANS,
  IMPL_COSTS,
  GST,
} from '../utils/pricing';

export default function SalesAnalysisScreen() {
  const [tgtMRR, setTgtMRR] = useState('4200');
  const [tgtNRR, setTgtNRR] = useState('4800');
  const [planType, setPlanType] = useState('standard');
  const [users, setUsers] = useState(10);
  const [duration, setDuration] = useState(1);
  const [discPct, setDiscPct] = useState(15);
  const [otherMRR, setOtherMRR] = useState('0');
  const [otherNRR, setOtherNRR] = useState('0');
  const [implHours, setImplHours] = useState(25);
  const [isRenewal, setIsRenewal] = useState(false);

  const licResult = useMemo(
    () => calcLicenseResult(planType, users, duration, isRenewal),
    [planType, users, duration, isRenewal],
  );

  const implResult = useMemo(
    () => calcImplResult(implHours, discPct),
    [implHours, discPct],
  );

  const mrrTarget = parseFloat(tgtMRR) || 0;
  const nrrTarget = parseFloat(tgtNRR) || 0;
  const extraMRR = parseFloat(otherMRR) || 0;
  const extraNRR = parseFloat(otherNRR) || 0;

  // MRR = monthly license equivalent
  const licMonthly = licResult.total / (12 * duration);
  const totalMRR = licMonthly + extraMRR;
  const totalNRR = licResult.total / duration + extraNRR;

  const mrrPct = mrrTarget > 0 ? Math.min(100, (totalMRR / mrrTarget) * 100) : 0;
  const nrrPct = nrrTarget > 0 ? Math.min(100, (totalNRR / nrrTarget) * 100) : 0;

  const dealTotal = licResult.total + implResult.total;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      {/* Targets */}
      <Card accentColor={Colors.secondary}>
        <SectionTitle icon="🎯" title="Revenue Targets" subtitle="Set your MRR & NRR goals" />
        <View style={styles.targetRow}>
          <View style={styles.targetField}>
            <Text style={styles.fieldLabel}>Target MRR (₹)</Text>
            <TextInput
              style={styles.targetInput}
              value={tgtMRR}
              onChangeText={setTgtMRR}
              keyboardType="numeric"
              placeholder="4200"
            />
          </View>
          <View style={styles.targetField}>
            <Text style={styles.fieldLabel}>Target NRR (₹)</Text>
            <TextInput
              style={styles.targetInput}
              value={tgtNRR}
              onChangeText={setTgtNRR}
              keyboardType="numeric"
              placeholder="4800"
            />
          </View>
        </View>
      </Card>

      {/* License config */}
      <Card>
        <SectionTitle icon="📋" title="License Configuration" />
        <SegmentControl
          options={[
            { label: '✨ Standard', value: 'standard' },
            { label: '🚀 Custom', value: 'custom' },
          ]}
          selected={planType}
          onSelect={setPlanType}
        />
        <NumberInput value={users} onChange={setUsers} min={1} label="Users" />
        <Text style={styles.fieldLabel}>Contract Duration</Text>
        <View style={styles.durRow}>
          {[1, 2, 3, 4, 5].map((yr) => (
            <TouchDurBtn
              key={yr}
              yr={yr}
              active={duration === yr}
              onPress={() => {
                setDuration(yr);
                if (yr > 1) setIsRenewal(false);
              }}
            />
          ))}
        </View>
        {duration === 1 && (
          <Toggle label="Renewal Order" value={isRenewal} onChange={setIsRenewal} />
        )}
      </Card>

      {/* Progress */}
      <Card>
        <Text style={styles.cardSubheading}>📊 Target Progress</Text>
        <ProgressBar label="MRR" current={totalMRR} target={mrrTarget} pct={mrrPct} color={Colors.primary} />
        <View style={{ height: 12 }} />
        <ProgressBar label="NRR" current={totalNRR} target={nrrTarget} pct={nrrPct} color={Colors.secondary} />
      </Card>

      {/* Deal Summary */}
      <Card accentColor={Colors.primaryDark}>
        <Text style={styles.cardSubheading}>📝 Deal Summary</Text>
        <BreakdownBox
          rows={[
            {
              label: `License (${duration}yr, ${users} users, ${planType})`,
              value: fmtINR(licResult.total),
            },
            { label: 'Implementation / Success Pack', value: fmtINR(implResult.total) },
            ...(extraMRR > 0 ? [{ label: 'Other MRR (monthly)', value: fmtINR(extraMRR) }] : []),
            ...(extraNRR > 0 ? [{ label: 'Other NRR (annual)', value: fmtINR(extraNRR) }] : []),
            { label: 'Total Deal Value', value: fmtINR(dealTotal), bold: true },
            { label: 'Monthly Equivalent', value: fmtINR(dealTotal / 12), highlight: true },
          ]}
        />
      </Card>

      {/* Other revenue */}
      <Card>
        <SectionTitle icon="➕" title="Additional Revenue" subtitle="Other MRR / NRR sources" />
        <View style={styles.targetRow}>
          <View style={styles.targetField}>
            <Text style={styles.fieldLabel}>Other MRR (₹/mo)</Text>
            <TextInput
              style={styles.targetInput}
              value={otherMRR}
              onChangeText={setOtherMRR}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <View style={styles.targetField}>
            <Text style={styles.fieldLabel}>Other NRR (₹/yr)</Text>
            <TextInput
              style={styles.targetInput}
              value={otherNRR}
              onChangeText={setOtherNRR}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
        </View>
      </Card>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
import { TouchableOpacity } from 'react-native';

const TouchDurBtn = ({ yr, active, onPress }) => (
  <TouchableOpacity
    style={[styles.durBtn, active && styles.durBtnActive]}
    onPress={onPress}
    activeOpacity={0.8}>
    <Text style={[styles.durBtnText, active && styles.durBtnTextActive]}>
      {yr}Y
    </Text>
  </TouchableOpacity>
);

const ProgressBar = ({ label, current, target, pct, color }) => (
  <View>
    <View style={styles.progHeader}>
      <Text style={styles.progLabel}>{label}</Text>
      <Text style={styles.progValues}>
        {fmtINR(current)} / {fmtINR(target)}
      </Text>
      <Text style={[styles.progPct, { color }]}>{fmtPct(pct)}</Text>
    </View>
    <View style={styles.progTrack}>
      <View
        style={[
          styles.progFill,
          { width: `${pct}%`, backgroundColor: color },
        ]}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBody },
  content: { padding: 16 },
  targetRow: { flexDirection: 'row', gap: 12 },
  targetField: { flex: 1 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  targetInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: 10,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textMain,
    backgroundColor: Colors.white,
  },
  cardSubheading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 12,
  },
  progHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  progLabel: { fontSize: 12, fontWeight: '700', color: Colors.textMain, width: 36 },
  progValues: { flex: 1, fontSize: 12, color: Colors.textMuted },
  progPct: { fontSize: 13, fontWeight: '800' },
  progTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.grayLight,
    overflow: 'hidden',
  },
  progFill: { height: '100%', borderRadius: 4 },
  durRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  durBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.sm,
    alignItems: 'center',
    backgroundColor: Colors.grayLighter,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  durBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  durBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  durBtnTextActive: { color: Colors.white },
});
