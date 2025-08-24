from flask import jsonify, request
from .init import verification_records, customer_records
import base64
import datetime
from bson import ObjectId

def verify_user_image():
    """
    Handle user image verification
    Expected JSON input:
    {
        "user_id": "user_object_id",
        "image_data": "base64_encoded_image_data"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate input
        if not data or not data.get('user_id') or not data.get('image_data'):
            return jsonify({
                "success": False,
                "message": "User ID and image data are required"
            }), 400
        
        user_id = data['user_id']
        image_data = data['image_data']
        
        # Validate user exists
        user = customer_records.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
        
        # Store verification record
        verification_record = {
            "user_id": ObjectId(user_id),
            "image_data": image_data,  # In production, you should encrypt this
            "created_at": datetime.datetime.utcnow(),
            "status": "pending"  # pending, approved, rejected
        }
        
        result = verification_records.insert_one(verification_record)
        
        if result.inserted_id:
            # Update user verification status
            customer_records.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"is_verified": True, "updated_at": datetime.datetime.utcnow()}}
            )
            
            return jsonify({
                "success": True,
                "message": "Image verification submitted successfully",
                "verification_id": str(result.inserted_id)
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Failed to submit verification"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Verification error: {str(e)}"
        }), 500

def get_verification_status(user_id):
    """
    Get verification status for a user
    """
    try:
        # Find latest verification record for user
        verification_record = verification_records.find_one(
            {"user_id": ObjectId(user_id)},
            sort=[("created_at", -1)]
        )
        
        if verification_record:
            return jsonify({
                "success": True,
                "verification_status": verification_record.get("status", "pending"),
                "submitted_at": verification_record.get("created_at")
            }), 200
        else:
            return jsonify({
                "success": True,
                "verification_status": "not_submitted"
            }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error fetching verification status: {str(e)}"
        }), 500