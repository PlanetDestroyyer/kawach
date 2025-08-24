from flask import jsonify, request
from .init import verification_records, customer_records
import base64
import datetime

def verify_user_image():
    """
    Handle user image verification
    Expected JSON input:
    {
        "user_id": "user_id",
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
        
        # Validate user exists (mock implementation)
        user_exists = False
        user_index = None
        for i, record in enumerate(customer_records):
            if str(record.get('id')) == str(user_id):
                user_exists = True
                user_index = i
                break
        
        if not user_exists:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
        
        # Store verification record
        verification_record = {
            "id": len(verification_records) + 1,
            "user_id": user_id,
            "image_data": image_data,  # In production, you should encrypt this
            "created_at": datetime.datetime.utcnow().isoformat(),
            "status": "pending"  # pending, approved, rejected
        }
        
        verification_records.append(verification_record)
        
        # Update user verification status
        if user_index is not None:
            customer_records[user_index]['is_verified'] = True
            customer_records[user_index]['updated_at'] = datetime.datetime.utcnow().isoformat()
        
        return jsonify({
            "success": True,
            "message": "Image verification submitted successfully",
            "verification_id": verification_record['id']
        }), 200
            
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
        # Find latest verification record for user (mock implementation)
        latest_record = None
        for record in verification_records:
            if str(record.get('user_id')) == str(user_id):
                if latest_record is None or record.get('created_at') > latest_record.get('created_at'):
                    latest_record = record
        
        if latest_record:
            return jsonify({
                "success": True,
                "verification_status": latest_record.get("status", "pending"),
                "submitted_at": latest_record.get("created_at")
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