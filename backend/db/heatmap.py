import json
import os
from flask import jsonify
from .init import poll_records, news_records
from datetime import datetime, timedelta

# Path to the geocoded crime locations file
CRIME_DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'codes', 'crime_locations_geocoded.json')

def get_heatmap_data():
    """
    Get heatmap data combining crime data, news, and user polls
    """
    try:
        # Load crime data
        crime_data = []
        if os.path.exists(CRIME_DATA_FILE):
            with open(CRIME_DATA_FILE, 'r') as f:
                crime_data = json.load(f)
        
        # Get recent poll data (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        poll_data = list(poll_records.find({
            "created_at": {"$gte": thirty_days_ago}
        }))
        
        # Get recent news data (last 30 days)
        news_data = list(news_records.find({
            "created_at": {"$gte": thirty_days_ago}
        }))
        
        # Process data for heatmap
        heatmap_points = []
        
        # Add crime data points
        for crime in crime_data:
            if crime.get('latitude') and crime.get('longitude'):
                # Higher weight for crimes (more dangerous)
                heatmap_points.append({
                    'latitude': crime['latitude'],
                    'longitude': crime['longitude'],
                    'weight': 0.8,  # High weight for actual crimes
                    'type': 'crime',
                    'location': crime.get('location_string', ''),
                    'timestamp': crime.get('timestamp', '')
                })
        
        # Add poll data points
        for poll in poll_data:
            if poll.get('latitude') and poll.get('longitude'):
                # Weight based on poll results (unsafe votes)
                unsafe_votes = poll.get('unsafe_votes', 0)
                safe_votes = poll.get('safe_votes', 0)
                total_votes = unsafe_votes + safe_votes
                
                if total_votes > 0:
                    # Weight based on percentage of unsafe votes
                    weight = (unsafe_votes / total_votes) * 0.6  # Max weight 0.6 for polls
                    heatmap_points.append({
                        'latitude': poll['latitude'],
                        'longitude': poll['longitude'],
                        'weight': weight,
                        'type': 'poll',
                        'location': poll.get('location', ''),
                        'timestamp': poll.get('created_at', '').isoformat() if poll.get('created_at') else ''
                    })
        
        # Add news data points (treated as lower weight)
        for news in news_data:
            if news.get('latitude') and news.get('longitude'):
                # Lower weight for news (less direct than crimes)
                heatmap_points.append({
                    'latitude': news['latitude'],
                    'longitude': news['longitude'],
                    'weight': 0.3,  # Lower weight for news
                    'type': 'news',
                    'location': news.get('location', ''),
                    'timestamp': news.get('created_at', '').isoformat() if news.get('created_at') else ''
                })
        
        return jsonify({
            'success': True,
            'data': heatmap_points
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching heatmap data: {str(e)}'
        }), 500