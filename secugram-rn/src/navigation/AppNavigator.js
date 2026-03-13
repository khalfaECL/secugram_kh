import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Radius } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import LoginScreen   from '../screens/LoginScreen';
import FeedScreen    from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// ── Tab Bar ───────────────────────────────────────────────────────────────────

function TabBar({ state, navigation }) {
  const { colors } = useTheme();
  const TABS = [
    { name: 'Feed',    label: 'Galerie', icon: '⊞', iconOn: '⊟' },
    { name: 'Profile', label: 'Profil',  icon: '○', iconOn: '●' },
  ];
  return (
    <View style={{
      flexDirection: 'row', backgroundColor: colors.bg,
      borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
      paddingBottom: Platform.OS === 'ios' ? 24 : 8, paddingTop: 10,
    }}>
      {TABS.map((t, i) => {
        const active = state.index === i;
        return (
          <TouchableOpacity key={t.name} style={{ flex: 1, alignItems: 'center', gap: 4 }} onPress={() => navigation.navigate(t.name)} activeOpacity={0.7}>
            <View style={{
              width: 40, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.sm,
              backgroundColor: active ? colors.accentDim : 'transparent',
            }}>
              <Text style={{ fontSize: 20, color: active ? colors.accent : colors.textSec }}>
                {active ? t.iconOn : t.icon}
              </Text>
            </View>
            <Text style={{ fontSize: 10, color: active ? colors.accent : colors.textSec, fontWeight: active ? '600' : '400', letterSpacing: 0.3 }}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header({ username }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const initials = (username || 'U').slice(0, 2).toUpperCase();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingTop: Platform.OS === 'android' ? 14 : 0,
      paddingBottom: 12,
      backgroundColor: colors.bg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    }}>
      <Text style={{ fontSize: 24, fontWeight: '800', color: colors.textPri, letterSpacing: -0.8 }}>
        Secugram
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {/* Theme toggle */}
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

        {/* Avatar */}
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

// ── Navigator ─────────────────────────────────────────────────────────────────

export default function AppNavigator() {
  const { session } = useAuth();
  const { colors } = useTheme();

  if (!session) return <LoginScreen/>;

  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <Header username={session.username}/>
        <Tab.Navigator
          tabBar={props => <TabBar {...props}/>}
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="Feed"    component={FeedScreen}/>
          <Tab.Screen name="Profile" component={ProfileScreen}/>
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}
