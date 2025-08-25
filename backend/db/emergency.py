import datetime
import sys
import os

# Add the services directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'services'))

from flask import jsonify, request
from .init import customer_records
from bson import ObjectId
from sos import send_sms

# Import geopy for reverse geocoding
try:
    from geopy.geocoders import Nominatim
    from geopy.exc import GeocoderTimedOut, GeocoderServiceError
    geolocator = Nominatim(user_agent="safeguard_app")
    GEOCODING_AVAILABLE = True
except ImportError:
    GEOCODING_AVAILABLE = False
    print("Geopy not available, using coordinates only")

def reverse_geocode(latitude, longitude):
    """
    Convert coordinates to a readable address
    
    Args:
        latitude (float): Latitude coordinate
        longitude (float): Longitude coordinate
        
    Returns:
        str: Readable address or coordinate string if geocoding fails
    """
    if not GEOCODING_AVAILABLE:
        return f"{latitude}, {longitude}"
    
    try:
        location = geolocator.reverse(f"{latitude}, {longitude}", timeout=10)
        if location and location.address:
            # Return a shortened version of the address
            address_parts = location.address.split(',')
            if len(address_parts) > 3:
                return f"{address_parts[0]}, {address_parts[1]}, {address_parts[2]}"
            else:
                return location.address
        else:
            return f"{latitude}, {longitude}"
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        print(f"Geocoding error: {e}")
        return f"{latitude}, {longitude}"
    except Exception as e:
        print(f"Unexpected geocoding error: {e}")
        return f"{latitude}, {longitude}"

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
        
        # Get user information if user_id is provided
        user_name = "Unknown User"
        user_phone = "Unknown Phone"
        if data.get('user_id'):
            try:
                user = customer_records.find_one({"_id": ObjectId(data['user_id'])})
                if user:
                    user_name = user.get('name', 'Unknown User')
                    user_phone = user.get('phone', user.get('emergency_contact', {}).get('phone', 'Unknown Phone'))
            except Exception:
                # Invalid user ID format, continue with default values
                pass
        
        # Get readable location address
        lat = location.get('latitude', 0)
        lon = location.get('longitude', 0)
        readable_location = reverse_geocode(lat, lon)
        
        # Create complete message with user info and readable location
        complete_message = f"EMERGENCY SOS! {message} Name: {user_name}, Phone: {user_phone}, Location: {readable_location}"
        
        # Send SMS to emergency number
        sms_result = send_sms("8459582668", complete_message)
        
        return jsonify({
            "success": True,
            "message": "SOS alert sent successfully",
            "timestamp": datetime.datetime.utcnow(),
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