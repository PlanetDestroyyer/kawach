# Kawach - Women Safety App

A comprehensive women safety application with emergency features, built with a React Native frontend and Python backend.

## Overview

Kawach is a mobile application designed to enhance personal safety for women through a variety of features including emergency SOS, location tracking, trusted contacts management, incident reporting, and community support.

## Project Structure

```
women_safety/
├── backend/          # Python backend services
├── frontend/         # React Native mobile app (Expo)
└── ui/              # Original web UI designs (Next.js)
```

## Features

### Frontend (Mobile App)
1. **Emergency SOS** - Send immediate distress signals to contacts and authorities
2. **Trusted Contacts** - Manage emergency contacts and quick dial options
3. **Incident Reporting** - Document and report safety concerns with evidence
4. **Safety Tips** - Learn self-defense and safety techniques
5. **Location Tracking** - Share live location with trusted contacts
6. **Community Support** - Connect with other users and share experiences
7. **Fake Call** - Simulate incoming calls to escape uncomfortable situations
8. **Loud Siren** - Activate high-volume alarm to attract attention
9. **Identity Verification** - Verify identity for full access to features
10. **Profile Management** - Manage personal information and safety preferences

### Backend (Python Services)
1. **Geolocation Engine** - Location tracking and mapping services
2. **LLM Assistant** - AI-powered safety assistant
3. **Web Scraper** - Gather safety information and news
4. **SOS Core** - Emergency response system
5. **Database Services** - User management and data storage
6. **Specialized Services** - Legal assistance and mental health support

## Technology Stack

### Frontend
- React Native
- Expo
- TypeScript
- React Navigation (expo-router)
- AsyncStorage for local data storage

### Backend
- Python
- Flask
- MongoDB (via PyMongo)
- spaCy (NLP)
- Requests (HTTP library)
- feedparser (RSS parsing)
- bcrypt (password hashing)
- PyJWT (JSON Web Tokens)

## Getting Started

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add your MongoDB credentials:
     ```
     MONGODB_USERNAME=your_username
     MONGODB_PASSWORD=your_password
     MONGODB_CLUSTER=your_cluster_url
     MONGODB_DATABASE=your_database_name
     SECRET_KEY=your_secret_key
     ```

4. Start the Flask server:
   ```bash
   python app.py
   ```
   The server will start on `http://0.0.0.0:5000` and will be accessible from other devices on the same network.

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URL in `.env` file:
   - Find your machine's IP address (run `ifconfig` or `ipconfig` in terminal)
   - Update `EXPO_PUBLIC_API_URL` in `frontend/.env` with your machine's IP address:
     ```
     EXPO_PUBLIC_API_URL=http://YOUR_MACHINE_IP:5000
     ```

4. Start the development server:
   ```bash
   npx expo start
   ```

## Authentication Flow

The app implements a complete authentication flow:

1. **Login**: Users can log in with email and password
2. **Registration**: New users can create an account with personal and emergency contact information
3. **Identity Verification**: Users must verify their identity with a selfie and Aadhar card
4. **Session Management**: User sessions are managed with JWT tokens stored in AsyncStorage

### Emergency Access
The app provides emergency access for users who need immediate access without authentication. This grants limited access to core safety features.

## Dynamic Features

### Real-time Location Tracking
- Live GPS tracking with accuracy indicators
- Location sharing with trusted contacts
- Safe route recommendations

### Emergency SOS System
- One-tap emergency alerts
- Automatic location sharing
- Multi-channel notifications (SMS, email, app notifications)

### Trusted Contacts Management
- Add and manage emergency contacts
- Quick dial functionality
- Relationship categorization

### Incident Reporting
- Document safety incidents with photos and location
- Add detailed descriptions and tags
- View incident history

### Community Support
- Share experiences and advice
- Connect with other users
- Access safety resources

## Connection Troubleshooting

If the frontend cannot connect to the backend, follow these steps:

### 1. Verify Backend is Running
Make sure the backend server is running:
```bash
cd backend
python app.py
```
You should see output like:
```
Testing database connection...
Database connection successful!
Starting server on http://0.0.0.0:5000
```

### 2. Find Your Machine's IP Address
On your computer (where the backend is running):

**Windows:**
```cmd
ipconfig
```

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
```

Look for an IP address that starts with `192.168.x.x` or `10.x.x.x`. In your case, it's `192.168.0.102`.

### 3. Update Frontend Configuration
The app now includes automatic IP detection that will try to find the backend server on the local network. It will try common IP addresses like:
- `192.168.0.102` (your current backend IP)
- `192.168.1.100`
- `192.168.0.100`
- `10.0.0.100`
- `172.16.0.100`

If automatic detection doesn't work, you can manually set the backend URL in the `frontend/.env` file:
```
EXPO_PUBLIC_API_URL=http://192.168.0.102:5000
```

### 4. Test the Connection
You can test if the backend is accessible by opening this URL in your browser:
```
http://192.168.0.102:5000/api/test
```

You should see a response like:
```json
{
  "message": "API is accessible",
  "status": "success"
}
```

### 5. Same Network Requirement
Make sure both your computer (backend) and mobile device (frontend) are on the same WiFi network.

### 6. Firewall Settings
Ensure your computer's firewall allows connections on port 5000.

### 7. Common Issues and Solutions

**Issue: "Network request failed"**
- Solution: Check that both devices are on the same network and the IP address is correct

**Issue: Backend starts but connection fails**
- Solution: Make sure the backend is binding to `0.0.0.0` not `127.0.0.1`

**Issue: Can't find the correct IP**
- Solution: Try common IP ranges like:
  - `192.168.1.x`
  - `192.168.0.x`
  - `10.0.0.x`

### 8. Advanced Debugging

You can run the connection test utility in the frontend to diagnose issues:

1. Open the developer menu in Expo (shake device or `Ctrl+M`/`Cmd+M`)
2. Select "Debug Remote JS"
3. Open the browser console to see detailed logs

Alternatively, you can run the backend discovery script:
```bash
cd frontend
node find-backend.js
```

Or use the npm script:
```bash
cd frontend
npm run find-backend
```

## Testing

### Backend Testing
Run the backend tests:
```bash
cd backend
python test_backend.py
```

### Frontend Testing
Run the frontend tests:
```bash
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.