# 🌊 H2Oasis Frontend

> **AI-Powered Wellness Companion for Recovery Experiences**  
> React Native mobile application with conversational AI and health data integration

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76.6-61DAFB.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~52.0.29-000020.svg)](https://expo.dev/)
[![Tests](https://img.shields.io/badge/Tests-26%20passing-success.svg)](https://github.com/AnishSinghMorph/h2oasis-frontend)

---

## 📱 About

H2Oasis is a mobile wellness application that combines:
- **🗣️ Conversational AI**: Real-time voice conversations with AI personas using ElevenLabs
- **📊 Health Data Integration**: Multi-wearable device support (Apple Health, Garmin, Fitbit, Whoop, Oura)
- **🏊 Personalized Recovery**: Tailored experiences for cold plunge, hot tub, and sauna sessions
- **🔊 Voice Interface**: Advanced speech-to-text and text-to-speech capabilities

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v9.x or higher
- **Expo CLI**: Latest version
- **iOS Simulator** (Mac only) or **Android Studio** (for Android development)

### Installation

```bash
# Clone the repository
git clone https://github.com/AnishSinghMorph/h2oasis-frontend.git
cd h2oasis-frontend

# Install dependencies (use legacy-peer-deps for compatibility)
npm install --legacy-peer-deps

# Start the development server
npm start
```

### Running on Devices

```bash
# iOS Simulator (Mac only)
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

---

## 🏗️ Project Structure

```
h2oasis-frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── AnimatedVoiceOrb.tsx      # Voice chat visual feedback
│   │   ├── ConversationalAI.tsx      # ElevenLabs voice interface
│   │   ├── AppleHealthSync.tsx       # Apple Health integration
│   │   └── wearables/                # Wearable-specific components
│   ├── config/               # App configuration
│   │   ├── elevenlabs.ts             # ElevenLabs settings & voices
│   │   └── rookConfig.ts             # ROOK Health API config
│   ├── context/              # React context providers
│   │   ├── AuthContext.tsx           # Authentication state
│   │   ├── SetupProgressContext.tsx  # Onboarding progress
│   │   └── VoiceContext.tsx          # Voice selection state
│   ├── hooks/                # Custom React hooks
│   │   ├── useWearableIntegration.ts # Wearable device management
│   │   └── useSamsungHealth.ts       # Samsung Health integration
│   ├── navigation/           # Navigation setup
│   │   └── AppNavigator.tsx          # Main navigation config
│   ├── screens/              # Application screens
│   │   ├── AIAssistantScreen.tsx     # AI conversation interface
│   │   ├── ChoosePersonaScreen.tsx   # Voice persona selection
│   │   ├── ConnectWearableScreen.tsx # Wearable setup
│   │   ├── DashboardScreen.tsx       # Main dashboard
│   │   ├── LoginScreen.tsx           # User login
│   │   └── SignUpScreen.tsx          # User registration
│   ├── services/             # API service layer
│   │   ├── api.ts                    # Base API configuration
│   │   ├── elevenlabsService.ts      # ElevenLabs API
│   │   ├── healthDataService.ts      # Health data API
│   │   ├── RookAPIService.ts         # ROOK Health API
│   │   └── wearables/                # Wearable-specific services
│   ├── styles/               # Global styles
│   └── types/                # TypeScript type definitions
├── __tests__/                # Test files
│   ├── setup.ts              # Test configuration
│   ├── services/             # Service tests
│   └── hooks/                # Hook tests
├── assets/                   # Static assets (images, icons)
├── App.tsx                   # Main app component
├── package.json              # Dependencies & scripts
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

### **Core Technologies**
- **React Native**: Cross-platform mobile development
- **Expo**: Development and build tooling
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Screen navigation and routing

### **State Management**
- **React Context API**: Global state management
- **AsyncStorage**: Local data persistence
- **React Hooks**: Component state and side effects

### **UI/UX Libraries**
- **React Native Animated**: Smooth animations
- **Expo Linear Gradient**: Gradient backgrounds
- **React Native SVG**: Vector graphics support

### **AI & Voice**
- **ElevenLabs Conversational AI**: Real-time voice conversations
- **Speech-to-Text**: Voice input processing
- **Text-to-Speech**: AI voice responses
- **Expo AV**: Audio playback and recording

### **Health Data Integration**
- **ROOK Health SDK**: Multi-wearable data aggregation
- **Apple HealthKit**: iOS health data access
- **Samsung Health SDK**: Android health data access
- **ROOK API**: Unified health data interface

### **Authentication**
- **Firebase Authentication**: User management
- **JWT Tokens**: Secure API authentication
- **AsyncStorage**: Session persistence

### **Testing**
- **Jest**: Testing framework
- **React Native Testing Library**: Component testing
- **jest-expo**: Expo-specific test utilities

### **Code Quality**
- **ESLint**: Code linting and standards
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

---

## 📝 Available Scripts

### Development
```bash
# Start Expo development server
npm start

# Start with cache cleared
npm start -- --clear

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format code with Prettier
npm run format

# TypeScript type checking
npm run type-check
```

### Building
```bash
# Build for web
npm run build:web

# Create production build
npm run build

# EAS build for Android
npx eas-cli build --platform android

# EAS build for iOS
npx eas-cli build --platform ios
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000

# ROOK Health API
EXPO_PUBLIC_ROOK_CLIENT_UUID=your-client-uuid
EXPO_PUBLIC_ROOK_SECRET_KEY=your-secret-key
EXPO_PUBLIC_ROOK_BASE_URL=https://api.rook-connect.review
EXPO_PUBLIC_ROOK_ENVIRONMENT=sandbox

# ElevenLabs API
EXPO_PUBLIC_ELEVENLABS_API_KEY=your-api-key

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

---

## 🧪 Testing

### Test Coverage
- **26 tests** across 4 test suites
- **100% passing** rate
- Coverage includes:
  - API configuration and services
  - ROOK Health API integration
  - Custom hooks (wearable integration)
  - Component rendering and snapshots

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test -- __tests__/services/api.test.ts

# Watch mode for development
npm test -- --watch
```

### Test Structure
```
__tests__/
├── setup.ts                           # Global test setup
├── services/
│   ├── api.test.ts                    # API configuration tests (7 tests)
│   └── RookAPIService.test.ts         # ROOK service tests (8 tests)
├── hooks/
│   └── useWearableIntegration.test.ts # Hook tests (11 tests)
└── __snapshots__/                     # Jest snapshots
```

---

## 🎨 Key Features

### 1. **Conversational AI Interface**
- Real-time voice conversations with AI personas
- Multiple personality options (Alice, Marcus, Sophia, etc.)
- Animated voice orb for visual feedback
- Background audio processing

### 2. **Health Data Integration**
- Support for 5+ wearable devices
- Unified health data API
- Real-time sync status
- Historical data visualization

### 3. **Product Selection**
- Cold Plunge, Hot Tub, Sauna options
- Personalized recommendations
- Selection history tracking

### 4. **User Authentication**
- Email/password registration
- Firebase authentication
- Secure session management
- Profile customization

### 5. **Onboarding Flow**
- Step-by-step setup process
- Progress tracking
- Contextual help and guidance

---

## 🔧 Configuration

### ElevenLabs Voice Personas
Located in `src/config/elevenlabs.ts`:

```typescript
export const VOICE_PERSONAS = {
  alice: {
    name: "Alice",
    voiceId: "Xb7hH8MSUJpSbSDYk0k2",
    description: "Warm and encouraging",
    agentId: "agent_id_here"
  },
  // ... more personas
};
```

### ROOK Health Configuration
Located in `src/config/rookConfig.ts`:

```typescript
export const ROOK_CONFIG = {
  clientUUID: process.env.EXPO_PUBLIC_ROOK_CLIENT_UUID,
  secretKey: process.env.EXPO_PUBLIC_ROOK_SECRET_KEY,
  environment: "sandbox", // or "production"
  baseURL: "https://api.rook-connect.review"
};
```

---

## 🚀 Deployment

### EAS Build (Expo Application Services)

```bash
# Configure EAS
npx eas-cli build:configure

# Build for Android
npx eas-cli build --platform android --profile production

# Build for iOS
npx eas-cli build --platform ios --profile production

# Submit to app stores
npx eas-cli submit --platform android
npx eas-cli submit --platform ios
```

### CI/CD Pipeline
- Automated testing on every push
- ESLint and Prettier checks
- TypeScript compilation validation
- Security audit
- Automated builds for main branch

---

## 📊 Performance Optimization

### Best Practices Implemented
- ✅ **Lazy Loading**: Components loaded on demand
- ✅ **Memoization**: React.memo for expensive components
- ✅ **Native Animations**: Using React Native Animated API
- ✅ **Image Optimization**: Proper image sizing and formats
- ✅ **AsyncStorage**: Efficient local data caching

### Performance Monitoring
- React DevTools for component profiling
- Expo performance monitoring
- Network request optimization

---

## 🐛 Troubleshooting

### Common Issues

**Issue: npm install fails with peer dependency errors**
```bash
# Solution: Use legacy-peer-deps flag
npm install --legacy-peer-deps
```

**Issue: Expo app won't start**
```bash
# Solution: Clear cache and reinstall
npm start -- --clear
rm -rf node_modules
npm install --legacy-peer-deps
```

**Issue: Tests failing**
```bash
# Solution: Update snapshots
npm test -- -u
```

**Issue: TypeScript errors**
```bash
# Solution: Check types
npm run type-check
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint and Prettier rules
- Write tests for new features
- Update documentation
- Use TypeScript for type safety

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Team

- **Anish Singh** - Lead Developer
- **Jonas (ROOK Team)** - Health Data Integration

---

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Contact the development team

---

## 🔗 Related Projects

- [H2Oasis Backend](https://github.com/AnishSinghMorph/h2oasis-backend) - API server
- [ElevenLabs Conversational AI](https://elevenlabs.io) - Voice AI platform
- [ROOK Health](https://tryrook.io) - Health data aggregation

---

**Built with ❤️ for wellness and recovery**
