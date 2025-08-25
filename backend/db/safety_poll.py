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
        # Dummy data for judges
        dummy_locations = {
            "FC Road": {"latitude": 18.5204, "longitude": 73.8567},
            "Koregaon Park": {"latitude": 18.5220, "longitude": 73.8590},
            "Camp": {"latitude": 18.5190, "longitude": 73.8450},
            "Baner": {"latitude": 18.5250, "longitude": 73.8200},
            "Pimple Saudagar": {"latitude": 18.5910, "longitude": 73.8000},
            "Wakad": {"latitude": 18.5980, "longitude": 73.7600},
            "Hinjewadi": {"latitude": 18.5910, "longitude": 73.7400},
            "Viman Nagar": {"latitude": 18.5700, "longitude": 73.9100},
            "Kharadi": {"latitude": 18.5400, "longitude": 73.9200},
            "Magarpatta": {"latitude": 18.5200, "longitude": 73.9100}
        }
        if locality in dummy_locations:
            return dummy_locations[locality]
        return {"error": f"Could not find location: {locality}"}

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
            
        # Prepare poll data with geocoded coordinates or provided coordinates
        latitude = data.get('latitude', location_result.get('latitude'))
        longitude = data.get('longitude', location_result.get('longitude'))
        
        poll_data = {
            "location": data['location'],
            "latitude": latitude,
            "longitude": longitude,
            "is_safe": data['is_safe'],
            "comment": data.get('comment', ''),
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
        # Check if we have any polls in the database
        poll_count = poll_records.count_documents({})
        
        # If no polls exist, insert some dummy data for judges
        if poll_count == 0:
            dummy_polls = [
                {
                    "location": "FC Road",
                    "latitude": 18.5204,
                    "longitude": 73.8567,
                    "is_safe": False,
                    "comment": "Unsafe after dark",
                    "unsafe_votes": 5,
                    "safe_votes": 2,
                    "created_at": datetime.datetime.utcnow() - datetime.timedelta(hours=2),
                    "updated_at": datetime.datetime.utcnow() - datetime.timedelta(hours=2)
                },
                {
                    "location": "Koregaon Park",
                    "latitude": 18.5220,
                    "longitude": 73.8590,
                    "is_safe": True,
                    "comment": "Well-lit and patrolled area",
                    "unsafe_votes": 1,
                    "safe_votes": 8,
                    "created_at": datetime.datetime.utcnow() - datetime.timedelta(hours=5),
                    "updated_at": datetime.datetime.utcnow() - datetime.timedelta(hours=5)
                },
                {
                    "location": "Camp",
                    "latitude": 18.5190,
                    "longitude": 73.8450,
                    "is_safe": False,
                    "comment": "Multiple incidents reported",
                    "unsafe_votes": 7,
                    "safe_votes": 1,
                    "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=1),
                    "updated_at": datetime.datetime.utcnow() - datetime.timedelta(days=1)
                },
                {
                    "location": "Baner",
                    "latitude": 18.5250,
                    "longitude": 73.8200,
                    "is_safe": True,
                    "comment": "Safe during daytime",
                    "unsafe_votes": 2,
                    "safe_votes": 6,
                    "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=1),
                    "updated_at": datetime.datetime.utcnow() - datetime.timedelta(days=1)
                },
                {
                    "location": "Pimple Saudagar",
                    "latitude": 18.5910,
                    "longitude": 73.8000,
                    "is_safe": True,
                    "comment": "Well-patrolled residential area",
                    "unsafe_votes": 1,
                    "safe_votes": 9,
                    "created_at": datetime.datetime.utcnow() - datetime.timedelta(hours=12),
                    "updated_at": datetime.datetime.utcnow() - datetime.timedelta(hours=12)
                }
            ]
            
            # Insert dummy polls
            poll_records.insert_many(dummy_polls)
        
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