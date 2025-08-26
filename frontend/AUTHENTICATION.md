# Authentication Flow

This document describes the authentication flow implemented in the Kawach app.

## Flow Overview

1. **Login Screen** (`/app/(auth)/login.tsx`)
   - Users enter email and password
   - Option to register new account
   - Emergency access option (skip login)

2. **Register Screen** (`/app/(auth)/register.tsx`)
   - Two-step registration process:
     - Step 1: Personal information (name, email, password)
     - Step 2: Verification & emergency contact information
   - Aadhar card number collection
   - Emergency contact details

3. **Verify Screen** (`/app/(auth)/verify.tsx`)
   - Camera-based identity verification
   - Users take a selfie holding their Aadhar card
   - Preview and retake functionality
   - Verification simulation

4. **Protected Screens** (`/app/tabs/`)
   - Home dashboard with safety features
   - Community features
   - SOS emergency button
   - Services listing
   - Profile management

## Navigation

- Unauthenticated users are redirected to `/app/(auth)/login.tsx`
- After successful login/registration, users are redirected to `/app/tabs/`
- Authenticated users accessing auth screens are redirected to `/app/tabs/`

## Data Storage

- User authentication token is stored in AsyncStorage
- User profile information is stored in AsyncStorage
- Verification status is stored in AsyncStorage

## API Endpoints (Backend Integration)

The following endpoints would need to be implemented in the backend:

1. **Login**: `POST /login`
   - Parameters: email, password
   - Returns: user token, profile information

2. **Register**: `POST /register`
   - Parameters: name, email, password, aadharNumber, emergencyContact
   - Returns: user token, profile information

3. **Verify**: `POST /verify`
   - Parameters: image (base64 or file upload)
   - Returns: verification status

## Error Handling

- All forms have validation
- Network errors are handled with user-friendly messages
- Camera permission errors are handled gracefully
- AsyncStorage errors are logged to console

## Security Considerations

- Passwords should be hashed before sending to backend
- Aadhar numbers should be encrypted in storage
- Authentication tokens should be securely stored
- Camera images should be processed securely