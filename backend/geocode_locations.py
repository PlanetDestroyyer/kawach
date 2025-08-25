#!/usr/bin/env python3
"""
Geocoding utility script that converts location names to coordinates using geopy
"""

import json
import os
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import time

# Initialize geocoder with a user agent
geolocator = Nominatim(user_agent="safeguard_app")

def geocode_location(location_string, city="Pune", country="India"):
    """
    Convert a location string to coordinates using geopy
    
    Args:
        location_string (str): The location name to geocode
        city (str): The city name (default: Pune)
        country (str): The country name (default: India)
        
    Returns:
        dict: Dictionary with latitude, longitude, and location info or None if failed
    """
    try:
        # Create a more specific query
        query = f"{location_string}, {city}, {country}"
        print(f"Geocoding: {query}")
        
        # Geocode the location
        location = geolocator.geocode(query, timeout=10)
        
        if location:
            return {
                "latitude": location.latitude,
                "longitude": location.longitude,
                "location_string": location_string,
                "full_address": location.address,
                "timestamp": time.time()
            }
        else:
            print(f"Could not geocode: {location_string}")
            return None
            
    except GeocoderTimedOut:
        print(f"Geocoding timed out for: {location_string}")
        return None
    except GeocoderServiceError as e:
        print(f"Geocoding service error for {location_string}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error geocoding {location_string}: {e}")
        return None

def process_crime_locations(input_file, output_file):
    """
    Process a list of crime locations and convert them to coordinates
    
    Args:
        input_file (str): Path to input JSON file with location names
        output_file (str): Path to output JSON file with geocoded locations
    """
    # Read input locations
    if os.path.exists(input_file):
        with open(input_file, 'r') as f:
            locations = json.load(f)
    else:
        # Default locations if input file doesn't exist
        locations = [
            {"location_string": "FC Road"},
            {"location_string": "Camp"},
            {"location_string": "Chinchwad"},
            {"location_string": "Koregaon Park"},
            {"location_string": "Warje"}
        ]
    
    print(f"Processing {len(locations)} locations...")
    
    # Geocode each location
    geocoded_locations = []
    for loc in locations:
        location_string = loc.get("location_string")
        if location_string:
            result = geocode_location(location_string)
            if result:
                geocoded_locations.append(result)
                print(f"Successfully geocoded: {location_string}")
            else:
                print(f"Failed to geocode: {location_string}")
            
            # Add a small delay to respect rate limits
            time.sleep(1)
    
    # Save results
    with open(output_file, 'w') as f:
        json.dump(geocoded_locations, f, indent=2)
    
    print(f"Geocoded {len(geocoded_locations)} locations. Results saved to {output_file}")
    return geocoded_locations

def create_sample_crime_data():
    """
    Create sample crime location data for testing
    """
    sample_locations = [
        {"location_string": "FC Road", "incident_type": "theft"},
        {"location_string": "Camp", "incident_type": "harassment"},
        {"location_string": "Chinchwad", "incident_type": "assault"},
        {"location_string": "Koregaon Park", "incident_type": "theft"},
        {"location_string": "Warje", "incident_type": "harassment"}
    ]
    
    input_file = os.path.join(os.path.dirname(__file__), 'codes', 'crime_locations.json')
    output_file = os.path.join(os.path.dirname(__file__), 'codes', 'crime_locations_geocoded.json')
    
    # Create directories if they don't exist
    os.makedirs(os.path.dirname(input_file), exist_ok=True)
    
    # Save sample data
    with open(input_file, 'w') as f:
        json.dump(sample_locations, f, indent=2)
    
    print(f"Sample crime data created at {input_file}")
    return input_file, output_file

if __name__ == "__main__":
    # Create sample data if needed
    input_file = os.path.join(os.path.dirname(__file__), 'codes', 'crime_locations.json')
    output_file = os.path.join(os.path.dirname(__file__), 'codes', 'crime_locations_geocoded.json')
    
    # If input file doesn't exist, create sample data
    if not os.path.exists(input_file):
        print("Creating sample crime location data...")
        create_sample_crime_data()
    
    # Process locations
    print("Starting geocoding process...")
    process_crime_locations(input_file, output_file)
    print("Geocoding process completed!")