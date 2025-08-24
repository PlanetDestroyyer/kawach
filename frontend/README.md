# SafeGuard - Women Safety App

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- Expo CLI
- Android/iOS simulator or Expo Go app on your mobile device

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

#### For Development
```bash
npx expo start
```

This will start the development server and provide options to:
- Open in Expo Go app (scan QR code)
- Run on Android emulator (`a` key)
- Run on iOS simulator (`i` key)

#### For Web
```bash
npx expo start --web
```

## Authentication Flow

The app implements a complete authentication system:

1. **Login Screen** - Existing users can sign in with email/password
2. **Registration** - New users can create an account with:
   - Personal information
   - Aadhar card details
   - Emergency contact information
3. **Identity Verification** - Users verify their identity by taking a selfie with their Aadhar card
4. **Protected Screens** - Main app features are only accessible to authenticated users

## Features

- Emergency SOS system
- Trusted contacts management
- Location tracking and sharing
- Incident reporting
- Safety tips and self-defense techniques
- Community features
- Fake call and loud siren emergency tools

## Project Structure

```
app/
├── (auth)/          # Authentication screens
│   ├── login.tsx     # Login screen
│   ├── register.tsx  # Registration screen
│   ├── verify.tsx    # Identity verification screen
│   └── _layout.tsx   # Auth layout
├── tabs/             # Main app screens (protected)
│   ├── index.tsx     # Home dashboard
│   ├── community.tsx # Community features
│   ├── sos.tsx       # Emergency SOS
│   ├── service.tsx   # Services listing
│   ├── profile.tsx   # User profile
│   └── _layout.tsx   # Tab navigation layout
├── _layout.tsx       # Root layout with auth protection
└── ...
```

## Backend Integration

To connect with a backend, implement the following endpoints:

1. `POST /login` - User authentication
2. `POST /register` - User registration
3. `POST /verify` - Identity verification

## Troubleshooting

### Common Issues

1. **Metro bundler errors**: Clear cache and restart
   ```bash
   npx expo start -c
   ```

2. **Android build issues**: Ensure Android Studio and emulator are properly configured

3. **iOS build issues**: Ensure Xcode is installed (macOS only)

### Dependencies

The app uses the following key dependencies:
- React Native
- Expo
- TypeScript
- React Navigation (expo-router)
- AsyncStorage for local storage
- expo-camera for identity verification
- MaterialIcons for UI icons

## Development Notes

- The app uses a dark theme with custom colors
- All screens are responsive and work on mobile devices
- Authentication state is managed with AsyncStorage
- Camera permissions are handled gracefully