# SafeGuard - Women Safety App (Frontend)

A comprehensive women safety application with emergency features built with React Native and Expo.

## Features

1. **Emergency SOS** - Send immediate distress signals to contacts and authorities
2. **Trusted Contacts** - Manage emergency contacts and quick dial options
3. **Incident Reporting** - Document and report safety concerns with evidence
4. **Safety Tips** - Learn self-defense and safety techniques
5. **Location Tracking** - Share live location with trusted contacts
6. **Community Support** - Connect with other users and share experiences
7. **Fake Call** - Simulate incoming calls to escape uncomfortable situations
8. **Loud Siren** - Activate high-volume alarm to attract attention

## Screens

- **Home** - Main dashboard with location tracking and quick access features
- **Community** - Connect with other users, share safety tips and experiences
- **SOS** - Emergency screen with primary SOS button and quick actions
- **Services** - Access all safety services and features
- **Profile** - Manage profile information and safety preferences

## Technology Stack

- React Native
- Expo
- TypeScript
- React Navigation (expo-router)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Run on iOS:
   ```bash
   npx expo run:ios
   ```

4. Run on Android:
   ```bash
   npx expo run:android
   ```

## Design Integration

This frontend integrates designs from the UI folder, transforming Next.js components into React Native components while maintaining the same functionality and user experience.

## Color Scheme

The app uses a dark theme with the following color palette:
- Background: #0f0f0f (deep dark)
- Cards: #1a1a1a (darker card background)
- Primary: #4a4458 (muted purple)
- Secondary: #5a3d7a (darker purple)
- Accent: #2d5aa0 (darker blue)
- Destructive: #cc3333 (less bright red)
- Text: #e5e5e5 (softer white)
- Muted Text: #a0a0a0 (more muted text)

## Folder Structure

```
app/
  _layout.tsx     # Tab navigation layout
  index.tsx       # Home screen
  community.tsx   # Community features
  sos.tsx         # Emergency SOS screen
  service.tsx     # Safety services
  profile.tsx     # User profile and settings
```