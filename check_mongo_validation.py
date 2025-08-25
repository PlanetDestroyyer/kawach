import sys
sys.path.append('C:\\Hackathon\\kawach\\backend')
from db.init import poll_records
import json

# Check if there are any validators on the collection
try:
    options = poll_records.options()
    print("Collection options:", json.dumps(options, default=str, indent=2))
except Exception as e:
    print("Error getting collection options:", e)