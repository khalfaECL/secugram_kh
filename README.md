# Secugram — Frontend

Application mobile sécurisée de partage de photos éphémères.
Les images sont chiffrées AES-256 côté serveur, tatouées avec un filigrane DCT invisible, et soumises à un contrôle d'accès strict par le propriétaire.

> **Stack :** React Native 0.76 (Android) · Webpack + react-native-web (navigateur) · FastAPI + MongoDB Atlas (backend)

---

## Fonctionnalités

- **Chiffrement AES-256** — les images sont chiffrées par le Tiers de Confiance avant stockage ; seuls les viewers autorisés reçoivent l'image déchiffrée
- **Filigrane DCT invisible** — chaque image porte le username du déposeur, extractible pour traçabilité en cas de fuite
- **Viewer éphémère** — l'image s'efface automatiquement après N secondes (1–10s, configurable au dépôt)
- **Quota de vues** — nombre maximum de consultations par utilisateur autorisé (1–20, configurable au dépôt)
- **Intervalle entre vues** — délai minimum entre deux consultations (1–60 min, configurable dans le profil)
- **Contrôle d'accès** — liste d'autorisations par image, demande d'accès, révocation, blocage total
- **Session éphémère** — token JWT en mémoire uniquement, jamais persisté sur le device
- **Multi-plateforme** — même codebase pour l'app Android et la version web

---

## Architecture

```
secugram-rn/
├── src/
│   ├── api/index.js          # Tous les appels vers le TdC + normalisation snake→camel
│   ├── config.js             # API_BASE_URL + timeout
│   ├── hooks/
│   │   ├── useAuth.js        # Session JWT (mémoire uniquement)
│   │   └── useTheme.js       # Thème dark/light + intervalle entre vues (persisté)
│   ├── screens/              # Écrans React Native (Android)
│   │   ├── LoginScreen.js
│   │   ├── FeedScreen.js
│   │   ├── MyPhotosScreen.js
│   │   ├── SharedScreen.js
│   │   └── ProfileScreen.js
│   ├── components/
│   │   ├── UI.js
│   │   └── UploadModal.js    # Dépôt d'image avec réglages de sécurité
│   ├── stubs/                # Polyfills web (AsyncStorage→localStorage, etc.)
│   └── web/pages/            # Équivalents web des écrans natifs
├── webpack.config.js         # Build version web
└── App.js
```

---

## Démarrage rapide

### Prérequis

- Node.js ≥ 18
- JDK 17
- Android Studio + Android SDK API 33+
- ADB (inclus dans Android SDK)

### Installation

```bash
cd secugram-rn
npm install
```

### App Android (device physique)

```bash
# Terminal 1 — Metro bundler
npx @react-native-community/cli start

# Terminal 2 — Redirection port + lancement
adb reverse tcp:8081 tcp:8081
npx @react-native-community/cli run-android
```

### Version Web

```bash
npx webpack serve --config webpack.config.js
# → http://localhost:8080
```

---

## Mode démo

Identifiants : `alice_dupont` / `demo1234`
Aucun backend requis — données mock, aucun appel réseau.

---

## Paramètres de sécurité

| Paramètre | Où le régler | Plage |
|-----------|-------------|-------|
| Durée d'affichage | Au dépôt | 1–10 secondes |
| Nb de vues max | Au dépôt | 1–20 vues |
| Intervalle entre vues | Profil utilisateur | 1–60 minutes |

---

## Backend

Le backend (Tiers de Confiance) est un projet séparé : [`Serveur-TDC`](../Serveur-TDC)
Déployé sur Render · Documentation API : `https://tdc-server.onrender.com/docs`

---

## Tech stack

| Couche | Technologie |
|--------|------------|
| Mobile | React Native 0.76 |
| Web | Webpack 5 + react-native-web |
| Navigation | React Navigation 6 (bottom tabs) |
| État | React Context (Auth + Theme) |
| Persistance | AsyncStorage (cooldown uniquement) |
| Backend | FastAPI + MongoDB Atlas (hors ce repo) |

---

## Équipe

KHALFA Youssef · KRID Amani · AGREBI Marwane · CHAMMAKHI Malek
École Centrale de Lyon
