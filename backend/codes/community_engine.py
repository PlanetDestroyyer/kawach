from geopy.geocoders import Nominatim

def get_lat_lon(locality: str):
    # First check if we have it in our dummy data
    dummy_locations = {
        "FC Road": {"latitude": 18.5204, "longitude": 73.8567},
        "Koregaon Park": {"latitude": 18.5220, "longitude": 73.8590},
        "Camp": {"latitude": 18.5190, "longitude": 73.8450},
        "Baner": {"latitude": 18.5250, "longitude": 73.8200},
        "Pimple Saudagar": {"latitude": 18.5910, "longitude": 73.8000},
        "Wakad": {"latitude": 18.5980, "longitude": 73.7600},
        "Hinjewadi": {"latitude": 18.5910, "longitude": 73.7400},
        "Viman Nagar": {"latitude": 18.5700, "longitude": 73.9100},
        "Kharadi": {"latitude": 18.5400, "longitude": 73.9200},
        "Magarpatta": {"latitude": 18.5200, "longitude": 73.9100}
    }
    
    # If locality is in our dummy data, return it directly
    if locality in dummy_locations:
        return dummy_locations[locality]
    
    # Otherwise, try to geocode it
    try:
        # Create a geolocator with a user agent
        geolocator = Nominatim(user_agent="pune_locality_locator")
        
        # Append Pune, India to make sure it's searching within Pune
        location = geolocator.geocode(f"{locality}, Pune, India")
        
        if location:
            return {"locality": locality, "latitude": location.latitude, "longitude": location.longitude}
        else:
            return {"error": f"Could not find location: {locality}"}
    except Exception as e:
        # If geocoding fails, return error
        return {"error": f"Geocoding service unavailable: {str(e)}"}

# Example usage
if __name__ == "__main__":
    place = input("Enter locality in Pune: ")
    result = get_lat_lon(place)
    print(result)
