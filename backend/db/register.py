import datetime
from flask import jsonify, request
import bcrypt
from .init import customer_records
import re
from bson import ObjectId

def register_user():
    """
    Handle user registration
    Expected JSON input:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "user_password",
        "aadhar_number": "123456789012",
        "emergency_contact": {
            "name": "Emergency Contact Name",
            "phone": "+1234567890",
            "relation": "Parent/Sibling/Friend"
        }
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate input
        required_fields = ['name', 'email', 'password', 'aadhar_number', 'emergency_contact']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400
        
        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            return jsonify({
                "success": False,
                "message": "Invalid email format"
            }), 400
        
        # Validate Aadhar number (12 digits)
        aadhar = data['aadhar_number'].replace(' ', '')
        if not re.match(r'^\d{12}$', aadhar):
            return jsonify({
                "success": False,
                "message": "Aadhar number must be 12 digits"
            }), 400
        
        # Validate emergency contact
        emergency_contact = data['emergency_contact']
        if not isinstance(emergency_contact, dict):
            return jsonify({
                "success": False,
                "message": "Emergency contact must be an object"
            }), 400
            
        required_ec_fields = ['name', 'phone', 'relation']
        for field in required_ec_fields:
            if not emergency_contact.get(field):
                return jsonify({
                    "success": False,
                    "message": f"Emergency contact {field} is required"
                }), 400
        
        # Check if user already exists
        if customer_records.find_one({"email": data['email']}):
            return jsonify({
                "success": False,
                "message": "User with this email already exists"
            }), 409
            
        if customer_records.find_one({"aadhar_number": aadhar}):
            return jsonify({
                "success": False,
                "message": "User with this Aadhar number already exists"
            }), 409
        
        # Hash password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Prepare user data
        user_data = {
            "name": data['name'],
            "email": data['email'],
            "password": hashed_password,
            "aadhar_number": aadhar,
            "emergency_contact": {
                "name": emergency_contact['name'],
                "phone": emergency_contact['phone'],
                "relation": emergency_contact['relation']
            },
            "is_verified": False,
            "created_at": datetime.datetime.utcnow(),
            "updated_at": datetime.datetime.utcnow()
        }
        
        # Insert user into database
        result = customer_records.insert_one(user_data)
        
        if result.inserted_id:
            # Remove password from response
            user_response = {key: value for key, value in user_data.items() if key != 'password'}
            user_response['_id'] = str(result.inserted_id)
            
            return jsonify({
                "success": True,
                "message": "User registered successfully",
                "user": user_response
            }), 201
        else:
            return jsonify({
                "success": False,
                "message": "Failed to register user"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Registration error: {str(e)}"
        }), 500