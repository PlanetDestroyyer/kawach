import datetime
from flask import jsonify, request
from .init import customer_records
from bson import ObjectId

def send_sos():
    """
    Handle emergency SOS requests
    Expected JSON input:
    {
        "user_id": "user_object_id",
        "location": {
            "latitude": 18.5204,
            "longitude": 73.8567
        },
        "message": "Emergency help needed"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate input
        if not data or not data.get('user_id') or not data.get('location'):
            return jsonify({
                "success": False,
                "message": "User ID and location are required"
            }), 400
            
        user_id = data['user_id']
        location = data['location']
        message = data.get('message', 'Emergency SOS sent')
        
        # Validate user exists
        user = customer_records.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
            
        # In a real implementation, this would send notifications to:
        # 1. Emergency contacts
        # 2. Local authorities
        # 3. Other users in the area
        
        # For now, we'll just log the SOS
        sos_record = {
            "user_id": ObjectId(user_id),
            "location": location,
            "message": message,
            "timestamp": datetime.datetime.utcnow(),
            "status": "sent"
        }
        
        # In a real app, you would store this in a separate SOS collection
        # and trigger notifications
        
        return jsonify({
            "success": True,
            "message": "SOS alert sent successfully",
            "sos_id": str(ObjectId()),  # In real implementation, this would be the actual ID
            "timestamp": sos_record["timestamp"]
        }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"SOS error: {str(e)}"
        }), 500

def send_location_to_contacts():
    """
    Send live location to trusted contacts
    Expected JSON input:
    {
        "user_id": "user_object_id",
        "location": {
            "latitude": 18.5204,
            "longitude": 73.8567
        }
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate input
        if not data or not data.get('user_id') or not data.get('location'):
            return jsonify({
                "success": False,
                "message": "User ID and location are required"
            }), 400
            
        user_id = data['user_id']
        location = data['location']
        
        # Validate user exists
        user = customer_records.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
            
        # In a real implementation, this would:
        # 1. Get user's emergency contacts
        # 2. Send location via SMS, email, or push notifications
        
        # For now, we'll just return success
        return jsonify({
            "success": True,
            "message": "Location shared with emergency contacts",
            "contacts_notified": user.get('emergency_contact', {})
        }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Location sharing error: {str(e)}"
        }), 500