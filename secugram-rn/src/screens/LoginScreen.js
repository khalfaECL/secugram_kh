import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { Radius } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

function Field({ placeholder, value, onChangeText, secureTextEntry, keyboardType, colors }) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      style={[{
        backgroundColor: colors.surface, borderRadius: Radius.xl,
        paddingVertical: 16, paddingHorizontal: 20,
        fontSize: 15, color: colors.textPri,
        borderWidth: 1, borderColor: colors.border,
      }, focused && { borderColor: colors.accent, backgroundColor: colors.accentDim }]}
      placeholder={placeholder}
      placeholderTextColor={colors.textMut}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
      autoCorrect={false}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function LoginScreen() {
  const { login, register } = useAuth();
  const { colors, isDark } = useTheme();
  const [tab,      setTab]      = useState('login');
  const [username, setUsername] = useState('alice_dupont');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('demo1234');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!username.trim() || !password.trim()) { setError('Tous les champs sont requis.'); return; }
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(username.trim(), password);
      } else {
        if (!email.trim()) { setError("L'email est requis."); setLoading(false); return; }
        await register(username.trim(), email.trim(), password);
      }
    } catch (e) {
      setError(e.message || 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg}/>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 32 }}>

        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 52 }}>
          <View style={{
            width: 90, height: 90, borderRadius: 45,
            borderWidth: 2, borderColor: colors.accent,
            alignItems: 'center', justifyContent: 'center', marginBottom: 22,
            shadowColor: colors.accent, shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6, shadowRadius: 24, elevation: 14,
          }}>
            <View style={{
              width: 74, height: 74, borderRadius: 37,
              backgroundColor: colors.accentDim,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 30 }}>🔒</Text>
            </View>
          </View>
          <Text style={{ fontSize: 36, fontWeight: '800', color: colors.textPri, letterSpacing: -1.5, marginBottom: 8 }}>
            Secugram
          </Text>
          <Text style={{ fontSize: 9, color: colors.textMut, letterSpacing: 3, fontFamily: 'Courier New' }}>
            ENCRYPTED · PRIVATE · SECURE
          </Text>
        </View>

        {/* Segment */}
        <View style={{
          flexDirection: 'row', backgroundColor: colors.surface,
          borderRadius: Radius.full, padding: 3, marginBottom: 28,
        }}>
          {['login', 'register'].map(t => (
            <TouchableOpacity
              key={t}
              style={[{ flex: 1, paddingVertical: 11, borderRadius: Radius.full, alignItems: 'center' },
                tab === t && { backgroundColor: colors.card }]}
              onPress={() => { setTab(t); setError(''); }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: tab === t ? colors.textPri : colors.textSec }}>
                {t === 'login' ? 'Connexion' : 'Inscription'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Error */}
        {!!error && (
          <View style={{
            backgroundColor: 'rgba(255,69,58,0.1)', borderWidth: 1,
            borderColor: 'rgba(255,69,58,0.25)', borderRadius: Radius.md,
            padding: 12, marginBottom: 14,
          }}>
            <Text style={{ color: colors.danger, fontSize: 13, textAlign: 'center' }}>{error}</Text>
          </View>
        )}

        {/* Fields */}
        <View style={{ gap: 10, marginBottom: 18 }}>
          <Field placeholder="Nom d'utilisateur" value={username} onChangeText={setUsername} colors={colors}/>
          {tab === 'register' && (
            <Field placeholder="Adresse email" value={email} onChangeText={setEmail} keyboardType="email-address" colors={colors}/>
          )}
          <Field placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry colors={colors}/>
        </View>

        {/* Hint identifiants */}
        {tab === 'login' && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            gap: 6, marginBottom: 16,
          }}>
            <Text style={{ fontSize: 10, color: colors.textMut, fontFamily: 'Courier New' }}>
              Compte de test :
            </Text>
            <Text style={{ fontSize: 10, color: colors.accent, fontFamily: 'Courier New' }}>
              alice_dupont / demo1234
            </Text>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={{
            backgroundColor: colors.accent, borderRadius: Radius.xl,
            paddingVertical: 17, alignItems: 'center', justifyContent: 'center',
            opacity: loading ? 0.55 : 1,
            shadowColor: colors.accent, shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5, shadowRadius: 20, elevation: 12,
          }}
          onPress={handleSubmit} disabled={loading} activeOpacity={0.88}
        >
          {loading
            ? <ActivityIndicator color="#fff" size="small"/>
            : <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.3 }}>
                {tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </Text>
          }
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', fontSize: 10, color: colors.textMut, fontFamily: 'Courier New', letterSpacing: 1, marginTop: 28 }}>
          🔐  JWT · AES-256 · Aucun stockage local
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
