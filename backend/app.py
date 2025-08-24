from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from db.init import test_connection
from db.lgin import login_user
from db.register import register_user
from db.verification import verify_user_image, get_verification_status

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Test database connection on startup
print("Testing database connection...")
if test_connection():
    print("Database connection successful!")
else:
    print("Database connection failed!")

# Routes
@app.route('/')
def home():
    return jsonify({
        "message": "SafeGuard Backend API",
        "status": "running"
    })

@app.route('/api/login', methods=['POST'])
def login():
    return login_user()

@app.route('/api/register', methods=['POST'])
def register():
    return register_user()

@app.route('/api/verify-image', methods=['POST'])
def verify_image():
    return verify_user_image()

@app.route('/api/verification-status/<user_id>', methods=['GET'])
def verification_status(user_id):
    return get_verification_status(user_id)

# Health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "database": "connected" if test_connection() else "disconnected"
    })

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)