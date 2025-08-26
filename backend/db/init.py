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
    raise ValueError("Missing required MongoDB environment variables. Please set MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER, and MONGODB_DATABASE.")

# Properly encode the password
encoded_password = urllib.parse.quote_plus(password)
uri = f"mongodb+srv://{username}:{encoded_password}@{cluster}/?retryWrites=true&w=majority&appName=Cluster0"

# Create MongoDB client
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

# Test connection
def test_connection():
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return True
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return False

if __name__ == "__main__":
    test_connection()

