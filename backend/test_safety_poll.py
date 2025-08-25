import sys
import os
from flask import Flask, request, jsonify

# Add the current directory and db directory to the path
sys.path.append('.')
sys.path.append('db')

# Import the safety_poll function
from db.safety_poll import submit_safety_poll

# Create a simple test app
app = Flask(__name__)

@app.route('/test', methods=['POST'])
def test():
    # Simulate what happens in the real app
    return submit_safety_poll()

if __name__ == '__main__':
    # Test with sample data
    with app.test_client() as client:
        response = client.post('/test', json={
            "location": "FC Road",
            "is_safe": True
        })
        print("Status code:", response.status_code)
        print("Response data:", response.get_json())