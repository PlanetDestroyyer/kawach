# SafeGuard Backend

## Overview
This is the backend API for the SafeGuard women's safety application. It provides authentication, user management, and safety features.

## Features
- User authentication (login/register)
- Identity verification with Aadhar card
- Emergency contact management
- Location tracking
- SOS functionality
- Community features

## Technologies Used
- Python
- Flask (Web Framework)
- MongoDB (Database)
- PyMongo (MongoDB Driver)
- JWT (Authentication)
- Bcrypt (Password Hashing)

## Prerequisites
- Python 3.8+
- MongoDB Atlas account (or local MongoDB instance)
- pip (Python package manager)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the backend directory with the following:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SECRET_KEY=your_secret_key_for_jwt
   ```

## Database Structure
The application uses MongoDB with the following collections:
- `customer` - User information
- `last` - Last location records
- `lang_log_new` - Language logs
- `poll` - Poll system data
- `news` - News/updates
- `verification` - Image verification records

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Verification
- `POST /api/verify-image` - Submit identity verification image
- `GET /api/verification-status/<user_id>` - Get verification status

### Health Check
- `GET /api/health` - Check API health status

## Running the Application

### Development
```bash
python app.py
```

The server will start on `http://localhost:5000`

### Production
For production deployment, use a WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `SECRET_KEY` - Secret key for JWT token signing
- `PORT` - Port to run the server on (default: 5000)

## Security Considerations
- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- MongoDB connection is secured with credentials
- Aadhar numbers should be encrypted in production
- Image data should be encrypted in production

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
This project is licensed under the MIT License.