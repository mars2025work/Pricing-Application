// src/components/index.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Colors, Radius, Shadows } from '../theme/colors';

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style, accentColor }) => (
  <View style={[styles.card, style]}>
    {accentColor && (
      <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />
    )}
    {children}
  </View>
);

// ─── Section Title ────────────────────────────────────────────────────────────
export const SectionTitle = ({ icon, title, subtitle }) => (
  <View style={styles.sectionTitleWrap}>
    <Text style={styles.sectionIcon}>{icon}</Text>
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  </View>
);

// ─── Segment Control ──────────────────────────────────────────────────────────
export const SegmentControl = ({ options, selected, onSelect }) => (
  <View style={styles.segWrap}>
    {options.map((opt) => (
      <TouchableOpacity
        key={opt.value}
        style={[styles.segBtn, selected === opt.value && styles.segBtnActive]}
        onPress={() => onSelect(opt.value)}
        activeOpacity={0.8}>
        <Text
          style={[
            styles.segBtnText,
            selected === opt.value && styles.segBtnTextActive,
          ]}>
          {opt.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Result Panel ─────────────────────────────────────────────────────────────
export const ResultPanel = ({ label, value, subLabel, subValue, style }) => (
  <View style={[styles.resultPanel, style]}>
    <Text style={styles.resultLabel}>{label}</Text>
    <Text style={styles.resultValue}>{value}</Text>
    {subLabel ? (
      <Text style={styles.resultSub}>
        {subLabel}: {subValue}
      </Text>
    ) : null}
  </View>
);

// ─── Info Row ─────────────────────────────────────────────────────────────────
export const InfoRow = ({ label, value, bold, highlight }) => (
  <View style={[styles.infoRow, bold && styles.infoRowBold]}>
    <Text style={[styles.infoLabel, bold && styles.infoLabelBold]}>{label}</Text>
    <Text
      style={[
        styles.infoValue,
        bold && styles.infoValueBold,
        highlight && { color: Colors.secondary },
      ]}>
      {value}
    </Text>
  </View>
);

// ─── Duration Buttons ─────────────────────────────────────────────────────────
export const DurationButtons = ({ selected, onChange }) => (
  <View style={styles.durWrap}>
    {[1, 2, 3, 4, 5].map((yr) => (
      <TouchableOpacity
        key={yr}
        style={[styles.durBtn, selected === yr && styles.durBtnActive]}
        onPress={() => onChange(yr)}
        activeOpacity={0.8}>
        <Text
          style={[
            styles.durBtnText,
            selected === yr && styles.durBtnTextActive,
          ]}>
          {yr}Y
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Number Input ─────────────────────────────────────────────────────────────
export const NumberInput = ({ value, onChange, min, max, label }) => (
  <View style={styles.numInputWrap}>
    {label ? <Text style={styles.numInputLabel}>{label}</Text> : null}
    <View style={styles.numInputRow}>
      <TouchableOpacity
        style={styles.numBtn}
        onPress={() => onChange(Math.max(min || 1, (parseInt(value) || 1) - 1))}>
        <Text style={styles.numBtnText}>−</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.numInputField}
        value={String(value)}
        onChangeText={(t) => {
          const n = parseInt(t);
          if (!isNaN(n)) onChange(Math.max(min || 1, Math.min(max || 9999, n)));
        }}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.numBtn}
        onPress={() =>
          onChange(Math.min(max || 9999, (parseInt(value) || 1) + 1))
        }>
        <Text style={styles.numBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Savings Badge ────────────────────────────────────────────────────────────
export const SavingsBadge = ({ label, value, color }) => (
  <View style={[styles.savBadge, { borderColor: color || Colors.secondary }]}>
    <Text style={styles.savBadgeVal}>{value}</Text>
    <Text style={styles.savBadgeLbl}>{label}</Text>
  </View>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────
export const Toggle = ({ label, value, onChange }) => (
  <TouchableOpacity
    style={styles.toggleWrap}
    onPress={() => onChange(!value)}
    activeOpacity={0.8}>
    <View style={[styles.toggleTrack, value && styles.toggleTrackOn]}>
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </View>
    <Text style={styles.toggleLabel}>{label}</Text>
  </TouchableOpacity>
);

// ─── Breakdown Box ────────────────────────────────────────────────────────────
export const BreakdownBox = ({ rows }) => (
  <View style={styles.breakdownBox}>
    {rows.map((row, i) => (
      <InfoRow
        key={i}
        label={row.label}
        value={row.value}
        bold={row.bold}
        highlight={row.highlight}
      />
    ))}
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  sectionIcon: { fontSize: 28 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textMain,
    letterSpacing: -0.4,
  },
  sectionSubtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },

  // Segment
  segWrap: {
    flexDirection: 'row',
    backgroundColor: Colors.grayLighter,
    borderRadius: Radius.pill,
    padding: 4,
    marginBottom: 16,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: Radius.pill,
    alignItems: 'center',
  },
  segBtnActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  segBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  segBtnTextActive: { color: Colors.white },

  // Result Panel
  resultPanel: {
    borderRadius: Radius.md,
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.white,
    marginVertical: 6,
    letterSpacing: -1,
  },
  resultSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLighter,
  },
  infoRowBold: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 4,
    paddingTop: 12,
  },
  infoLabel: { fontSize: 13, color: Colors.textMuted, flex: 1, paddingRight: 8 },
  infoLabelBold: { fontWeight: '700', color: Colors.textMain },
  infoValue: { fontSize: 13, color: Colors.textMain, fontWeight: '600' },
  infoValueBold: { fontWeight: '800', color: Colors.textMain },

  // Duration
  durWrap: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  durBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.sm,
    alignItems: 'center',
    backgroundColor: Colors.grayLighter,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  durBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  durBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  durBtnTextActive: { color: Colors.white },

  // Number Input
  numInputWrap: { marginBottom: 16 },
  numInputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  numInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  numBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.grayLighter,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numBtnText: { fontSize: 20, fontWeight: '600', color: Colors.primary },
  numInputField: {
    flex: 1,
    height: 44,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textMain,
    paddingHorizontal: 8,
  },

  // Savings Badge
  savBadge: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    padding: 14,
    alignItems: 'center',
    flex: 1,
  },
  savBadgeVal: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textMain,
    letterSpacing: -0.5,
  },
  savBadgeLbl: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },

  // Toggle
  toggleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  toggleTrack: {
    width: 48,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackOn: { backgroundColor: Colors.primary },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  toggleThumbOn: { alignSelf: 'flex-end' },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: Colors.textMain, flex: 1 },

  // Breakdown
  breakdownBox: {
    backgroundColor: Colors.grayLighter,
    borderRadius: Radius.md,
    padding: 14,
    marginTop: 12,
  },
});
