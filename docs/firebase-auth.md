# Firebase Auth — Operational Reference

This document covers the Firebase console configuration, local environment setup, backend integration, and troubleshooting. For the step-by-step code implementation see [auth-implementation.md](auth-implementation.md).

---

## Firebase Console setup

### 1. Create a project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**
2. Give it a name (e.g. `fuse-box`) and follow the wizard (Analytics is optional)

### 2. Enable Google sign-in

1. In the left sidebar go to **Build → Authentication**
2. Click **Get started** if this is your first time
3. Under **Sign-in method** click **Google**, toggle it on, set a support email, and save

### 3. Authorized domains

1. Still in Authentication, go to **Settings → Authorized domains**
2. `localhost` should already be listed — if not, add it
3. When you deploy, add your production domain here too

### 4. Get the frontend config

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to **Your apps** — if no app exists click the `</>` (Web) icon to register one
3. Copy the `firebaseConfig` object — these values map directly to your `.env.local` keys

### 5. Generate a service account key (backend only)

1. Go to **Project Settings → Service accounts**
2. Click **Generate new private key** and download the JSON file
3. Rename it `service-account.json` and place it in the `fuse-box-api` project root
4. Add `service-account.json` to the API's `.gitignore` — **never commit this file**

---

## Frontend environment variables

Create `.env.local` in the `fuse-box-ui` root. This file is git-ignored via `*.local`.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

The following are not required for Google SSO auth:

| Variable | Used for |
|---|---|
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging |

---

## How authentication flows

1. User clicks **Sign in with Google** → `signInWithPopup` opens a Google OAuth popup
2. On success Firebase sets a session and fires `onAuthStateChanged`
3. `AuthContext` updates `user` state — `LoginPage` detects the non-null user and redirects to `/`
4. Every Axios request attaches the Firebase ID token as `Authorization: Bearer <token>` via a request interceptor in `src/api/client.ts`
5. The .NET backend validates the token with `FirebaseAuth.DefaultInstance.VerifyIdTokenAsync()` and extracts `uid` for data scoping

---

## Backend setup (.NET)

Install the NuGet package:

```bash
dotnet add package FirebaseAdmin
```

Initialize in `Program.cs`:

```csharp
FirebaseApp.Create(new AppOptions
{
    Credential = GoogleCredential.FromFile("service-account.json"),
});
```

Register the auth middleware before route mappings:

```csharp
app.UseMiddleware<FirebaseAuthMiddleware>();
```

See [auth-implementation.md](auth-implementation.md#backend-fuse-box-api--net) for the full middleware implementation.

---

## Deploying to production

1. Add your production domain to **Firebase Console → Authentication → Settings → Authorized domains**
2. Set the `VITE_FIREBASE_*` environment variables in your hosting provider's config (not in a committed file)
3. On the backend, provide `service-account.json` via a secret manager or environment variable rather than a file on disk

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `auth/invalid-api-key` in console | Wrong or missing `VITE_FIREBASE_API_KEY` | Check `.env.local` values against Firebase Console |
| Popup closes but no redirect | `onAuthStateChanged` not firing | Check browser console for Firebase errors; ensure `AuthProvider` wraps the app in `main.tsx` |
| Google popup blocked | Browser popup blocker | Call `signInWithPopup` directly from a user gesture (button click) — never on mount |
| 401 from API | Token expired or missing | `getIdToken()` auto-refreshes — check the Axios interceptor in `src/api/client.ts` is in place |
| `auth/unauthorized-domain` | Production domain not allowlisted | Add the domain to Firebase Console → Authorized domains |
| Service account error on backend | Wrong file path or invalid JSON | Verify `service-account.json` path and that the file was downloaded from the correct project |
