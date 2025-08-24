import requests
import json

# Test the backend API endpoints
def test_api():
    base_url = "http://localhost:5000"
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/api/health")
        print("Health check:", response.status_code, response.json())
    except Exception as e:
        print("Health check failed:", str(e))
    
    # Test registration
    try:
        register_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpassword",
            "aadhar_number": "123456789012",
            "emergency_contact": {
                "name": "Emergency Contact",
                "phone": "+1234567890",
                "relation": "Parent"
            }
        }
        response = requests.post(f"{base_url}/api/register", json=register_data)
        print("Registration:", response.status_code, response.json())
    except Exception as e:
        print("Registration failed:", str(e))
    
    # Test login
    try:
        login_data = {
            "email": "test@example.com",
            "password": "testpassword"
        }
        response = requests.post(f"{base_url}/api/login", json=login_data)
        print("Login:", response.status_code, response.json())
    except Exception as e:
        print("Login failed:", str(e))

if __name__ == "__main__":
    test_api()