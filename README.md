# Secugram — Frontend

Application de partage de photos sécurisées et éphémères.
Les images sont chiffrées AES-256 côté serveur, tatouées avec un filigrane DCT invisible, et soumises à un contrôle d'accès strict par le propriétaire.

> **Stack :** React Native 0.76 (Android) · Webpack 5 + react-native-web (navigateur) · FastAPI + MongoDB Atlas (backend)

**Version web live :** [https://front-end-xwu4.onrender.com](https://front-end-xwu4.onrender.com)
**API backend :** [https://tdc-server.onrender.com/docs](https://tdc-server.onrender.com/docs)

---

## Fonctionnalités

- **Chiffrement AES-256** — les images sont chiffrées par le Tiers de Confiance avant stockage ; seuls les viewers autorisés reçoivent l'image déchiffrée
- **Filigrane DCT invisible** — chaque image porte le username du viewer, extractible pour traçabilité en cas de fuite
- **Viewer éphémère** — l'image s'efface automatiquement après N secondes (1–10s, configurable au dépôt)
- **Quota de vues** — nombre maximum de consultations par utilisateur autorisé (1–20, configurable au dépôt)
- **Intervalle entre vues** — délai minimum entre deux consultations (1–60 min, configurable dans le profil)
- **Contrôle d'accès** — liste d'autorisations par image, demande d'accès, révocation, blocage total
- **Session éphémère** — token JWT en mémoire uniquement, jamais persisté sur le device
- **Inscription sécurisée** — validation mot de passe (8+ chars, majuscule, chiffre, caractère spécial), confirmation, unicité username
- **Suppression de compte** — suppression complète du compte et de toutes les données associées
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
├── public/
│   └── index.html
├── webpack.config.js         # Build version web
└── App.js
```

---

## Démarrage rapide

### Prérequis

- Node.js 20.x
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

# Terminal 2 — Build + install
npx @react-native-community/cli run-android
```

### Version Web (local)

```bash
npx webpack serve --config webpack.config.js
# → http://localhost:8080
```

---

## Déploiement web (Render Static Site)

1. Créer un **Static Site** sur [render.com](https://render.com)
2. Connecter le repo GitHub
3. Configurer :

| Paramètre | Valeur |
|---|---|
| **Root Directory** | `secugram-rn` |
| **Build Command** | `npm ci && npx webpack --config webpack.config.js --mode production` |
| **Publish Directory** | `dist` |
| **Node Version** | `20.x` |

---

## Configuration backend

L'URL du backend est centralisée dans `src/config.js` :

```js
export const API_BASE_URL = 'https://tdc-server.onrender.com';
```

Remplacer par l'URL de votre propre instance si vous déployez le backend vous-même.

---

## Paramètres de sécurité

| Paramètre | Où le régler | Plage |
|-----------|-------------|-------|
| Durée d'affichage | Au dépôt | 1–10 secondes |
| Nb de vues max | Au dépôt | 1–20 vues |
| Intervalle entre vues | Profil utilisateur | 1–60 minutes |

---

## Backend

Le backend (Tiers de Confiance) est un projet séparé : [khalfaECL/tdc_server](https://github.com/khalfaECL/tdc_server)
Documentation API interactive : `https://tdc-server.onrender.com/docs`

---

## Tech stack

| Couche | Technologie |
|--------|------------|
| Mobile | React Native 0.76 |
| Web | Webpack 5 + react-native-web |
| Navigation | React Navigation 6 (bottom tabs) |
| État | React Context (Auth + Theme) |
| Persistance locale | AsyncStorage (contacts, cooldown) |
| Backend | FastAPI + MongoDB Atlas (hors ce repo) |

---

## Équipe

KHALFA Youssef · KRID Amani · AGREBI Marwane · CHAMMAKHI Malek
École Centrale de Lyon
