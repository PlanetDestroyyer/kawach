# SafeGuard - Women Safety App

A comprehensive women safety application with emergency features, built with a React Native frontend and Python backend.

## Overview

SafeGuard is a mobile application designed to enhance personal safety for women through a variety of features including emergency SOS, location tracking, trusted contacts management, incident reporting, and community support.

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

### Backend
- Python
- Flask/FastAPI
- spaCy (NLP)
- Requests (HTTP library)
- feedparser (RSS parsing)

## Getting Started

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the services:
   ```bash
   python main.py
   ```

## Integration

The frontend has been enhanced with comprehensive UI designs from the `ui` folder, transforming the basic Expo app into a feature-rich safety application with a modern dark theme and intuitive interface.

## Screenshots

*(Add screenshots of the mobile app here)*

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.