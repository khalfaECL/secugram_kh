import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { Radius, Spacing } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');
const TILE = (width - 3) / 3;

const SECURITY_ITEMS = [
  { icon: '🔑', label: 'Clé de chiffrement',  value: 'Stockée côté serveur uniquement' },
  { icon: '💾', label: 'Stockage token',        value: 'Mémoire vive · Non persistant' },
  { icon: '🖼️', label: 'Tatouage numérique',   value: 'Watermark invisible par image' },
  { icon: '⏱️', label: 'Expiration session',   value: 'JWT valide 1 heure' },
];

const GRID_TILES = Array.from({ length: 6 }, (_, i) => ({ id: `t${i}`, locked: i % 2 === 0 }));

function GridTile({ tile, colors }) {
  return (
    <View style={{ width: TILE, height: TILE, backgroundColor: '#080810', overflow: 'hidden' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 4 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Text key={i} style={{ fontFamily: 'Courier New', fontSize: 8, color: 'rgba(255,107,0,0.1)', marginBottom: 2 }}>
            A3F 8C1E B37D 9F56
          </Text>
        ))}
      </View>
      <View style={{ ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <Text style={{ fontSize: 22 }}>{tile.locked ? '🔒' : '🔓'}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen({ photoCount = 0 }) {
  const { session, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const initials = (session?.username || 'U').slice(0, 2).toUpperCase();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={{
        alignItems: 'center', paddingTop: 32, paddingBottom: 24, paddingHorizontal: Spacing.lg,
        borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
      }}>
        {/* Theme toggle */}
        <TouchableOpacity
          style={{
            position: 'absolute', top: 16, right: 16,
            backgroundColor: colors.surface, borderRadius: Radius.full,
            paddingHorizontal: 14, paddingVertical: 7,
            borderWidth: 1, borderColor: colors.border,
          }}
          onPress={toggleTheme} activeOpacity={0.8}
        >
          <Text style={{ fontSize: 14 }}>{isDark ? '☀️ Clair' : '🌙 Sombre'}</Text>
        </TouchableOpacity>

        {/* Avatar */}
        <View style={{
          width: 94, height: 94, borderRadius: 47,
          borderWidth: 2.5, borderColor: colors.accent,
          alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          shadowColor: colors.accent, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10,
          shadowOffset: { width: 0, height: 0 },
        }}>
          <View style={{ width: 85, height: 85, borderRadius: 42, borderWidth: 3, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 78, height: 78, borderRadius: 39, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 28, fontWeight: '800', color: colors.accent }}>{initials}</Text>
            </View>
          </View>
        </View>

        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPri, marginBottom: 4 }}>{session?.username}</Text>
        <Text style={{ fontSize: 13, color: colors.textSec, fontFamily: 'Courier New', marginBottom: 14 }}>@{session?.username}</Text>

        <View style={{
          backgroundColor: isDark ? 'rgba(0,207,255,0.07)' : 'rgba(0,153,204,0.08)',
          borderWidth: 1, borderColor: isDark ? 'rgba(0,207,255,0.2)' : 'rgba(0,153,204,0.2)',
          borderRadius: Radius.full, paddingVertical: 7, paddingHorizontal: 14,
        }}>
          <Text style={{ fontSize: 11, color: colors.cyan, fontFamily: 'Courier New' }}>
            🛡️  Session active · JWT · AES-256
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={{
        flexDirection: 'row', backgroundColor: colors.bg,
        borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
      }}>
        {[{ val: photoCount, label: 'Photos' }, { val: 'AES-256', label: 'Chiffrement' }, { val: 'JWT', label: 'Auth' }].map((s, i) => (
          <View key={i} style={[
            { flex: 1, alignItems: 'center', paddingVertical: 18 },
            i < 2 && { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border },
          ]}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPri, marginBottom: 3 }}>{s.val}</Text>
            <Text style={{ fontSize: 10, color: colors.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Grid */}
      <View style={{
        borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
        borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
        alignItems: 'center', paddingVertical: 10,
      }}>
        <View style={{ paddingHorizontal: 20, borderBottomWidth: 1.5, borderBottomColor: colors.accent }}>
          <Text style={{ fontSize: 20, color: colors.accent }}>▦</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 1.5, marginBottom: 2 }}>
        {GRID_TILES.map((tile, i) => (
          <React.Fragment key={tile.id}>
            {i % 3 !== 0 && <View style={{ width: 1.5, backgroundColor: colors.bg }}/>}
            <GridTile tile={tile} colors={colors}/>
          </React.Fragment>
        ))}
      </View>

      {/* Security */}
      <View style={{ padding: Spacing.lg }}>
        <Text style={{ fontSize: 10, color: colors.textSec, fontFamily: 'Courier New', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
          SÉCURITÉ
        </Text>
        {SECURITY_ITEMS.map(item => (
          <View key={item.label} style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
            borderRadius: Radius.lg, padding: 14, marginBottom: 8, gap: 12,
          }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textPri, marginBottom: 2 }}>{item.label}</Text>
              <Text style={{ fontSize: 11, color: colors.textSec, fontFamily: 'Courier New' }}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Session */}
      <View style={{ padding: Spacing.lg, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, color: colors.textSec, fontFamily: 'Courier New', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
          SESSION ACTIVE
        </Text>
        <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.lg, padding: 14, gap: 10 }}>
          {[
            { k: 'user_id',  v: session?.userId },
            { k: 'token',    v: `${session?.token?.slice(0, 18)}…` },
            { k: 'stockage', v: 'mémoire vive', green: true },
          ].map(row => (
            <View key={row.k} style={{ flexDirection: 'row', gap: 12 }}>
              <Text style={{ fontSize: 11, fontFamily: 'Courier New', color: colors.textSec, width: 72 }}>{row.k}</Text>
              <Text style={{ fontSize: 11, fontFamily: 'Courier New', color: row.green ? colors.success : colors.textPri, flex: 1 }} numberOfLines={1}>
                {row.v}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Logout */}
      <View style={{ paddingHorizontal: Spacing.lg }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255,69,58,0.07)', borderWidth: 1,
            borderColor: 'rgba(255,69,58,0.2)', borderRadius: Radius.xl,
            paddingVertical: 15, alignItems: 'center', marginBottom: 10,
          }}
          onPress={logout} activeOpacity={0.8}
        >
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.danger }}>🚪  Se déconnecter</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 11, color: colors.textMut, textAlign: 'center', fontFamily: 'Courier New' }}>
          La session sera définitivement effacée de la mémoire.
        </Text>
      </View>
    </ScrollView>
  );
}
