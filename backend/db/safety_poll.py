import datetime
from flask import jsonify, request
from .init import poll_records
from bson import ObjectId
import sys
import os

# Add the codes directory to the path so we can import community_engine
current_dir = os.path.dirname(os.path.abspath(__file__))
codes_dir = os.path.join(current_dir, '..', 'codes')
sys.path.append(codes_dir)

try:
    from community_engine import get_lat_lon
except ImportError as e:
    print(f"Error importing community_engine: {e}")
    # Fallback function if import fails
    def get_lat_lon(locality: str):
        return {"error": f"Geocoding service unavailable: {str(e)}"}

def submit_safety_poll():
    """
    Handle user safety poll submission
    Expected JSON input:
    {
        "location": "FC Road",
        "is_safe": true,
        "comment": "Optional comment"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        print("=== DEBUG: Received data in submit_safety_poll ===")
        print("Data:", data)
        print("Data type:", type(data))
        
        # Validate input
        required_fields = ['location', 'is_safe']
        for field in required_fields:
            if field not in data:
                print(f"=== DEBUG: Missing field {field} ===")
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400
        
        # Validate data types
        if not isinstance(data['is_safe'], bool):
            print("=== DEBUG: is_safe is not boolean ===")
            return jsonify({
                "success": False,
                "message": "is_safe must be a boolean value"
            }), 400
            
        # Use community_engine to geocode the location
        print("=== DEBUG: About to call get_lat_lon ===")
        location_result = get_lat_lon(data['location'])
        print("=== DEBUG: Geocoded result ===")
        print("Result:", location_result)
        
        if "error" in location_result:
            print("=== DEBUG: Geocoding error ===")
            return jsonify({
                "success": False,
                "message": location_result["error"]
            }), 400
            
        # Prepare poll data with geocoded coordinates
        poll_data = {
            "location": data['location'],
            "latitude": location_result['latitude'],
            "longitude": location_result['longitude'],
            "is_safe": data['is_safe'],
            "comment": data.get('comment', ''),
            "unsafe_votes": 1 if not data['is_safe'] else 0,
            "safe_votes": 1 if data['is_safe'] else 0,
            "created_at": datetime.datetime.utcnow(),
            "updated_at": datetime.datetime.utcnow()
        }
        print("=== DEBUG: Prepared poll data ===")
        print("Poll data:", poll_data)
        
        # Insert poll into database
        result = poll_records.insert_one(poll_data)
        
        if result.inserted_id:
            # Remove _id from response
            poll_data['_id'] = str(result.inserted_id)
            
            print("=== DEBUG: Successfully inserted poll ===")
            return jsonify({
                "success": True,
                "message": "Safety poll submitted successfully",
                "data": poll_data
            }), 201
        else:
            print("=== DEBUG: Failed to insert poll ===")
            return jsonify({
                "success": False,
                "message": "Failed to submit safety poll"
            }), 500
            
    except Exception as e:
        print("=== DEBUG: Exception in submit_safety_poll ===")
        print("Exception:", str(e))
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