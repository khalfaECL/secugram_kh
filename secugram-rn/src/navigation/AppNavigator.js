import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Radius } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import LoginScreen    from '../screens/LoginScreen';
import MyPhotosScreen from '../screens/MyPhotosScreen';
import SharedScreen   from '../screens/SharedScreen';
import HistoryScreen  from '../screens/HistoryScreen';
import ProfileScreen  from '../screens/ProfileScreen';

const TABS = [
  { label: 'Mes images', icon: '📁', title: 'Mes images' },
  { label: 'Partagées',  icon: '🔐', title: 'Partagées avec moi' },
  { label: 'Historique', icon: '📋', title: 'Historique' },
  { label: 'Profil',     icon: '👤', title: 'Mon profil' },
];

const SCREENS = [MyPhotosScreen, SharedScreen, HistoryScreen, ProfileScreen];

// ── Header ────────────────────────────────────────────────────────────────────

function Header({ title, username }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const initials = (username || 'U').slice(0, 2).toUpperCase();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingTop: Platform.OS === 'android' ? 14 : 10,
      paddingBottom: 12,
      backgroundColor: colors.bg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    }}>
      <View>
        <Text style={{ fontSize: 10, color: colors.textMut, fontFamily: 'Courier New', letterSpacing: 1.5 }}>
          SECUGRAM
        </Text>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPri, letterSpacing: -0.3 }}>
          {title}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.surface, borderRadius: Radius.full,
            paddingHorizontal: 12, paddingVertical: 6,
            borderWidth: 1, borderColor: colors.border,
          }}
          onPress={toggleTheme} activeOpacity={0.8}
        >
          <Text style={{ fontSize: 13 }}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
        <View style={{
          width: 34, height: 34, borderRadius: 17,
          borderWidth: 2, borderColor: colors.accent,
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: colors.accentDim,
        }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent }}>{initials}</Text>
        </View>
      </View>
    </View>
  );
}

// ── Tab Bar ───────────────────────────────────────────────────────────────────

function TabBar({ active, onPress }) {
  const { colors } = useTheme();
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: colors.bg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingBottom: Platform.OS === 'ios' ? 24 : 10,
      paddingTop: 10,
    }}>
      {TABS.map((t, i) => (
        <TouchableOpacity
          key={i}
          style={{ flex: 1, alignItems: 'center', gap: 3 }}
          onPress={() => onPress(i)}
          activeOpacity={0.7}
        >
          <View style={{
            width: 44, height: 30, alignItems: 'center', justifyContent: 'center',
            borderRadius: Radius.sm,
            backgroundColor: active === i ? colors.accentDim : 'transparent',
          }}>
            <Text style={{ fontSize: 18 }}>{t.icon}</Text>
          </View>
          <Text style={{
            fontSize: 9, letterSpacing: 0.2,
            fontWeight: active === i ? '700' : '400',
            color: active === i ? colors.accent : colors.textSec,
          }}>
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Navigator ─────────────────────────────────────────────────────────────────

export default function AppNavigator() {
  const { session } = useAuth();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  if (!session) return <LoginScreen/>;

  const Screen = SCREENS[activeTab];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title={TABS[activeTab].title} username={session.username}/>
      <View style={{ flex: 1 }}>
        <Screen/>
      </View>
      <TabBar active={activeTab} onPress={setActiveTab}/>
    </View>
  );
}
