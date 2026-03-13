import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image,
  TouchableOpacity, RefreshControl, ActivityIndicator, ScrollView,
} from 'react-native';
import { Radius } from '../theme';
import { useTheme } from '../hooks/useTheme';
import UploadModal from '../components/UploadModal';
import { useAuth } from '../hooks/useAuth';
import * as API from '../api';

const MOCK_PHOTOS = [
  {
    image_id: 'img_001', owner_username: 'alice_dupont',
    description: 'Vacances Nice 2025 🌊', date_creation: '26 fév.',
    locked: true, authorized: ['bob_martin', 'charlie_durand'],
    preview_uri: 'https://picsum.photos/seed/beach/800/800',
  },
  {
    image_id: 'img_002', owner_username: 'bob_martin',
    description: 'Réunion équipe Lyon ☕', date_creation: '1 mars',
    locked: false, authorized: ['alice_dupont', 'charlie_durand', 'emma_rousseau'],
    preview_uri: 'https://picsum.photos/seed/city/800/800',
  },
  {
    image_id: 'img_003', owner_username: 'charlie_durand',
    description: 'Randonnée Vercors 🌲', date_creation: '3 mars',
    locked: true, authorized: ['alice_dupont', 'dave_leclerc'],
    preview_uri: 'https://picsum.photos/seed/forest/800/800',
  },
  {
    image_id: 'img_004', owner_username: 'emma_rousseau',
    description: 'Week-end Chamonix ⛰️', date_creation: '8 mars',
    locked: false, authorized: ['alice_dupont', 'bob_martin', 'felix_moreau'],
    preview_uri: 'https://picsum.photos/seed/mountain/800/800',
  },
];

const MOCK_USERS = [
  { user_id: 'u2', username: 'bob_martin',     display: 'Bob' },
  { user_id: 'u3', username: 'charlie_durand', display: 'Charlie' },
  { user_id: 'u4', username: 'dave_leclerc',   display: 'Dave' },
  { user_id: 'u5', username: 'emma_rousseau',  display: 'Emma' },
  { user_id: 'u6', username: 'felix_moreau',   display: 'Félix' },
];

// ── Story Bubble ─────────────────────────────────────────────────────────────

function StoryBubble({ user, isAdd, onPress }) {
  const { colors } = useTheme();
  const label = isAdd ? '+' : (user.display || user.username).slice(0, 1).toUpperCase();
  const name  = isAdd ? 'Partager' : (user.display || user.username.split('_')[0]);
  return (
    <TouchableOpacity style={{ alignItems: 'center', marginRight: 18, width: 64 }} onPress={onPress} activeOpacity={0.75}>
      <View style={{
        width: 64, height: 64, borderRadius: 32,
        borderWidth: 2.5, borderColor: isAdd ? colors.border : colors.accent,
        borderStyle: isAdd ? 'dashed' : 'solid',
        alignItems: 'center', justifyContent: 'center', marginBottom: 6,
        shadowColor: colors.accent, shadowOpacity: isAdd ? 0 : 0.3,
        shadowRadius: 8, elevation: isAdd ? 0 : 4,
        shadowOffset: { width: 0, height: 2 },
      }}>
        <View style={{
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: colors.card,
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 2, borderColor: colors.bg,
        }}>
          <Text style={{ fontSize: isAdd ? 24 : 20, fontWeight: isAdd ? '300' : '700', color: isAdd ? colors.accent : colors.textPri }}>
            {label}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 11, color: colors.textSec, textAlign: 'center' }} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
}

// ── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ photo }) {
  const { colors } = useTheme();
  const initials = (photo.owner_username || 'U').slice(0, 2).toUpperCase();
  return (
    <View style={{ backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
        <View style={{
          width: 40, height: 40, borderRadius: 20,
          borderWidth: 2, borderColor: colors.accent,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <View style={{
            width: 34, height: 34, borderRadius: 17,
            backgroundColor: colors.card,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1.5, borderColor: colors.bg,
          }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.accent }}>{initials}</Text>
          </View>
        </View>
        <View style={{ flex: 1, marginLeft: 11 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textPri }}>{photo.owner_username}</Text>
          <Text style={{ fontSize: 11, color: colors.textSec, marginTop: 1 }}>{photo.date_creation}</Text>
        </View>
        <View style={{
          backgroundColor: photo.locked ? 'rgba(255,69,58,0.1)' : 'rgba(50,215,75,0.1)',
          borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4,
          borderWidth: 1,
          borderColor: photo.locked ? 'rgba(255,69,58,0.25)' : 'rgba(50,215,75,0.25)',
        }}>
          <Text style={{ fontSize: 10, fontWeight: '600', color: photo.locked ? colors.danger : colors.success }}>
            {photo.locked ? '🔒 Chiffré' : '🔓 Visible'}
          </Text>
        </View>
      </View>

      {/* Image */}
      <View style={{ width: '100%', aspectRatio: 1 }}>
        {photo.preview_uri
          ? <Image source={{ uri: photo.preview_uri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }}/>
          : (
            <View style={{ flex: 1, backgroundColor: '#080810', overflow: 'hidden' }}>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 8 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Text key={i} style={{ fontFamily: 'Courier New', fontSize: 10, color: 'rgba(255,107,0,0.1)', letterSpacing: 2, marginBottom: 2 }}>
                    4A2F 8C1E B37D 9F56 2A4E 1C8B 5F3D 7E2A
                  </Text>
                ))}
              </View>
              <View style={{ ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.55)' }}>
                <Text style={{ fontSize: 44, marginBottom: 12 }}>🔒</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Courier New', letterSpacing: 3, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                  CONTENU CHIFFRÉ
                </Text>
                <Text style={{ fontSize: 10, color: colors.accent, fontFamily: 'Courier New', marginTop: 4, letterSpacing: 1 }}>
                  AES-256-GCM
                </Text>
              </View>
            </View>
          )
        }
      </View>

      {/* Footer */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}>
        <Text style={{ fontSize: 14, color: colors.textPri, lineHeight: 20, marginBottom: 10 }} numberOfLines={2}>
          {photo.description}
        </Text>
        {(photo.authorized?.length ?? 0) > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              {photo.authorized.slice(0, 4).map((u, i) => (
                <View key={u} style={{
                  width: 24, height: 24, borderRadius: 12,
                  backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
                  borderWidth: 1.5, borderColor: colors.bg, marginLeft: i === 0 ? 0 : -8,
                }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: '#fff' }}>{u[0].toUpperCase()}</Text>
                </View>
              ))}
            </View>
            <Text style={{ fontSize: 12, color: colors.textSec }}>
              {photo.authorized.length} personne{photo.authorized.length > 1 ? 's' : ''} autorisée{photo.authorized.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function FeedScreen() {
  const { session } = useAuth();
  const { colors } = useTheme();
  const [photos,     setPhotos]     = useState([]);
  const [users,      setUsers]      = useState(MOCK_USERS);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const loadData = useCallback(async () => {
    if (session.isDemo) {
      setPhotos(MOCK_PHOTOS);
      setUsers(MOCK_USERS);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const [photosData, usersData] = await Promise.all([
        API.fetchMyPhotos(session.token),
        API.fetchUsers(session.token),
      ]);
      setPhotos(photosData.photos ?? []);
      setUsers(usersData.users ?? MOCK_USERS);
    } catch {
      setPhotos(MOCK_PHOTOS);
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session]);

  useEffect(() => { loadData(); }, [loadData]);
  const onRefresh = () => { setRefreshing(true); loadData(); };

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator color={colors.accent} size="large"/>
      <Text style={{ marginTop: 12, fontSize: 12, color: colors.textSec, fontFamily: 'Courier New' }}>
        Chargement sécurisé…
      </Text>
    </View>
  );

  const ListHeader = () => (
    <View>
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        style={{ backgroundColor: colors.bg, paddingVertical: 16 }}
      >
        <StoryBubble isAdd onPress={() => setShowUpload(true)}/>
        {users.map(u => <StoryBubble key={u.user_id} user={u}/>)}
      </ScrollView>
      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }}/>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={photos}
        keyExtractor={p => p.image_id}
        renderItem={({ item }) => <PostCard photo={item}/>}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={() => <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: 4 }}/>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent}/>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 }}>
            <Text style={{ fontSize: 56, marginBottom: 16 }}>📷</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPri, marginBottom: 8 }}>
              Aucune photo partagée
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSec, textAlign: 'center', marginBottom: 24 }}>
              Partagez votre première photo sécurisée
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: colors.accent, borderRadius: Radius.full, paddingVertical: 12, paddingHorizontal: 28 }}
              onPress={() => setShowUpload(true)}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>+ Partager une photo</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={{
          position: 'absolute', bottom: 28, right: 20,
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
          shadowColor: colors.accent, shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.5, shadowRadius: 16, elevation: 12,
        }}
        onPress={() => setShowUpload(true)} activeOpacity={0.85}
      >
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 33 }}>+</Text>
      </TouchableOpacity>

      <UploadModal
        visible={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={({ imageId, uri, description, authorized }) => {
          const newPhoto = {
            image_id: imageId,
            owner_username: session.username,
            description,
            date_creation: "À l'instant",
            locked: true,
            authorized,
            preview_uri: uri,
          };
          setPhotos(prev => [newPhoto, ...prev]);
          setShowUpload(false);
          if (!session.isDemo) loadData();
        }}
        users={users}
      />
    </View>
  );
}
