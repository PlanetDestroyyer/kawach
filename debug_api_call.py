import requests
import json

# Test with detailed debugging
url = "http://192.168.137.142:5000/api/safety-poll"
data = {
    "location": "Test Location",
    "is_safe": True
}

print("Sending request with data:", data)

# Make the request
response = requests.post(url, json=data)

print("Response status code:", response.status_code)
print("Response text:", response.text)

try:
    response_json = response.json()
    print("Response JSON:", json.dumps(response_json, indent=2))
except:
    print("Response is not valid JSON")