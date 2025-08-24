# Mock database implementation for testing
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Mock collections (in-memory for testing)
customer_records = []
last_records = []
lang_log_new_records = []
poll_records = []
news_records = []
verification_records = []

# Mock database object
class MockDB:
    def get_database(self, name):
        return self

db = MockDB()

# Test connection
def test_connection():
    print("Using mock database for testing. No actual MongoDB connection.")
    return True

if __name__ == "__main__":
    test_connection()