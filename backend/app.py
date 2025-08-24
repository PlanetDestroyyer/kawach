from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from db.init import test_connection
from db.lgin import login_user
from db.register import register_user
from db.verification import verify_user_image, get_verification_status
from db.heatmap import get_heatmap_data
from db.safety_poll import submit_safety_poll, get_safety_polls

# Create Flask app
app = Flask(__name__)
# Enable CORS for all routes with more permissive settings for mobile apps
CORS(app, origins=["*"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
     allow_headers=["Content-Type", "Authorization"], supports_credentials=True)

# Test database connection on startup
print("Testing database connection...")
if test_connection():
    print("Database connection successful!")
else:
    print("Database connection failed!")

# Add a before request handler to log all requests
@app.before_request
def log_request_info():
    print(f"Incoming request: {request.method} {request.url}")
    print(f"Headers: {dict(request.headers)}")
    if request.data:
        print(f"Body: {request.data}")

# Add an after request handler to log responses
@app.after_request
def log_response_info(response):
    print(f"Response status: {response.status}")
    print(f"Response headers: {dict(response.headers)}")
    return response

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

# Add a simple test endpoint
@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({
        "message": "API is accessible",
        "status": "success"
    })

@app.route('/api/heatmap', methods=['GET'])
def heatmap():
    return get_heatmap_data()

@app.route('/api/safety-poll', methods=['POST'])
def safety_poll():
    return submit_safety_poll()

@app.route('/api/safety-polls', methods=['GET'])
def safety_polls():
    return get_safety_polls()

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # Make sure the host is 0.0.0.0 to accept connections from other devices
    print(f"Starting server on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)