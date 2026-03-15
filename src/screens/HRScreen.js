// src/screens/HRScreen.js
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
} from '../components';
import { calcHrResult, fmtINR, HR_PLANS } from '../utils/pricing';

export default function HRScreen() {
  const [hrType, setHrType] = useState('hr_standard');
  const [users, setUsers] = useState(50);

  const result = useMemo(() => calcHrResult(hrType, users), [hrType, users]);
  const isError = users < 50;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      <Card accentColor={Colors.primaryDark}>
        <SectionTitle
          icon="👔"
          title="HR Plans"
          subtitle="Human Resources module pricing"
        />
        <SegmentControl
          options={[
            { label: '✨ HR Standard', value: 'hr_standard' },
            { label: '🚀 HR Custom', value: 'hr_custom' },
          ]}
          selected={hrType}
          onSelect={setHrType}
        />
        <View style={styles.rateBox}>
          <Text style={styles.rateLabel}>Monthly Rate / User</Text>
          <Text style={styles.rateValue}>₹{HR_PLANS[hrType]}</Text>
        </View>
      </Card>

      <Card>
        <SectionTitle icon="👥" title="Number of Users" />
        <NumberInput
          value={users}
          onChange={setUsers}
          min={1}
          max={9999}
          label="Users"
        />
        {isError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              ⚠️ HR Plans require a minimum of 50 users
            </Text>
          </View>
        )}
      </Card>

      {!isError && result ? (
        <>
          <ResultPanel
            label="Annual Total (incl. GST)"
            value={fmtINR(result.total)}
            subLabel="Monthly"
            subValue={fmtINR(result.monthly * (1 + 0.18))}
            style={{ backgroundColor: Colors.primaryDark }}
          />

          <Card>
            <Text style={styles.cardSubheading}>💰 Price Breakdown</Text>
            <BreakdownBox
              rows={[
                {
                  label: `Monthly Rate (${users} users × ₹${result.monthlyRate}/user)`,
                  value: fmtINR(result.monthly),
                },
                { label: 'Annual (× 12)', value: fmtINR(result.annual) },
                { label: 'GST (18%)', value: fmtINR(result.gst) },
                {
                  label: 'Annual Total (incl. GST)',
                  value: fmtINR(result.total),
                  bold: true,
                },
              ]}
            />
          </Card>

          <Card>
            <Text style={styles.cardSubheading}>📊 Standard vs Custom Comparison</Text>
            <BreakdownBox
              rows={[
                {
                  label: `HR Standard (${users} users/yr)`,
                  value: fmtINR(calcHrResult('hr_standard', users)?.total || 0),
                },
                {
                  label: `HR Custom (${users} users/yr)`,
                  value: fmtINR(calcHrResult('hr_custom', users)?.total || 0),
                },
                {
                  label: 'Difference (Custom Premium)',
                  value: fmtINR(
                    (calcHrResult('hr_custom', users)?.total || 0) -
                      (calcHrResult('hr_standard', users)?.total || 0),
                  ),
                  bold: true,
                  highlight: true,
                },
              ]}
            />
          </Card>

          <Card style={{ backgroundColor: Colors.grayLighter }}>
            <Text style={styles.infoTitle}>ℹ️ HR Plan Info</Text>
            <Text style={styles.infoText}>
              HR Plans are billed monthly and require a minimum of 50 users.
              The HR module includes Payroll, Leave Management, Appraisals, and
              Attendance tracking.
            </Text>
          </Card>
        </>
      ) : null}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBody },
  content: { padding: 16 },
  rateBox: {
    backgroundColor: Colors.grayLighter,
    borderRadius: Radius.md,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  rateLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  rateValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: Colors.dangerBg,
    borderRadius: Radius.sm,
    padding: 12,
    marginTop: 8,
  },
  errorText: { color: Colors.danger, fontWeight: '600', fontSize: 13 },
  cardSubheading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 8,
  },
  infoText: { fontSize: 13, color: Colors.textMuted, lineHeight: 20 },
});
