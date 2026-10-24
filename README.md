# reco

**Find your next favorite.** reco is a mobile-first community app where people share and discover recommendations (movies, songs, places, events, lifestyle, resources and more), upvote the best picks, settle debates in head-to-head "Showdowns", and level up through daily quizzes and Gold Coins.

It is built with **React** and **Firebase** (Authentication + Cloud Firestore) and packaged as an **Android app with Capacitor**.

---

## Features

### Discover
- **Community feed** of recommendation cards (title, image, quote, author, rank, upvotes, comments).
- **Category chips:** All, Movies, Songs, Places, Finance, Events, Lifestyle, Sports, Resources, General.
- **Filter sheet** with topic groups (Tech, Events, Lifestyle & General, Places, Movies), for example "Cozy Cafes", "Hackathons", "Plot Twists" and "AI Tools".
- **Upvote** posts and **save** picks to revisit later.
- **Notifications** panel with an unread badge.

### Contribute
- **Post a recommendation** with a category, title, a short reason and an optional image. Images are resized and compressed in the browser before saving.
- Each new recommendation earns Gold Coins (+15 XP).

### Showdowns (debates)
- Head-to-head polls such as *"Which movie had the most unhinged plot twist?"*, where users vote for one side.
- Creating a Showdown is **locked until you reach 1,000 Gold Coins**. The debate label adapts to the selected category ("Movie Debate", "Place Debate", "Tech Debate" and so on).

### Gamification
- **Daily Quiz** with a 30-second question. A correct answer earns +15 Gold Coins, and an incorrect one earns +5.
- **Champions leaderboard** with a weekly podium, an all-time view and top players.
- **Profile** with total Gold Coins, level progress (Scout → Explorer → Curator → Tastemaker → Master of Taste), badges and genre mastery.
- **Saved Picks** screen where you can mark items as watched.

### Accounts
- Email and password sign up and sign in, Google sign-in, and password reset.
- Friendly error messages for common auth failures.
- Per-user progress (saved picks, XP, votes) is remembered on the device.

---

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19, Create React App (`react-scripts` 5) |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Hosting | Firebase Hosting (`build/` folder) |
| Mobile | Capacitor 8 (Android) |
| Testing | React Testing Library, Jest |

---

## Project structure

```
actual-backend-app/
├── public/                     # CRA static assets (index.html, manifest, favicon)
├── src/
│   ├── App.js                  # App shell: auth state, feed, XP, navigation, modals
│   ├── api.js                  # Firestore calls: getPosts, createPost, upvotePost, getLeaderboard
│   ├── firebase.js             # Firebase init (app, auth, db)
│   ├── unAuth.js               # Auth helpers: Google, email, reset, sign out, auth listener
│   ├── data.js                 # Categories, topics, levels, badges, quiz, sample feed
│   ├── components/
│   │   ├── LoginScreen.js      # Sign in / sign up / reset password
│   │   └── BottomNav.js        # Home · Champions · Post · Quizzes · Profile
│   └── screens/
│       ├── HomeScreen.js       # Feed, chips, debate banner, notifications
│       ├── FilterSheet.js      # Topic filters
│       ├── AddRecommendationModal.js
│       ├── ShowdownModal.js
│       ├── SavedPicksScreen.js
│       ├── QuizzesScreen.js
│       ├── ChampionsScreen.js
│       └── ProfileScreen.js
├── android/                    # Capacitor Android project
├── capacitor.config.ts         # appId: com.actualbackendapp.app, appName: reco
├── firebase.json               # Hosting config (serves ./build)
└── package.json
```

---

## How it works

1. **Startup:** the app listens for Firebase auth changes. While it checks, a loading screen is shown. Signed-out users see the login screen, and signed-in users see the main app.
2. **Feed:** posts are fetched from the Firestore `posts` collection (newest first). If the collection is empty or unreachable, the app falls back to sample data in `data.js`.
3. **Posting:** a new recommendation appears in the feed immediately and is then saved to Firestore as a document in `posts` with the author, category, title, caption, image, upvotes and a server timestamp.
4. **Upvotes:** the count updates instantly in the UI, and an increment is sent to Firestore for database-backed posts.
5. **Progress:** saved picks, watched items, votes and XP are stored in `localStorage` under `picks:<uid>`.
6. **Dev preview mode:** in development, opening `http://localhost:3000/#preview` skips login and uses a mock user, which is handy for UI work.

