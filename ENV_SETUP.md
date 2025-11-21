# Environment Variables Setup for EAS Builds

## Overview

This project has been refactored to properly handle environment variables for EAS builds. The key principle is:

- **Local development**: Uses `.env` file
- **EAS production builds**: Uses environment variables from `eas.json` env field
- **All code**: Accesses variables via `Constants.expoConfig.extra` (NOT `process.env`)

## Architecture

### 1. app.config.js (replaces app.json)

- Reads environment variables from `process.env` (populated by EAS during builds or from `.env` locally)
- Exposes all variables through the `extra` field
- This ensures consistent access via `Constants.expoConfig.extra` throughout the app

### 2. eas.json

The `production` build profile includes all public environment variables in the `env` field:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_ROOK_ENVIRONMENT": "production",
        "EXPO_PUBLIC_ROOK_BASE_URL": "https://api.rook-connect.com",
        "EXPO_PUBLIC_OAUTH_REDIRECT_URL": "https://api.h2oasis.ai/oauth/wearable/callback",
        ...
      }
    }
  }
}
```

### 3. EAS Secrets

Sensitive values (API keys, secrets) are stored in EAS Secrets:

```bash
eas secret:push --scope project --env-file .env
```

These are automatically injected during builds and accessible via `process.env` in `app.config.js`.

## Environment Variables

### ROOK Configuration
- `EXPO_PUBLIC_ROOK_CLIENT_UUID` - ROOK client UUID (stored in EAS Secrets)
- `EXPO_PUBLIC_ROOK_SECRET_KEY` - ROOK secret key (stored in EAS Secrets)
- `EXPO_PUBLIC_ROOK_BASE_URL` - ROOK API base URL (in eas.json)
- `EXPO_PUBLIC_ROOK_ENVIRONMENT` - ROOK environment: "sandbox" or "production" (in eas.json)

### OAuth Configuration
- `EXPO_PUBLIC_OAUTH_REDIRECT_URL` - OAuth redirect URL for wearable connections (in eas.json)

### Firebase Configuration (stored in EAS Secrets)
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Google Sign-In Configuration (stored in EAS Secrets)
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

## Code Usage

### ✅ CORRECT: Using Constants.expoConfig.extra

```typescript
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const apiKey = extra.firebaseApiKey;
```

### ❌ INCORRECT: Using process.env directly

```typescript
// DON'T DO THIS - won't work in production builds!
const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
```

## Files Modified

1. **app.config.js** - Created to replace app.json, exposes all env vars via `extra`
2. **src/config/firebase.ts** - Updated to use `Constants.expoConfig.extra`
3. **src/config/rookConfig.ts** - Updated to use `Constants.expoConfig.extra`
4. **src/context/AuthContext.tsx** - Updated to use `Constants.expoConfig.extra`
5. **eas.json** - Updated production profile with all env vars

## Local Development

1. Copy `.env.example` to `.env` (if not already done)
2. Fill in your environment variables
3. Run `npx expo start`

The `.env` file is automatically loaded and values are accessible via `Constants.expoConfig.extra`.

## Production Builds

1. Ensure sensitive values are in EAS Secrets:
   ```bash
   eas secret:push --scope project --env-file .env
   ```

2. Update `eas.json` production profile with non-sensitive values

3. Build:
   ```bash
   eas build --platform ios --profile production
   ```

4. Submit to TestFlight:
   ```bash
   eas submit --platform ios --latest
   ```

## Key Points

- `.env` files are **ignored** during EAS builds
- All environment variables must be in `eas.json` env field OR EAS Secrets
- Code must use `Constants.expoConfig.extra`, NOT `process.env`
- `app.config.js` acts as the bridge between `process.env` and `Constants.expoConfig.extra`

## Troubleshooting

### Environment variables not loading in TestFlight

1. Verify variables are in `eas.json` or EAS Secrets
2. Check `app.config.js` exposes them in the `extra` field
3. Ensure code uses `Constants.expoConfig.extra` (not `process.env`)
4. Rebuild with EAS Build (not local Xcode build)

### Local development not picking up .env changes

1. Clear Metro bundler cache: `npx expo start -c`
2. Restart the development server
3. Verify `.env` file is in the project root
