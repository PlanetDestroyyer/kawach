import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { getSafetyPolls } from "../../utils/api";

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 18.5204,
    longitude: 73.8567,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  
  const [pollData, setPollData] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocationAsync();
    fetchPollData();
  }, []);

  const getLocationAsync = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your location on the map');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setUserLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert('Error', 'Could not get your current location. Using default location.');
    }
  };

  const fetchPollData = async () => {
    try {
      setLoading(true);
      const result = await getSafetyPolls();
      
      if (result.success && Array.isArray(result.data)) {
        setPollData(result.data);
      } else {
        console.error("Invalid poll data format:", result);
        setPollData([]);
      }
    } catch (error) {
      console.error("Error fetching poll data:", error);
      Alert.alert("Error", "Failed to load poll data");
      setPollData([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchPollData();
  };

  // Function to get color based on safety status
  const getSafetyColor = (isSafe: boolean, isFill: boolean = false) => {
    if (isSafe) {
      return isFill ? "rgba(76, 175, 80, 0.3)" : "rgba(76, 175, 80, 0.8)"; // Green for safe
    }
    return isFill ? "rgba(244, 67, 54, 0.3)" : "rgba(244, 67, 54, 0.8)"; // Red for unsafe
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5a3d7a" />
          <Text style={styles.loadingText}>Loading poll data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        provider="google" // Use Google Maps for better rendering
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            description="This is your current location"
            pinColor="#2196F3"
          >
            <MaterialIcons name="person-pin-circle" size={40} color="#2196F3" />
          </Marker>
        )}

        {/* Poll location markers with circles */}
        {pollData.map((poll, index) => (
          <React.Fragment key={poll._id || index}>
            {/* Circle to show the area of influence */}
            <Circle
              center={{
                latitude: poll.latitude,
                longitude: poll.longitude,
              }}
              radius={500} // 500 meters radius
              fillColor={getSafetyColor(poll.is_safe, true)}
              strokeColor={getSafetyColor(poll.is_safe, false)}
              strokeWidth={2}
              zIndex={1}
            />
            {/* Marker at the center */}
            <Marker
              coordinate={{
                latitude: poll.latitude,
                longitude: poll.longitude,
              }}
              title={poll.location || "Poll Location"}
              description={poll.is_safe ? "Reported as Safe" : "Reported as Unsafe"}
              pinColor={poll.is_safe ? "#4CAF50" : "#f44336"}
              zIndex={2}
            >
              <View style={[
                styles.markerContainer,
                { 
                  backgroundColor: poll.is_safe ? "rgba(76, 175, 80, 0.9)" : "rgba(244, 67, 54, 0.9)",
                  borderColor: poll.is_safe ? "#4CAF50" : "#f44336"
                }
              ]}>
                <MaterialIcons 
                  name={poll.is_safe ? "check-circle" : "error"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </View>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>

      {/* Map Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={refreshData}>
          <MaterialIcons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={getLocationAsync}
        >
          <MaterialIcons name="my-location" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f44336' }]} />
          <Text style={styles.legendText}>Unsafe Areas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Safe Areas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Your Location</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="error" size={20} color="#f44336" />
          <Text style={styles.statNumber}>{pollData.filter(p => !p.is_safe).length}</Text>
          <Text style={styles.statLabel}>Unsafe Reports</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.statNumber}>{pollData.filter(p => p.is_safe).length}</Text>
          <Text style={styles.statLabel}>Safe Reports</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
  },
  loadingText: {
    color: "#e5e5e5",
    marginTop: 12,
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controls: {
    position: "absolute",
    top: 50,
    right: 20,
    gap: 12,
  },
  controlButton: {
    backgroundColor: "#1a1a1a",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legend: {
    position: "absolute",
    bottom: 120,
    left: 20,
    backgroundColor: "rgba(26, 26, 26, 0.9)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  legendText: {
    color: "#e5e5e5",
    fontSize: 14,
  },
  statsContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(26, 26, 26, 0.9)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginHorizontal: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#a0a0a0",
    textAlign: "center",
  },
});