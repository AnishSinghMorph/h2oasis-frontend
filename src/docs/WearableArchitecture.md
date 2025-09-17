# Wearable Integration Architecture

This document outlines the refactored wearable integration architecture for H2Oasis, designed to support multiple wearable brands through ROOK Connect.

## 🏗️ Architecture Overview

The wearable integration has been divided into modular components to support:

- **SDK-based wearables**: Apple Health, Samsung Health (via Health Connect)
- **API-based wearables**: Garmin, Fitbit, Whoop, Oura, Polar
- **Sandbox and Production environments**
- **Scalable component structure**

## 📁 File Structure

```
src/
├── components/wearables/
│   ├── WearableCard.tsx          # Individual wearable device card
│   ├── WearableGrid.tsx          # Grid layout for wearable devices
│   └── index.ts                  # Component exports
├── services/wearables/
│   ├── AppleHealthService.ts     # SDK-based Apple Health integration
│   ├── APIBasedWearableService.ts # API-based wearable integration
│   └── index.ts                  # Service exports
├── hooks/
│   ├── useWearableIntegration.ts # Main integration hook
│   └── useRookHealth.ts          # Existing ROOK health hook
├── constants/
│   └── wearables.ts              # Wearable device configurations
└── screens/
    └── ConnectWearableScreen.tsx # Refactored main screen
```

## 🧩 Components

### WearableCard

Individual card component for each wearable device with:

- Loading states
- Selection states
- "Coming Soon" indicators
- Device icons and names

### WearableGrid

Grid layout component that:

- Renders multiple WearableCard components
- Manages grid layout and spacing
- Passes through interaction handlers

## 🔧 Services

### AppleHealthService

Handles SDK-based Apple Health integration:

- Permission requests
- User configuration with ROOK
- Data synchronization
- Status checking

### APIBasedWearableService

Handles API-based wearable integrations:

- OAuth authorization flows
- ROOK authorizer endpoint integration
- Callback handling
- Multi-brand support (Garmin, Fitbit, Whoop, etc.)

## 🎣 Hooks

### useWearableIntegration

Main integration hook that:

- Manages wearable selection and loading states
- Coordinates between different service types
- Handles success/error scenarios
- Provides unified interface for the UI

## 🎯 ROOK Integration Strategy

### SDK-Based Sources (Apple Health)

```typescript
// Current implementation - working
1. Request permissions → requestHealthPermissions()
2. Configure user → configureUser(firebaseUID)
3. Sync data → syncTodayData()
```

### API-Based Sources (Garmin, Fitbit, Whoop)

```typescript
// Planned implementation
1. Build authorizer URL → buildAuthorizerUrl()
2. Open OAuth flow → WebView/Browser
3. Handle callback → handleCallback()
4. Store tokens → ROOK backend handles this
```

## 🌐 Environment Configuration

### Sandbox (Current)

```typescript
const config = {
  isSandbox: true,
  baseUrl: "https://sandbox-api.tryrook.io",
  clientId: process.env.ROOK_SANDBOX_CLIENT_UUID,
};
```

### Production (Future)

```typescript
const config = {
  isSandbox: false,
  baseUrl: "https://api.tryrook.io",
  clientId: process.env.ROOK_PRODUCTION_CLIENT_UUID,
};
```

## 🚀 Implementation Phases

### Phase 1: Apple Health (✅ Complete)

- SDK integration working
- Data syncing functional
- User flow complete

### Phase 2: Garmin Integration (🔄 Next)

To implement Garmin:

1. **Setup ROOK Credentials**

   ```bash
   # Add to environment variables
   ROOK_CLIENT_UUID=your-sandbox-client-uuid
   ROOK_SECRET_KEY=your-sandbox-secret-key
   ```

2. **Configure Deep Linking**

   ```typescript
   // In app.json or Info.plist
   "scheme": "h2oasis",
   "redirectUri": "h2oasis://wearable-callback"
   ```

3. **Update APIBasedWearableService**

   ```typescript
   // Remove isComingSoon flag for Garmin
   const garminDevice = WEARABLE_DEVICES.find((d) => d.id === "garmin");
   garminDevice.isComingSoon = false;
   ```

4. **Test in Sandbox**
   ```typescript
   // Use sandbox connections page first
   const sandboxUrl = "https://sandbox-connections.tryrook.io";
   ```

### Phase 3: Fitbit Integration

Similar to Garmin, using ROOK's Fitbit data source.

### Phase 4: Whoop Integration

⚠️ **Requires Developer Account**: Need to register with Whoop for API access.

## 🧪 Testing Strategy

### 1. Sandbox Testing

```typescript
// Test with sandbox environment
const integration = useWearableIntegration({ isSandbox: true });

// Test each wearable type
await integration.handleWearablePress(garminDevice);
await integration.handleWearablePress(fitbitDevice);
```

### 2. Production Testing

```typescript
// Switch to production after sandbox validation
const integration = useWearableIntegration({ isSandbox: false });
```

### 3. Error Scenarios

- Network failures
- Permission denials
- Invalid credentials
- Callback timeouts

## 🔍 Debugging

### Development Mode

```typescript
// Debug info shown in development
{__DEV__ && (
  <View>
    <Text>Apple Health Ready: {isAppleHealthReady ? '✅' : '❌'}</Text>
    <Text>Selected: {selectedWearable || 'None'}</Text>
    <Text>Loading States: {JSON.stringify(loadingStates)}</Text>
  </View>
)}
```

### Console Logging

All services use consistent logging:

- `🍎` Apple Health operations
- `🔗` API-based connections
- `✅` Success operations
- `❌` Error operations
- `⚠️` Warning operations

## 📚 ROOK Documentation References

- [ROOK Connect Introduction](https://docs.tryrook.io/docs/rookconnect/introduction/)
- [Data Sources](https://docs.tryrook.io/data-sources/)
- [QuickStart Guide](https://docs.tryrook.io/docs/QuickStart/)
- [API Reference](https://docs.tryrook.io/api/)

## 🔄 Next Steps

1. **Set up ROOK Sandbox credentials**
2. **Configure deep linking for OAuth callbacks**
3. **Implement Garmin integration first**
4. **Add WebView component for OAuth flows**
5. **Test complete flow in sandbox**
6. **Move to production environment**

## 💡 Benefits of This Architecture

1. **Modularity**: Each wearable type is handled separately
2. **Scalability**: Easy to add new wearable brands
3. **Maintainability**: Clear separation of concerns
4. **Testability**: Each component can be tested independently
5. **Flexibility**: Support for both SDK and API-based integrations
6. **Future-proof**: Ready for ROOK's expanding wearable support

## 🛠️ Environment Variables Needed

```bash
# ROOK Configuration
ROOK_SANDBOX_CLIENT_UUID=your-sandbox-client-uuid
ROOK_SANDBOX_SECRET_KEY=your-sandbox-secret-key
ROOK_PRODUCTION_CLIENT_UUID=your-production-client-uuid
ROOK_PRODUCTION_SECRET_KEY=your-production-secret-key

# Deep Linking
WEARABLE_REDIRECT_URI=h2oasis://wearable-callback
```

This architecture provides a solid foundation for expanding wearable support while maintaining code quality and user experience.
