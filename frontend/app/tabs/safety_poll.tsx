import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { submitSafetyPoll } from "../../utils/api";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

export default function SafetyPollScreen() {
  const [location, setLocation] = useState("");
  const [isSafe, setIsSafe] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapRegion, setMapRegion] = useState({
    latitude: 18.5204,
    longitude: 73.8567,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const router = useRouter();

  // Function to generate Leaflet map HTML
  const generateLeafletMapHtml = (region: any, selectedLocation: any, isSafe: boolean | null) => {
    const pinColor = isSafe === true ? '#4CAF50' : isSafe === false ? '#f44336' : '#2196F3';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Safety Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
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
          var map = L.map('map').setView([${region.latitude}, ${region.longitude}], 13);
          
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          // Add click event to the map
          map.on('click', function(e) {
            // Remove existing marker if present
            if (window.currentMarker) {
              map.removeLayer(window.currentMarker);
            }
            
            // Create a marker with custom icon
            var markerIcon = L.divIcon({
              className: 'custom-marker',
              html: '<div style="background-color: ${pinColor}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">' +
                    '<i class="material-icons" style="color: white; font-size: 18px;">location_on</i>' +
                    '</div>',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            });
            
            var marker = L.marker([e.latlng.lat, e.latlng.lng], {icon: markerIcon}).addTo(map);
            window.currentMarker = marker;
            
            // Send message to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapClick',
              lat: e.latlng.lat,
              lng: e.latlng.lng
            }));
          });
          
          // Add existing marker if selectedLocation exists
          ${selectedLocation ? `
            var markerIcon = L.divIcon({
              className: 'custom-marker',
              html: '<div style="background-color: ${pinColor}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">' +
                    '<i class="material-icons" style="color: white; font-size: 18px;">location_on</i>' +
                    '</div>',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            });
            
            var marker = L.marker([${selectedLocation.latitude}, ${selectedLocation.longitude}], {icon: markerIcon}).addTo(map);
            window.currentMarker = marker;
          ` : ''}
        </script>
      </body>
      </html>
    `;
  };

  const getCurrentLocation = React.useCallback(async () => {
    try {
      console.log("Getting current location...");
      let location = await Location.getCurrentPositionAsync({});
      console.log("Location received:", location);
      const { latitude, longitude } = location.coords;
      console.log("Setting map region to:", { latitude, longitude });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert('Error', 'Could not get your current location: ' + error.message);
    }
  }, []);

  const getLocationPermission = React.useCallback(async () => {
    try {
      console.log("Requesting location permission...");
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Location permission status:", status);
      if (status === 'granted') {
        console.log("Permission granted, getting current location...");
        getCurrentLocation();
      } else {
        console.log("Permission denied");
        Alert.alert('Permission Denied', 'Location permission is required for this feature');
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      Alert.alert('Error', 'Could not request location permission');
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    getLocationPermission();
  }, [getLocationPermission]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!location.trim()) {
      newErrors.location = "Please enter a location";
    }
    
    if (isSafe === null) {
      newErrors.isSafe = "Please indicate if this area feels safe or unsafe";
    }
    
    if (!selectedLocation) {
      newErrors.location = "Please select a location on the map";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    try {
      const result = await submitSafetyPoll({
        location: location.trim(),
        is_safe: isSafe,
        comment: comment.trim(),
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude,
      });

      if (result.success) {
        Alert.alert(
          "Thank You!",
          "Your safety feedback has been submitted and will help improve the community heatmap.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        setErrors({ general: result.data.message || "Failed to submit feedback" });
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
      console.error("Poll submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="poll" size={48} color="#5a3d7a" />
          </View>
          <Text style={styles.title}>Safety Poll</Text>
          <Text style={styles.subtitle}>Help improve community safety by sharing your experiences</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Report Area Safety</Text>
          <Text style={styles.formSubtitle}>Share your experience at a specific location in Pune</Text>

          {errors.general ? (
            <View style={styles.errorBanner}>
              <MaterialIcons name="error" size={16} color="#f44336" />
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          ) : null}

          {/* Map for location selection using Leaflet */}
          <View style={styles.mapContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ html: generateLeafletMapHtml(mapRegion, selectedLocation, isSafe) }}
              style={styles.map}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scrollEnabled={false}
              onError={(error) => {
                console.error("WebView error:", error);
                Alert.alert('Map Error', 'Could not load the map. Please check your internet connection.');
              }}
              onLoad={() => console.log("Leaflet map loaded")}
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === 'mapClick') {
                    setSelectedLocation({
                      latitude: data.lat,
                      longitude: data.lng
                    });
                    // Update map region to center on selected location
                    setMapRegion({
                      ...mapRegion,
                      latitude: data.lat,
                      longitude: data.lng,
                    });
                  }
                } catch (e) {
                  console.error("Error parsing WebView message:", e);
                }
              }}
            />
            <TouchableOpacity 
              style={styles.currentLocationButton}
              onPress={getCurrentLocation}
            >
              <MaterialIcons name="my-location" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, errors.location && styles.inputError]}>
              <MaterialIcons name="location-on" size={20} color="#a0a0a0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter location name (e.g., FC Road, Koregaon Park, Camp)"
                placeholderTextColor="#a0a0a0"
                value={location}
                onChangeText={setLocation}
                autoCapitalize="words"
              />
            </View>
            {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>How safe does this area feel?</Text>
            {errors.isSafe ? <Text style={styles.errorText}>{errors.isSafe}</Text> : null}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.optionButton, isSafe === true && styles.selectedSafe]}
                onPress={() => setIsSafe(true)}
              >
                <MaterialIcons name="check-circle" size={24} color={isSafe === true ? "#4CAF50" : "#a0a0a0"} />
                <Text style={[styles.optionText, isSafe === true && styles.selectedSafeText]}>Safe</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.optionButton, isSafe === false && styles.selectedUnsafe]}
                onPress={() => setIsSafe(false)}
              >
                <MaterialIcons name="error" size={24} color={isSafe === false ? "#f44336" : "#a0a0a0"} />
                <Text style={[styles.optionText, isSafe === false && styles.selectedUnsafeText]}>Unsafe</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.textAreaContainer}>
              <MaterialIcons name="comment" size={20} color="#a0a0a0" style={styles.inputIcon} />
              <TextInput
                style={styles.textArea}
                placeholder="Additional comments (optional)"
                placeholderTextColor="#a0a0a0"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.submitButtonText}>Submitting...</Text>
              </>
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit Safety Feedback</Text>
                <MaterialIcons name="send" size={20} color="#fff" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info" size={20} color="#2196F3" />
            <Text style={styles.infoTitle}>How Your Feedback Helps</Text>
          </View>
          <Text style={styles.infoText}>
            Your safety reports contribute to a community heatmap that helps other users identify safe and unsafe areas. 
            This crowdsourced data, combined with crime reports and news, creates a comprehensive safety picture for Pune.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(90, 61, 122, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#a0a0a0",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginBottom: 8,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 16,
    color: "#a0a0a0",
    marginBottom: 24,
    textAlign: "center",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 26, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  inputError: {
    borderColor: "#f44336",
  },
  textAreaContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(26, 26, 26, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  inputIcon: {
    marginLeft: 16,
    marginTop: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    paddingLeft: 8,
    fontSize: 16,
    color: "#e5e5e5",
  },
  textArea: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    paddingLeft: 8,
    fontSize: 16,
    color: "#e5e5e5",
    minHeight: 100,
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 16,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e5e5",
    marginBottom: 16,
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "rgba(26, 26, 26, 0.5)",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  selectedSafe: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderColor: "#4CAF50",
  },
  selectedUnsafe: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
    borderColor: "#f44336",
  },
  optionText: {
    color: "#a0a0a0",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  selectedSafeText: {
    color: "#4CAF50",
  },
  selectedUnsafeText: {
    color: "#f44336",
  },
  submitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5a3d7a",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginLeft: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#a0a0a0",
    lineHeight: 24,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  currentLocationButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#2196F3",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});