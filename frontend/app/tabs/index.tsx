import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

export default function HomeScreen() {
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapHtml, setMapHtml] = useState("");
  const [pollData, setPollData] = useState([]);

  const [trustedContacts] = useState([
    { id: 1, name: "Mom", phone: "+1 234-567-8901", relation: "Mother" },
    { id: 2, name: "Sarah", phone: "+1 234-567-8902", relation: "Best Friend" },
  ]);

  useEffect(() => {
    getLocationAsync();
    fetchPollData();
  }, []);

  const fetchPollData = async () => {
    try {
      // Use your machine's IP address instead of localhost
      const response = await fetch('http://192.168.137.142:5000/api/safety-polls');
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setPollData(result.data);
        console.log("Poll data fetched:", result.data);
        // Generate map after fetching poll data if location is already available
        if (userLocation && !loading) {
          generateMapHtml(userLocation.latitude, userLocation.longitude);
        }
      } else {
        console.error("Invalid poll data format:", result);
        setPollData([]);
      }
    } catch (error) {
      console.error("Error fetching poll data:", error);
      setPollData([]);
    }
  };

  const getLocationAsync = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your location on the map');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setUserLocation({ latitude, longitude });
      setLoading(false);
      // Only generate map after both location and poll data are available
      if (pollData.length > 0) {
        generateMapHtml(latitude, longitude);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert('Error', 'Could not get your current location. Using default location.');
      setLoading(false);
      // Only generate map after both location and poll data are available
      if (pollData.length > 0) {
        generateMapHtml(18.5204, 73.8567); // Default fallback
      }
    }
  };

  const generateMapHtml = (latitude, longitude) => {
    const pollMarkers = pollData.map((poll, index) => `
      // Create a circle for the area
      var circle = L.circle([${poll.latitude}, ${poll.longitude}], {
        color: '${poll.is_safe ? '#4CAF50' : '#f44336'}',
        fillColor: '${poll.is_safe ? '#4CAF50' : '#f44336'}',
        fillOpacity: 0.3,
        radius: 500
      }).addTo(map);
      
      // Create a marker with custom icon
      var markerIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: ${poll.is_safe ? '#4CAF50' : '#f44336'}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">' +
              '<i class="material-icons" style="color: white; font-size: 18px;">${poll.is_safe ? 'check' : 'warning'}</i>' +
              '</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      var marker = L.marker([${poll.latitude}, ${poll.longitude}], {icon: markerIcon}).addTo(map)
        .bindPopup("<b>${poll.location || 'Poll Location'}</b><br>${poll.is_safe ? 'Reported as Safe' : 'Reported as Unsafe'}");
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Safety Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
          }
          #map { 
            position: absolute; 
            top: 0; 
            bottom: 0; 
            width: 100%; 
          }
          .custom-marker {
            background: transparent;
            border: none;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          // Initialize the map
          var map = L.map('map').setView([${latitude}, ${longitude}], 13);
          
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          // Add user location marker if available
          var userIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: #2196F3; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">' +
                  '<i class="material-icons" style="color: white; font-size: 20px;">person_pin_circle</i>' +
                  '</div>',
            iconSize: [35, 35],
            iconAnchor: [17.5, 17.5]
          });
          
          var userMarker = L.marker([${latitude}, ${longitude}], {icon: userIcon}).addTo(map)
            .bindPopup('<b>Your Current Location</b>')
            .openPopup();
          
          // Add poll markers
          ${pollMarkers}
          
          // Adjust map view to show user location
          map.setView([${latitude}, ${longitude}], 13);
        </script>
      </body>
      </html>
    `;
    
    setMapHtml(html);
  };

  const handleSendSOS = () => {
    Alert.alert(
      "🚨 SOS Alert Sent!",
      "Your location has been shared with:\n• Mom (+1 234-567-8901)\n• Sarah (+1 234-567-8902)\n• Emergency Services (100)",
      [{ text: "OK" }]
    );
  };

  const handleFakeCall = () => {
    Alert.alert(
      "📞 Fake Call Initiated",
      "Incoming call from: Mom\nThis will help you exit uncomfortable situations safely.",
      [{ text: "OK" }]
    );
  };

  const handleLoudSiren = () => {
    Alert.alert(
      "🚨 LOUD SIREN ACTIVATED!",
      "High-volume alarm is now playing to attract attention and deter threats.",
      [{ text: "OK" }]
    );
  };

  const handleEmergencyCall = (number: string, service: string) => {
    Alert.alert(
      `📞 Calling ${service}`,
      `Dialing ${number}...\nStay calm and speak clearly about your emergency.`,
      [{ text: "OK" }]
    );
  };

  const toggleLocationSharing = () => {
    setIsLocationSharing(!isLocationSharing);
    Alert.alert(
      "Location Sharing",
      isLocationSharing ? "Location sharing stopped" : "Location sharing started",
      [{ text: "OK" }]
    );
  };

  // Refresh map when poll data or user location changes
  useEffect(() => {
    if (userLocation && !loading) {
      generateMapHtml(userLocation.latitude, userLocation.longitude);
    }
  }, [pollData, userLocation, loading]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* SOS Button */}
        <View style={styles.sosButtonContainer}>
          <TouchableOpacity onPress={handleSendSOS} style={styles.sosButton}>
            <View style={styles.sosButtonContent}>
              <MaterialIcons name="phone" size={24} color="#fff" />
              <Text style={styles.sosButtonText}>SOS</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Location Tracking */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="gps-fixed" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Live Location & Safety</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Real-time tracking and emergency response</Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="map" size={20} color="#4CAF50" />
              <Text style={styles.cardTitle}>Community Poll Locations</Text>
              <View style={styles.liveIndicator}>
                <MaterialIcons name="access-time" size={16} color="#999" />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>

            <View style={styles.mapContainer}>
              {loading ? (
                <View style={styles.mapLoading}>
                  <ActivityIndicator size="large" color="#5a3d7a" />
                  <Text style={styles.mapLoadingText}>Getting your location...</Text>
                </View>
              ) : (
                <WebView
                  originWhitelist={['*']}
                  source={{ html: mapHtml }}
                  style={styles.map}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  scrollEnabled={false}
                  onError={(error) => console.error("WebView error:", error)}
                  onLoad={() => console.log("WebView loaded")}
                />
              )}
            </View>

            <View style={styles.locationInfo}>
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={16} color="#2196F3" />
                <Text style={styles.locationText}>
                  {userLocation 
                    ? `Lat: ${userLocation.latitude.toFixed(6)}, Lng: ${userLocation.longitude.toFixed(6)}` 
                    : "Getting location..."}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            onPress={toggleLocationSharing} 
            style={[styles.locationButton, isLocationSharing ? styles.stopSharingButton : styles.startSharingButton]}
          >
            <View style={styles.buttonContent}>
              <MaterialIcons name="location-on" size={20} color="#fff" />
              <Text style={styles.buttonText}>
                {isLocationSharing ? "Stop Location Sharing" : "Start Location Sharing"}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="navigation" size={20} color="#2196F3" />
              <Text style={styles.actionButtonText}>Get Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="shield" size={20} color="#2196F3" />
              <Text style={styles.actionButtonText}>Safe Routes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Access Dashboard */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Access Dashboard</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Essential safety features at your fingertips</Text>

          <TouchableOpacity style={styles.dashboardCard}>
            <View style={styles.dashboardCardContent}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="people" size={32} color="#2196F3" />
              </View>
              <View style={styles.dashboardText}>
                <Text style={styles.dashboardTitle}>Trusted Contacts</Text>
                <Text style={styles.dashboardSubtitle}>Manage your emergency contacts and quick dial options</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dashboardCard}>
            <View style={styles.dashboardCardContent}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="warning" size={32} color="#FF9800" />
              </View>
              <View style={styles.dashboardText}>
                <Text style={styles.dashboardTitle}>Report Incident</Text>
                <Text style={styles.dashboardSubtitle}>Document and report safety concerns with evidence</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dashboardCard}>
            <View style={styles.dashboardCardContent}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="lightbulb" size={32} color="#4CAF50" />
              </View>
              <View style={styles.dashboardText}>
                <Text style={styles.dashboardTitle}>Safety Tips</Text>
                <Text style={styles.dashboardSubtitle}>Learn self-defense and safety techniques</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Trusted Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trusted Contacts</Text>
          </View>

          {trustedContacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <View style={styles.contactIcon}>
                  <MaterialIcons name="person" size={24} color="#2196F3" />
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                  <Text style={styles.contactRelation}>{contact.relation}</Text>
                </View>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={() => handleEmergencyCall(contact.phone, contact.name)}
                >
                  <MaterialIcons name="phone" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.messageButton}>
                  <MaterialIcons name="message" size={20} color="#2196F3" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sosButtonContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 10,
  },
  sosButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#f44336",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosButtonContent: {
    alignItems: "center",
  },
  sosButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginLeft: 8,
  },
  sectionSubtitle: {
    color: "#a0a0a0",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e5e5",
    marginLeft: 8,
    flex: 1,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveText: {
    color: "#a0a0a0",
    fontSize: 12,
    marginLeft: 4,
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapLoadingText: {
    color: "#a0a0a0",
    marginTop: 12,
    fontSize: 16,
  },
  locationInfo: {
    backgroundColor: "rgba(26, 26, 26, 0.5)",
    borderRadius: 8,
    padding: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "#e5e5e5",
    marginLeft: 8,
  },
  locationButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  startSharingButton: {
    backgroundColor: "#2196F3",
  },
  stopSharingButton: {
    backgroundColor: "#f44336",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  actionButtonText: {
    color: "#e5e5e5",
    marginLeft: 8,
    fontWeight: "500",
  },
  dashboardCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  dashboardCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  dashboardText: {
    flex: 1,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e5e5",
    marginBottom: 4,
  },
  dashboardSubtitle: {
    fontSize: 14,
    color: "#a0a0a0",
  },
  contactCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    flexDirection: "row",
    alignItems: "center",
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e5e5",
  },
  contactPhone: {
    fontSize: 14,
    color: "#a0a0a0",
  },
  contactRelation: {
    fontSize: 12,
    color: "#a0a0a0",
  },
  contactActions: {
    flexDirection: "row",
    gap: 8,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
});