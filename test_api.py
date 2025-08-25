import requests
import json

# Test the API directly
url = "http://192.168.137.142:5000/api/safety-poll"
data = {
    "location": "FC Road",
    "is_safe": True
}

print("Sending request with data:", data)
response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")