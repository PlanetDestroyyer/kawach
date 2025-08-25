import datetime
from flask import jsonify, request
from .init import customer_records
from bson import ObjectId

def get_trusted_contacts(user_id):
    """
    Get trusted contacts for a user
    """
    try:
        # Validate user exists
        user = customer_records.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
            
        # Return user's emergency contact
        emergency_contact = user.get('emergency_contact', {})
        
        return jsonify({
            "success": True,
            "contacts": [emergency_contact] if emergency_contact else []
        }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error fetching contacts: {str(e)}"
        }), 500

def add_trusted_contact(user_id):
    """
    Add a trusted contact for a user
    Expected JSON input:
    {
        "name": "Contact Name",
        "phone": "+1234567890",
        "relation": "Parent/Friend/etc"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({
                "success": False,
                "message": "Contact data is required"
            }), 400
            
        required_fields = ['name', 'phone', 'relation']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "success": False,
                    "message": f"Contact {field} is required"
                }), 400
        
        # Validate user exists
        user = customer_records.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
            
        # Update user's emergency contact
        customer_records.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "emergency_contact": {
                        "name": data['name'],
                        "phone": data['phone'],
                        "relation": data['relation']
                    },
                    "updated_at": datetime.datetime.utcnow()
                }
            }
        )
        
        return jsonify({
            "success": True,
            "message": "Trusted contact added successfully"
        }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error adding contact: {str(e)}"
        }), 500

def update_trusted_contact(user_id, contact_index):
    """
    Update a trusted contact for a user
    Expected JSON input:
    {
        "name": "Contact Name",
        "phone": "+1234567890",
        "relation": "Parent/Friend/etc"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({
                "success": False,
                "message": "Contact data is required"
            }), 400
            
        # Validate user exists
        user = customer_records.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
            
        # Update user's emergency contact
        customer_records.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "emergency_contact": {
                        "name": data.get('name', user.get('emergency_contact', {}).get('name', '')),
                        "phone": data.get('phone', user.get('emergency_contact', {}).get('phone', '')),
                        "relation": data.get('relation', user.get('emergency_contact', {}).get('relation', ''))
                    },
                    "updated_at": datetime.datetime.utcnow()
                }
            }
        )
        
        return jsonify({
            "success": True,
            "message": "Trusted contact updated successfully"
        }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error updating contact: {str(e)}"
        }), 500

def delete_trusted_contact(user_id, contact_index):
    """
    Delete a trusted contact for a user
    """
    try:
        # Validate user exists
        user = customer_records.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
            
        # Remove user's emergency contact
        customer_records.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$unset": {
                    "emergency_contact": ""
                },
                "$set": {
                    "updated_at": datetime.datetime.utcnow()
                }
            }
        )
        
        return jsonify({
            "success": True,
            "message": "Trusted contact deleted successfully"
        }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error deleting contact: {str(e)}"
        }), 500