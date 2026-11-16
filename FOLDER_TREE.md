# Recurly-rn Folder Tree

```text
Recurly-rn/
├── assets/
│   ├── expo.icon/
│   │   ├── Assets/
│   │   │   ├── expo-symbol 2.svg
│   │   │   └── grid.png
│   │   └── icon.json
│   ├── fonts/
│   │   └── PlusJakartaSans-{Bold,ExtraBold,Light,Medium,Regular,SemiBold}.ttf
│   ├── icons/
│   │   └── activity, add, adobe, back, canva, claude, dropbox, figma, github,
│   │       home, logo, medium, menu, netflix, notion, openai, plus, setting,
│   │       spotify, wallet.png
│   └── images/
│       ├── tabIcons/
│       │   ├── explore{,@2x,@3x}.png
│       │   └── home{,@2x,@3x}.png
│       └── Auth_Flow, avatar, android-icon-*, expo-*, favicon, icon,
│           logo-glow, react-logo*, splash-*, tutorial-web.png
├── components/
│   ├── CreateSubscriptionModal.tsx
│   ├── ListHeading.tsx
│   ├── MyAppText.tsx
│   ├── SubscriptionCard.tsx
│   └── UpcomingSubscriptionCard.tsx
├── constants/
│   ├── data.ts
│   ├── icons.ts
│   ├── images.ts
│   └── theme.ts
├── context/
│   └── NotificationContext.tsx
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── example/                         # Expo starter/example implementation
│   ├── scripts/
│   │   └── reset-project.js
│   └── src/
│       ├── app/
│       │   ├── _layout.tsx
│       │   ├── explore.tsx
│       │   └── index.tsx
│       ├── components/
│       │   ├── ui/
│       │   │   └── collapsible.tsx
│       │   ├── animated-icon.module.css
│       │   ├── animated-icon.tsx
│       │   ├── animated-icon.web.tsx
│       │   ├── app-tabs.tsx
│       │   ├── app-tabs.web.tsx
│       │   ├── external-link.tsx
│       │   ├── hint-row.tsx
│       │   ├── themed-text.tsx
│       │   ├── themed-view.tsx
│       │   └── web-badge.tsx
│       ├── constants/
│       │   └── theme.ts
│       ├── hooks/
│       │   ├── use-color-scheme.ts
│       │   ├── use-color-scheme.web.ts
│       │   └── use-theme.ts
│       └── global.css
├── lib/
│   └── utils.ts
├── src/
│   ├── app/                          # Expo Router routes
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── sign-in.tsx
│   │   │   └── sign-up.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── insights.tsx
│   │   │   ├── settings.tsx
│   │   │   └── subscriptions.tsx
│   │   ├── subscriptions/
│   │   │   └── [id].tsx
│   │   ├── _layout.tsx
│   │   └── onboarding.tsx
│   └── lib/
│       ├── posthog-logs.ts
│       └── posthog.ts
├── utils/
│   └── registerForPushNotificationAsync.tsx
├── .env.example
├── .easignore
├── .gitignore
├── AGENTS.md
├── app.json
├── eas.json
├── eslint.config.js
├── expo-env.d.ts
├── global.css
├── google-services.json
├── image.d.ts
├── LICENSE
├── metro.config.js
├── nativewind-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── FOLDER_TREE.md
├── tsconfig.json
└── type.d.ts
```

Generated dependencies, `.env`, and the Firebase admin service-account key are omitted.
