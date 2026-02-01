This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.


src/
 ├─ api/
 │   ├─ client.ts          # axios instance
 │   ├─ interceptors.ts    # subscription/auth handling
 │   └─ endpoints.ts
 ├─ auth/
 │   ├─ auth.store.ts      # zustand auth state
 │   ├─ auth.service.ts    # login / logout
 │   └─ AuthGate.tsx
 ├─ subscription/
 │   ├─ subscription.store.ts
 │   ├─ PaywallScreen.tsx
 │   └─ useSubscription.ts
 ├─ navigation/
 │   ├─ AppNavigator.tsx
 │   └─ RootNavigator.tsx
 ├─ features/
 │   ├─ quiz/
 │   ├─ profile/
 │   └─ dashboard/
 └─ utils/
------------------------------------------------
 Phase 1 — Foundation

1️⃣ Login Screen
2️⃣ Signup Screen (with referral)
3️⃣ Auth Store + Token Handling
4️⃣ Navigation (Auth ↔ App)

Phase 2 — Core App

5️⃣ Home Screen
6️⃣ Practice Questions Screen
7️⃣ Mock Test Screen

Phase 3 — Business

8️⃣ Dashboard Analytics Screen
9️⃣ Subscription / Payment Screen
🔟 Referral Info Screen
------------------------------------------------------
✅ STEP 1 — API & AUTH CORE (FOUNDATION)

(Do this first, otherwise everything breaks later)

api/endpoints.ts

api/client.ts

api/interceptors.ts

auth/auth.store.ts

auth/auth.service.ts

auth/AuthGate.tsx

📌 Outcome:

Login works

Refresh works

App survives token expiry

✅ STEP 2 — AUTH SCREENS

Login Screen

Signup Screen (with referral)

📌 Outcome:

User can enter app

✅ STEP 3 — HOME + PRACTICE

Home Screen

Practice Start

Practice Question UI

📌 Outcome:

Core value delivered

✅ STEP 4 — MOCK TEST ENGINE

Mock Start

Mock Question + Timer

Submit Mock

✅ STEP 5 — BUSINESS FEATURES

Dashboard (Victory Native Charts)

Subscription Paywall

Razorpay integration

Referral earnings UI

✅ STEP 6 — GAMIFICATION & SOCIAL (NEW)

Challenges Mode (1v1 Async Battles)

Challenge Lobby & Code Sharing

Exam Mode (Question Grid, Timer, Delayed Feedback)

Editable Profile (Backend Integrated)

------------------------------------------------
## 📱 Key Architecture Updates
- **Navigation**: Moved to a `CustomDrawer` architecture accessible from the feed.
- **Charts**: Used `victory-native` for high-performance dashboard analytics.
- **API**: Centralized in `src/api` with Android Emulator support (`10.0.2.2`).

## ⏭ Next Steps / Improvements
1. **Socket.io Integration**: Replace polling in `ChallengeLobbyScreen` with real-time sockets.
2. **Animation Polish**: Add more micro-interactions to the Quiz Feed.
3. **Offline Mode**: Cache questions using `AsyncStorage`.