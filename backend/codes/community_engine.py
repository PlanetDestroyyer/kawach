from geopy.geocoders import Nominatim

def get_lat_lon(locality: str):
    # Create a geolocator with a user agent
    geolocator = Nominatim(user_agent="pune_locality_locator")
    
    # Append Pune, India to make sure it's searching within Pune
    location = geolocator.geocode(f"{locality}, Pune, India")
    
    if location:
        return {"locality": locality, "latitude": location.latitude, "longitude": location.longitude}
    else:
        return {"error": f"Could not find location: {locality}"}

# Example usage
if __name__ == "__main__":
    place = input("Enter locality in Pune: ")
    result = get_lat_lon(place)
    print(result)
