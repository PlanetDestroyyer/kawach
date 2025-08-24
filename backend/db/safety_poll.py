import datetime
from flask import jsonify, request
from .init import poll_records
from bson import ObjectId

def submit_safety_poll():
    """
    Handle user safety poll submission
    Expected JSON input:
    {
        "location": "FC Road",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "is_safe": true,
        "comment": "Optional comment"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate input
        required_fields = ['location', 'latitude', 'longitude', 'is_safe']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400
        
        # Validate data types
        if not isinstance(data['latitude'], (int, float)) or not isinstance(data['longitude'], (int, float)):
            return jsonify({
                "success": False,
                "message": "Latitude and longitude must be numbers"
            }), 400
            
        if not isinstance(data['is_safe'], bool):
            return jsonify({
                "success": False,
                "message": "is_safe must be a boolean value"
            }), 400
        
        # Prepare poll data
        poll_data = {
            "location": data['location'],
            "latitude": data['latitude'],
            "longitude": data['longitude'],
            "is_safe": data['is_safe'],
            "comment": data.get('comment', ''),
            "unsafe_votes": 1 if not data['is_safe'] else 0,
            "safe_votes": 1 if data['is_safe'] else 0,
            "created_at": datetime.datetime.utcnow(),
            "updated_at": datetime.datetime.utcnow()
        }
        
        # Insert poll into database
        result = poll_records.insert_one(poll_data)
        
        if result.inserted_id:
            # Remove _id from response
            poll_data['_id'] = str(result.inserted_id)
            
            return jsonify({
                "success": True,
                "message": "Safety poll submitted successfully",
                "data": poll_data
            }), 201
        else:
            return jsonify({
                "success": False,
                "message": "Failed to submit safety poll"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Safety poll submission error: {str(e)}"
        }), 500

def get_safety_polls():
    """
    Get all safety polls
    """
    try:
        # Get all polls from database
        polls = list(poll_records.find({}, sort=[("created_at", -1)]))
        
        # Convert ObjectId to string
        for poll in polls:
            poll['_id'] = str(poll['_id'])
        
        return jsonify({
            "success": True,
            "data": polls
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error fetching safety polls: {str(e)}"
        }), 500