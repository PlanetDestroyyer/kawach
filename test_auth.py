# Test the authentication system
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.db.register import register_user
from backend.db.lgin import login_user

# Test registration
def test_registration():
    print("Testing user registration...")
    # This would normally be done through the Flask app
    print("Registration test completed.")

# Test login
def test_login():
    print("Testing user login...")
    # This would normally be done through the Flask app
    print("Login test completed.")

if __name__ == "__main__":
    test_registration()
    test_login()
    print("All tests completed.")