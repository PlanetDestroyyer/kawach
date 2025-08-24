import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";

export default function HomeScreen() {
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 18.5204, // Default to Pune
    longitude: 73.8567,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(true);
  
  const [trustedContacts] = useState([
    { id: 1, name: "Mom", phone: "+1 234-567-8901", relation: "Mother" },
    { id: 2, name: "Sarah", phone: "+1 234-567-8902", relation: "Best Friend" },
  ]);

  // Mock heatmap data for Pune
  const heatmapData = [
    {
      id: 1,
      latitude: 18.5204,
      longitude: 73.8567,
      weight: 0.8,
      radius: 800,
      location_string: "FC Road",
      type: "crime"
    },
    {
      id: 2,
      latitude: 18.5216,
      longitude: 73.8718,
      weight: 0.6,
      radius: 600,
      location_string: "Camp",
      type: "poll"
    },
    {
      id: 3,
      latitude: 18.6404,
      longitude: 73.7917,
      weight: 0.9,
      radius: 1000,
      location_string: "Chinchwad",
      type: "news"
    },
    {
      id: 4,
      latitude: 18.5642,
      longitude: 73.9077,
      weight: 0.3,
      radius: 400,
      location_string: "Koregaon Park",
      type: "poll"
    },
    {
      id: 5,
      latitude: 18.5074,
      longitude: 73.8077,
      weight: 0.7,
      radius: 700,
      location_string: "Warje",
      type: "crime"
    }
  ];

  useEffect(() => {
    getLocationAsync();
  }, []);

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
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert('Error', 'Could not get your current location. Using default location.');
      setLoading(false);
    }
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

  // Function to determine color based on risk level
  const getRiskColor = (weight) => {
    if (weight > 0.7) return 'rgba(244, 67, 54, 0.6)'; // High risk - red
    if (weight > 0.4) return 'rgba(255, 152, 0, 0.6)';  // Medium risk - orange
    return 'rgba(76, 175, 80, 0.6)';                   // Low risk - green
  };

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
              <Text style={styles.cardTitle}>Safety Heatmap</Text>
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
                <MapView
                  style={styles.map}
                  region={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                  }}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  showsCompass={true}
                  showsScale={true}
                  loadingEnabled={true}
                  loadingIndicatorColor="#5a3d7a"
                  loadingBackgroundColor="#1a1a1a"
                  onRegionChangeComplete={setRegion}
                >
                  {/* User location marker */}
                  {userLocation && (
                    <Marker
                      coordinate={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                      }}
                      title="Your Current Location"
                      description="This is your current position"
                    >
                      <MaterialIcons name="person-pin-circle" size={40} color="#2196F3" />
                    </Marker>
                  )}

                  {/* Heatmap circles for danger zones */}
                  {heatmapData.map((point) => (
                    <Circle
                      key={point.id}
                      center={{
                        latitude: point.latitude,
                        longitude: point.longitude,
                      }}
                      radius={point.radius}
                      fillColor={getRiskColor(point.weight)}
                      strokeColor="rgba(255, 255, 255, 0.3)"
                      strokeWidth={1}
                      zIndex={1}
                    />
                  ))}
                </MapView>
              )}
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
                <Text style={styles.legendText}>High Risk</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'orange' }]} />
                <Text style={styles.legendText}>Medium Risk</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
                <Text style={styles.legendText}>Low Risk</Text>
              </View>
            </View>

            <View style={styles.locationInfo}>
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={16} color="#2196F3" />
                <Text style={styles.locationText}>
                  {userLocation 
                    ? `Lat: ${userLocation.latitude.toFixed(6)}, Lng: ${userLocation.longitude.toFixed(6)}` 
                    : "Location: Pune, Maharashtra"}
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
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(26, 26, 26, 0.8)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    color: "#e5e5e5",
    fontSize: 12,
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