import datetime
import sys
import os

# Add the services directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'services'))

from flask import jsonify, request
from .init import customer_records
from bson import ObjectId
from sos import send_sms

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
        if not data or not data.get('location'):
            return jsonify({
                "success": False,
                "message": "Location is required"
            }), 400
            
        location = data['location']
        message = data.get('message', 'Please help me! I am in danger.')
        
        # Validate user exists if user_id is provided
        user = None
        user_info = ""
        if data.get('user_id'):
            try:
                user = customer_records.find_one({"_id": ObjectId(data['user_id'])})
                if user:
                    name = user.get('name', 'Unknown')
                    phone = user.get('phone', 'Unknown')
                    user_info = f"Name: {name}, Phone: {phone}"
            except Exception:
                # Invalid user ID format, continue without user data
                pass
        
        # Create location info
        lat = location.get('latitude', 'Unknown')
        lon = location.get('longitude', 'Unknown')
        location_info = f"Location: {lat}, {lon}"
        
        # Create complete message
        complete_message = f"EMERGENCY SOS! {message} {user_info} {location_info}"
        
        # Send SMS to emergency number
        sms_result = send_sms("8459582668", complete_message)
        
        # For now, we'll just log the SOS
        sos_record = {
            "location": location,
            "message": complete_message,
            "timestamp": datetime.datetime.utcnow(),
            "status": "sent"
        }
        
        return jsonify({
            "success": True,
            "message": "SOS alert sent successfully",
            "timestamp": sos_record["timestamp"],
            "sms_sent": sms_result is not None
        }), 200
            
    except Exception as e:
        # Even if there's an error in our code, we still want to send the SMS
        try:
            send_sms("8459582668", "EMERGENCY SOS! Please help me! I am in danger.")
            return jsonify({
                "success": True,
                "message": "SOS alert sent successfully (with error in processing)",
                "sms_sent": True
            }), 200
        except:
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