from flask import jsonify, request
import bcrypt
from .init import customer_records
import jwt
import datetime
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')

def login_user():
    """
    Handle user login
    Expected JSON input:
    {
        "email": "user@example.com",
        "password": "user_password"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate input
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({
                "success": False,
                "message": "Email and password are required"
            }), 400
        
        email = data['email']
        password = data['password']
        
        # Find user by email
        user = customer_records.find_one({"email": email})
        
        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401
        
        # Check password
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            # Generate JWT token
            token = jwt.encode({
                'user_id': str(user['_id']),
                'email': user['email'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm='HS256')
            
            # Remove password from user data
            user_data = {key: value for key, value in user.items() if key != 'password'}
            user_data['_id'] = str(user_data['_id'])
            
            return jsonify({
                "success": True,
                "message": "Login successful",
                "token": token,
                "user": user_data
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Login error: {str(e)}"
        }), 500

def verify_token(token):
    """
    Verify JWT token
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload, True
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}, False
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}, False