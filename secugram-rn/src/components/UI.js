import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { Radius, Spacing, Typography } from '../theme';
import { useTheme } from '../hooks/useTheme';

// ─── Button ──────────────────────────────────────────────────────────────────

export function PrimaryButton({ label, onPress, loading, disabled, icon, style }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: colors.accent, borderRadius: Radius.lg,
        paddingVertical: 16, paddingHorizontal: 24,
        shadowColor: colors.accent, shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
        opacity: (loading || disabled) ? 0.5 : 1,
      }, style]}
      onPress={onPress} disabled={loading || disabled} activeOpacity={0.85}
    >
      {loading
        ? <ActivityIndicator color="#fff" size="small"/>
        : <>
            {icon && <Text style={{ marginRight: 8, fontSize: 16 }}>{icon}</Text>}
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 }}>{label}</Text>
          </>
      }
    </TouchableOpacity>
  );
}

export function SecondaryButton({ label, onPress, icon, style }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: colors.surface, borderRadius: Radius.md,
        borderWidth: 1, borderColor: colors.border,
        paddingVertical: 12, paddingHorizontal: 18,
      }, style]}
      onPress={onPress} activeOpacity={0.8}
    >
      {icon && <Text style={{ marginRight: 6, fontSize: 14 }}>{icon}</Text>}
      <Text style={{ color: colors.textPri, fontSize: 14, fontWeight: '500' }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function DangerButton({ label, onPress, icon }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,69,58,0.08)', borderRadius: Radius.md,
        borderWidth: 1, borderColor: 'rgba(255,69,58,0.25)',
        paddingVertical: 14, paddingHorizontal: 20,
      }}
      onPress={onPress} activeOpacity={0.8}
    >
      {icon && <Text style={{ marginRight: 6 }}>{icon}</Text>}
      <Text style={{ color: colors.danger, fontSize: 14, fontWeight: '600' }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────

export function InputField({ label, icon, ...props }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{
          ...Typography.mono, fontSize: 10, color: colors.textSec,
          textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6,
        }}>{label}</Text>
      )}
      <View style={{ position: 'relative', justifyContent: 'center' }}>
        {icon && (
          <Text style={{ position: 'absolute', left: 14, fontSize: 16, zIndex: 1 }}>{icon}</Text>
        )}
        <TextInput
          style={{
            backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
            borderRadius: Radius.md, paddingVertical: 14,
            paddingHorizontal: icon ? 44 : 16,
            color: colors.textPri, fontSize: 15,
          }}
          placeholderTextColor={colors.textMut}
          {...props}
        />
      </View>
    </View>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────

export function Card({ children, style }) {
  const { colors } = useTheme();
  return (
    <View style={[{
      backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
      borderRadius: Radius.xl, overflow: 'hidden',
    }, style]}>
      {children}
    </View>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────

export function Badge({ label, type = 'default' }) {
  const { colors } = useTheme();
  const map = {
    success: { bg: 'rgba(50,215,75,0.12)',  text: colors.success, border: 'rgba(50,215,75,0.25)' },
    locked:  { bg: 'rgba(255,69,58,0.12)',  text: colors.danger,  border: 'rgba(255,69,58,0.25)' },
    accent:  { bg: colors.accentDim,        text: colors.accent,  border: 'rgba(255,107,0,0.25)' },
    default: { bg: colors.surface,          text: colors.textSec, border: colors.border },
  };
  const t = map[type] || map.default;
  return (
    <View style={{
      borderWidth: 1, borderRadius: 6,
      paddingHorizontal: 8, paddingVertical: 3,
      backgroundColor: t.bg, borderColor: t.border,
    }}>
      <Text style={{ ...Typography.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: t.text }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Chip ────────────────────────────────────────────────────────────────────

export function Chip({ label, onRemove }) {
  const { colors } = useTheme();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.accentDim, borderWidth: 1,
      borderColor: 'rgba(255,107,0,0.2)', borderRadius: 20,
      paddingHorizontal: 10, paddingVertical: 4,
    }}>
      <Text style={{ ...Typography.mono, fontSize: 11, color: colors.accent }}>{label}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={{ marginLeft: 4 }}>
          <Text style={{ fontSize: 14, color: colors.accent }}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

export function Avatar({ initials, size = 40, radius = 13 }) {
  const { colors } = useTheme();
  return (
    <View style={{
      width: size, height: size, borderRadius: radius,
      backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.35 }}>{initials}</Text>
    </View>
  );
}

// ─── SectionLabel ────────────────────────────────────────────────────────────

export function SectionLabel({ label }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      <Text style={{ ...Typography.mono, fontSize: 10, color: colors.textSec, textTransform: 'uppercase', letterSpacing: 1.5, marginRight: 10 }}>
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.border }}/>
    </View>
  );
}

// ─── ErrorBox ────────────────────────────────────────────────────────────────

export function ErrorBox({ message }) {
  const { colors } = useTheme();
  if (!message) return null;
  return (
    <View style={{
      backgroundColor: 'rgba(255,69,58,0.08)', borderWidth: 1,
      borderColor: 'rgba(255,69,58,0.2)', borderRadius: Radius.sm,
      padding: 12, marginBottom: 14,
    }}>
      <Text style={{ color: colors.danger, fontSize: 13 }}>⚠  {message}</Text>
    </View>
  );
}
