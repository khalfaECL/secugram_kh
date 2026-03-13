import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, ScrollView } from 'react-native';
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

// ── Info Menu ─────────────────────────────────────────────────────────────────

const MENU_ITEMS = [
  {
    key: 'about',
    label: 'À propos',
    icon: 'ℹ',
    title: 'À propos de Secugram',
    content: `Secugram est une application de partage sécurisé d'images.\n\nVersion  1.0.0\nPlateforme  Android\nChiffrement  AES-256\n\nConçue pour protéger vos contenus visuels sensibles grâce à un système d'autorisations explicites, d'accès éphémères et de traçabilité complète.`,
  },
  {
    key: 'aide',
    label: 'Aide',
    icon: '?',
    title: 'Aide & FAQ',
    content: `❓ Comment déposer une image ?\nAppuyez sur « Déposer une image » depuis l'onglet Mes images, puis définissez les personnes autorisées.\n\n❓ Qu'est-ce qu'une image éphémère ?\nUne image partagée s'affiche pendant un temps limité (1–10 s), configurable dans votre profil. Elle se ferme automatiquement et l'accès est enregistré.\n\n❓ Que signifie FILIGRANE dans l'historique ?\nCela signifie que l'image a été vue en dehors de Secugram — le tatouage numérique invisible a été détecté sur un autre appareil.\n\n❓ Les images sont-elles stockées localement ?\nNon. Aucune image n'est conservée sur votre appareil. Elles sont chiffrées côté serveur.`,
  },
  {
    key: 'rules',
    label: 'Règles de sécurité',
    icon: '🛡',
    title: 'Règles de sécurité des données',
    content: `🔒 Chiffrement\nToutes les images sont chiffrées avec AES-256 avant stockage. Les clés ne transitent jamais en clair.\n\n👁 Traçabilité\nChaque accès à une image partagée est enregistré : date, heure, identifiant du viewer.\n\n📵 Captures d'écran\nLes captures d'écran et enregistrements d'écran sont bloqués nativement sur Android (FLAG_SECURE).\n\n🧠 Sessions éphémères\nLes sessions JWT sont conservées en mémoire vive uniquement — aucun token n'est écrit sur le disque.\n\n🚫 Zéro copie locale\nLes images partagées ne sont jamais mises en cache ni sauvegardées sur l'appareil du destinataire.`,
  },
];

function InfoMenuModal({ visible, onClose, colors }) {
  const [detail, setDetail] = useState(null);

  const handleClose = () => {
    setDetail(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-start', alignItems: 'flex-end' }}
        activeOpacity={1}
        onPress={handleClose}
      />
      <View style={{
        position: 'absolute',
        top: Platform.OS === 'android' ? 58 : 54,
        right: 14,
        backgroundColor: colors.card,
        borderRadius: Radius.lg,
        borderWidth: 1, borderColor: colors.border,
        minWidth: 210,
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25, shadowRadius: 20, elevation: 12,
        overflow: 'hidden',
      }}>
        {detail ? (
          /* Detail view */
          <View>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}
              onPress={() => setDetail(null)}
            >
              <Text style={{ fontSize: 14, color: colors.accent }}>‹</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textPri }}>{detail.title}</Text>
            </TouchableOpacity>
            <ScrollView style={{ maxHeight: 320 }} contentContainerStyle={{ padding: 14 }}>
              <Text style={{ fontSize: 12, color: colors.textSec, lineHeight: 20, fontFamily: 'Courier New' }}>
                {detail.content}
              </Text>
            </ScrollView>
          </View>
        ) : (
          /* Menu list */
          MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.key}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 12,
                paddingHorizontal: 16, paddingVertical: 14,
                borderBottomWidth: i < MENU_ITEMS.length - 1 ? StyleSheet.hairlineWidth : 0,
                borderBottomColor: colors.border,
              }}
              onPress={() => setDetail(item)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: colors.accentDim,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 13, color: colors.accent }}>{item.icon}</Text>
              </View>
              <Text style={{ fontSize: 14, color: colors.textPri, fontWeight: '500', flex: 1 }}>{item.label}</Text>
              <Text style={{ fontSize: 14, color: colors.textMut }}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </Modal>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header({ title, username }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = (username || 'U').slice(0, 2).toUpperCase();
  return (
    <>
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
          <TouchableOpacity
            style={{
              width: 22, height: 22, borderRadius: 11,
              backgroundColor: colors.surface,
              borderWidth: 1, borderColor: colors.border,
              alignItems: 'center', justifyContent: 'center',
            }}
            onPress={() => setMenuOpen(true)}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 11, color: colors.textSec, fontWeight: '700', lineHeight: 13 }}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
      <InfoMenuModal visible={menuOpen} onClose={() => setMenuOpen(false)} colors={colors}/>
    </>
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