### Firestore data

**`posts`**

| Field | Description |
|---|---|
| `type` | `"recommendation"` |
| `category`, `title`, `caption`, `quote` | Post content |
| `imageUrl`, `image` | Image (URL or data URL) |
| `authorId`, `authorName`, `author`, `handle` | Who posted it |
| `rank`, `recommendedBy` | Display metadata |
| `upvotes`, `comments` | Counters |
| `createdAt` | Server timestamp |

**`leaderboard`** is read by `getLeaderboard()` (see Known limitations).

---

## Getting started

### Prerequisites
- Node.js 18 or newer and npm
- A Firebase project with **Authentication** and **Firestore** enabled
- For Android: Android Studio and a JDK

### 1. Install

```bash
git clone https://github.com/AnoopSaini998/syntac-error.git
cd syntac-error
npm install
```

### 2. Configure Firebase

In the [Firebase Console](https://console.firebase.google.com):

1. **Project settings → General → Your apps → Web app** and copy the config into `src/firebase.js`.
2. **Authentication → Sign-in method:** enable **Email/Password** and **Google**.
3. **Authentication → Settings → Authorized domains:** make sure `localhost` is listed.
4. **Firestore Database:** create a database and set security rules (see below).

> Tip: moving the config into environment variables (`REACT_APP_FIREBASE_API_KEY` and so on) keeps it out of source control. Remember to restart `npm start` after editing `.env`.

### 3. Run locally

```bash
npm start
```

Open http://localhost:3000 (or the port CRA picks). Use `/#preview` to skip login during development.

### 4. Test and build

```bash
npm test
npm run build
```

### 5. Deploy the web app (Firebase Hosting)

```bash
npm run build
firebase deploy --only hosting
```

---

## Android (Capacitor)

The Android app wraps the built web app.

```bash
npm run build
npx cap sync android
npx cap open android      # opens Android Studio
```

Android checklist:
- `google-services.json` must be at `android/app/google-services.json`.
- Add your debug and release **SHA-1 / SHA-256** fingerprints under **Firebase → Project settings → Your Android app**. Get them with `cd android && ./gradlew signingReport`.
- Run `npm run build && npx cap sync android` after every web change, because Android bundles a copy of the build.

> **Google sign-in on Android:** the app currently uses `signInWithPopup`, which is designed for browsers and is unreliable inside an Android WebView. For the native app, use a Capacitor-compatible Google sign-in plugin (for example `@capacitor-firebase/authentication`) and pass the resulting credential to Firebase Auth. Email and password sign-in works as is.

---

## Suggested Firestore rules

A starting point, so that anyone signed in can read posts but only authors can create them:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.authorId == request.auth.uid;
      allow update: if request.auth != null; // upvotes; tighten before launch
      allow delete: if false;
    }
    match /leaderboard/{doc} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## Known limitations

This is an early version, and some parts are still prototype-level:

- **Leaderboard, quizzes, notifications, badges and some profile stats use static sample data** from `data.js`. `getLeaderboard()` exists but the Champions screen does not use it yet.
- **Showdowns and votes are not saved to Firestore.** They live in the current session only.
- **Saved picks, XP and quiz progress are stored per device** in `localStorage`, so they do not sync across devices.
- **Upvotes are not enforced per user on the server.** The UI prevents double voting locally, but the database counter can be incremented repeatedly.
- **Images are stored inside the post document** as compressed data URLs. Firestore documents have a 1 MB limit, so Firebase Storage is a better long-term home.
- **Comments** show counts only, and there is no comment thread yet.

## Roadmap ideas

- Move quizzes, leaderboard, XP and notifications to Firestore (with Cloud Functions for scoring).
- Persist Showdowns and per-user votes, and enforce one vote per user.
- Upload images to Firebase Storage.
- Comments and notifications backed by real events.
- Native Google sign-in for Android and an iOS build.
- Environment-based Firebase configuration and API key restrictions.

---

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Run the dev server |
| `npm test` | Run tests in watch mode |
| `npm run build` | Production build into `build/` |
| `npx cap sync android` | Copy the build into the Android project |
| `npx cap open android` | Open the project in Android Studio |

## License

Private project. All rights reserved.
