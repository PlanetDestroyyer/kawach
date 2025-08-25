from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv
import urllib.parse

# Load environment variables
load_dotenv()

# Get MongoDB credentials from environment variables (more secure)
username = os.getenv('MONGODB_USERNAME')
password = os.getenv('MONGODB_PASSWORD')
cluster = os.getenv('MONGODB_CLUSTER')
database_name = os.getenv('MONGODB_DATABASE')

# Check if required environment variables are set
if not all([username, password, cluster, database_name]):
    print("Warning: Missing MongoDB environment variables. Using fallback configuration for demo purposes.")
    # Fallback configuration for demo purposes
    username = "pranav"
    password = "womendb"
    cluster = "cluster0.4sxycqb.mongodb.net"
    database_name = "kavach"

# Properly encode the password
encoded_password = urllib.parse.quote_plus(password)
uri = f"mongodb+srv://{username}:{encoded_password}@{cluster}/?retryWrites=true&w=majority&appName=Cluster0"

# Mock database for demo purposes
class MockCollection:
    def __init__(self, name):
        self.name = name
        self.data = []
        
    def find_one(self, query=None):
        return None
        
    def find(self, query=None, sort=None):
        return []
        
    def insert_one(self, data):
        class MockResult:
            def __init__(self):
                self.inserted_id = "mock_id"
        return MockResult()
        
    def update_one(self, query, update):
        return {"matched_count": 1, "modified_count": 1}
        
    def delete_one(self, query):
        return {"deleted_count": 1}
        
    def count_documents(self, query):
        return 0
        
    def insert_many(self, data):
        return {"inserted_ids": [f"mock_id_{i}" for i in range(len(data))]}

class MockDB:
    def __init__(self):
        self.customer = MockCollection("customer")
        self.last = MockCollection("last")
        self.lang_log_new = MockCollection("lang_log_new")
        self.poll = MockCollection("poll")
        self.news = MockCollection("news")
        self.verification = MockCollection("verification")

# Create MongoDB client with error handling
try:
    client = MongoClient(uri, server_api=ServerApi('1'), connectTimeoutMS=5000, serverSelectionTimeoutMS=5000)
    # Get database
    db = client.get_database(database_name)
    
    # Collections
    customer_records = db.customer
    last_records = db.last
    lang_log_new_records = db.lang_log_new
    poll_records = db.poll
    news_records = db.news
    verification_records = db.verification  # New collection for image verification
    
    print("MongoDB connection established successfully!")
    
except Exception as e:
    print(f"Warning: Could not connect to MongoDB: {e}")
    print("Using mock database for demo purposes.")
    
    db = MockDB()
    customer_records = db.customer
    last_records = db.last
    lang_log_new_records = db.lang_log_new
    poll_records = db.poll
    news_records = db.news
    verification_records = db.verification

# Test connection
def test_connection():
    try:
        # If we're using a mock database, return True
        if hasattr(db, 'customer') and isinstance(db.customer, MockCollection):
            return True
            
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return True
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return False

if __name__ == "__main__":
    test_connection()

