import requests
import json

url = "http://192.168.137.142:5000/api/safety-poll"
data = {
    "location": "Camp",
    "is_safe": True,
    "comment": "Test location"
}

response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")