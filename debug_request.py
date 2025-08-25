import requests
import json

# Test the API directly with detailed debugging
url = "http://192.168.137.142:5000/api/safety-poll"
data = {
    "location": "FC Road",
    "is_safe": True
}

print("Sending POST request to:", url)
print("Request data:", json.dumps(data, indent=2))

try:
    response = requests.post(url, json=data)
    print(f"Response status code: {response.status_code}")
    print(f"Response headers: {dict(response.headers)}")
    print(f"Response text: {response.text}")
    
    try:
        response_json = response.json()
        print(f"Response JSON: {json.dumps(response_json, indent=2)}")
    except:
        print("Response is not valid JSON")
        
except Exception as e:
    print(f"Request failed with exception: {e}")