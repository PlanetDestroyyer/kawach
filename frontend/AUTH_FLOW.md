# Authentication Flow Documentation

## Overview
This document describes the complete authentication flow implemented in the SafeGuard women's safety app, connecting the frontend to the backend API.

## Authentication Flow

### 1. Login Screen (`/app/(auth)/login.tsx`)
- Users enter email and password
- Makes POST request to `/api/login` endpoint
- Stores JWT token and user profile in AsyncStorage
- Redirects to main app on success

### 2. Registration Screen (`/app/(auth)/register.tsx`)
- Two-step registration process:
  1. Personal information (name, email, password)
  2. Aadhar details and emergency contact
- Makes POST request to `/api/register` endpoint
- Stores JWT token and user profile in AsyncStorage
- Redirects to verification screen on success

### 3. Verification Screen (`/app/(auth)/verify.tsx`)
- Camera-based identity verification
- Users take selfie with Aadhar card
- Converts image to base64 and sends to backend
- Makes POST request to `/api/verify-image` endpoint
- Updates verification status in AsyncStorage
- Redirects to main app on success

### 4. Route Protection (`/app/_layout.tsx`)
- Checks authentication status on app startup
- Redirects unauthenticated users to login
- Protects main app screens with authentication guard

## API Endpoints

### Authentication
- `POST /api/login` - User authentication
- `POST /api/register` - User registration
- `POST /api/verify-image` - Identity verification
- `GET /api/verification-status/:user_id` - Get verification status
- `GET /api/health` - API health check

## Data Storage

### AsyncStorage Keys
- `userToken` - JWT authentication token
- `userProfile` - User information (name, email, Aadhar, emergency contact)
- `isVerified` - Identity verification status

## Security Features

### 1. Password Security
- Passwords are hashed with bcrypt before storage
- Minimum 6-character password requirement
- Password confirmation during registration

### 2. Token-Based Authentication
- JWT tokens for stateless authentication
- Tokens expire after 24 hours
- Tokens stored securely in AsyncStorage

### 3. Data Validation
- Email format validation
- Aadhar number (12 digits) validation
- Emergency contact information validation
- Input sanitization to prevent injection attacks

### 4. Identity Verification
- Camera-based verification with Aadhar card
- Image conversion to base64 for transmission
- Backend storage of verification images

## Error Handling

### Network Errors
- Graceful handling of network connectivity issues
- User-friendly error messages
- Retry mechanisms for failed requests

### Validation Errors
- Field-specific validation messages
- Real-time validation feedback
- Prevention of submission with invalid data

### Authentication Errors
- Proper handling of invalid credentials
- Account lockout prevention
- Clear error messaging for user guidance

## Testing

### API Connection Test
Run the following command to test API connectivity:
```bash
cd frontend
npx expo start
# Then check the console logs for API connection status
```

### Manual Testing
1. Start the backend server:
   ```bash
   cd backend
   python app.py
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npx expo start
   ```

3. Test the complete flow:
   - Register a new user
   - Login with registered credentials
   - Complete identity verification
   - Access protected screens

## Future Enhancements

### 1. Biometric Authentication
- Integration with fingerprint/face recognition
- Enhanced security with biometric factors

### 2. Multi-Factor Authentication
- SMS/email verification codes
- Backup authentication methods

### 3. Session Management
- Automatic token refresh
- Session timeout handling
- Concurrent session detection

### 4. Enhanced Security
- End-to-end encryption for sensitive data
- Rate limiting for authentication attempts
- Advanced threat detection