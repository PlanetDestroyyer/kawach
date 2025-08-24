import json
import requests
import time

# Input JSON file (from scraper)
INPUT_FILE = "crime_locations.json"
OUTPUT_FILE = "crime_locations_geocoded.json"

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

# Define bubble radius (in meters) for different crime types
CRIME_BUBBLE_RADIUS = {
    # Women safety – highest priority
    "rape": 2000,
    "molestation": 2000,
    "harassment": 1500,
    "assault": 1500,
    "kidnap": 2000,
    
    # Violent crimes
    "murder": 1500,
    "robbery": 1200,
    "gang": 1500,
    "attack": 1200,
    "shooting": 1500,
    
    # Property crimes
    "theft": 800,
    "chain snatching": 800,
    "burglary": 800,
    "fraud": 600,
    
    # Default if unknown
    "crime": 1000
}

def get_bubble_radius(crime_type):
    """Return bubble radius based on crime type"""
    crime_type = (crime_type or "crime").lower()
    return CRIME_BUBBLE_RADIUS.get(crime_type, 1000)

def geocode_location(location_string):
    """Use Nominatim API to get coordinates of a location"""
    try:
        params = {
            "q": location_string + ", Pune, India",
            "format": "json",
            "limit": 1
        }
        headers = {"User-Agent": "PuneCrimeSafetyApp/1.0"}
        response = requests.get(NOMINATIM_URL, params=params, headers=headers)

        if response.status_code == 200:
            data = response.json()
            if data:
                return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"[!] Error geocoding {location_string}: {e}")
    return None, None

def geocode_json():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        articles = json.load(f)

    results = []
    for article in articles:
        location = article.get("location_string")
        if not location:
            continue

        lat, lon = geocode_location(location)
        radius = get_bubble_radius(article.get("crime_type", "crime"))

        article["latitude"] = lat
        article["longitude"] = lon
        article["bubble_radius"] = radius

        results.append(article)
        print(f"[+] {location} -> {lat}, {lon} | Bubble: {radius}m")

        time.sleep(1)  # respect Nominatim API limits

    # Save updated JSON
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"[✓] Geocoded + bubble data saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    geocode_json()
