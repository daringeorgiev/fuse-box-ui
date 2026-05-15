# Fuse Box UI

A React 19 + TypeScript SPA for managing electrical fuse panels. Supports multiple panels, drag-and-drop slot management, amp ratings, and Google SSO via Firebase.

**Backend:** requires [fuse-box-api](../fuse-box-api) (.NET) to be running locally.

## Stack

- React 19 + TypeScript, Vite
- React Router v7, TanStack Query v5, Zustand
- Firebase Authentication (Google SSO)
- i18next (English + Bulgarian)

## Getting started

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev        # start dev server (Vite HMR)
npm run build      # type-check + production build
npm run lint       # ESLint
npm run preview    # serve the production build locally
```

## Deploying to Firebase Hosting

```bash
npm install -g firebase-tools   # once
firebase login                  # once
npm run build
firebase deploy
```

Live at `https://fuse-box-8ec50.web.app` after deploy.

> Set `VITE_API_BASE_URL` in `.env.production` to your Cloud Run URL before building for production. See [docs/deployment-plan.md](docs/deployment-plan.md) for the full deployment guide.

## Authentication setup

This app uses Firebase Authentication with Google SSO. Before running locally you need a Firebase project configured.

**Prerequisites**

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Sign-in method → Google**
3. Add `localhost` to **Authentication → Settings → Authorized domains**
4. Copy the Firebase config from **Project Settings → General → Your apps**

**Environment variables**

Create `.env.local` in the project root (already git-ignored via `*.local`):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

`VITE_FIREBASE_STORAGE_BUCKET` and `VITE_FIREBASE_MESSAGING_SENDER_ID` are not required for auth-only usage.

For full setup details, backend token verification, and troubleshooting see [docs/firebase-auth.md](docs/firebase-auth.md).
