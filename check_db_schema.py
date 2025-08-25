from pymongo import MongoClient
import urllib.parse
import os

# Connect to MongoDB directly
uri = "mongodb+srv://pranav:womendb@cluster0.4sxycqb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)

# Get database
db = client.get_database('kavach')

# Get the poll collection
poll_collection = db.poll

# Check if there's any validation schema
try:
    validator = poll_collection.options().get('validator', {})
    print("Collection validator:", validator)
except Exception as e:
    print("Error getting validator:", e)

# Check a sample document
try:
    sample_doc = poll_collection.find_one()
    print("Sample document:", sample_doc)
except Exception as e:
    print("Error getting sample document:", e)

client.close()