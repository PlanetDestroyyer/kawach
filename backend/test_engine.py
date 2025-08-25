import sys
import os

# Add the codes directory to the path
current_dir = os.path.dirname(os.path.abspath(__file__))
codes_dir = os.path.join(current_dir, 'codes')
sys.path.append(codes_dir)

# Test the community_engine
try:
    from community_engine import get_lat_lon
    result = get_lat_lon("FC Road")
    print("Community engine test result:", result)
except Exception as e:
    print("Error importing or using community_engine:", str(e))