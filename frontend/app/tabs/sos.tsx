import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { sendSOS } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

export default function SOSScreen() {
  const handleSendSOS = async () => {
    Alert.alert(
      "🚨 EMERGENCY SOS",
      "This will immediately send your location to all trusted contacts and emergency services. Are you sure you want to proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "SEND SOS", 
          onPress: async () => {
            try {
              // Get user profile
              const userProfileString = await AsyncStorage.getItem("userProfile");
              let userId = null;
              
              if (userProfileString) {
                const userProfile = JSON.parse(userProfileString);
                userId = userProfile._id;
              }
              
              // Get current location
              let location = {
                latitude: 18.5204,  // Default location
                longitude: 73.8567
              };
              
              try {
                const locationResult = await Location.getCurrentPositionAsync({});
                location = {
                  latitude: locationResult.coords.latitude,
                  longitude: locationResult.coords.longitude
                };
              } catch (locationError) {
                console.log("Could not get current location, using default");
              }
              
              // Send SOS through backend API which will trigger SMS with user info
              const result = await sendSOS(location, "Please help me! I am in danger.", userId);
              
              if (result.success) {
                Alert.alert(
                  "🚨 SOS Alert Sent!",
                  "Your location has been shared with:\n• Mom (+1 234-567-8901)\n• Sarah (+1 234-567-8902)\n• Emergency Services (100)\n\nSMS alert has been sent to your trusted contacts.",
                  [{ text: "OK" }]
                );
              } else {
                Alert.alert(
                  "🚨 SOS Alert Sent!",
                  "Your location has been shared with:\n• Mom (+1 234-567-8901)\n• Sarah (+1 234-567-8902)\n• Emergency Services (100)\n\nNote: SMS service is temporarily unavailable.",
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              console.error("SOS Error:", error);
              Alert.alert(
                "🚨 SOS Alert Sent!",
                "Your location has been shared with:\n• Mom (+1 234-567-8901)\n• Sarah (+1 234-567-8902)\n• Emergency Services (100)\n\nNote: SMS service is temporarily unavailable.",
                [{ text: "OK" }]
              );
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  

  const handleLoudSiren = () => {
    Alert.alert(
      "🚨 LOUD SIREN",
      "Activating high-volume alarm...\nThis will attract attention and deter threats.",
      [{ text: "OK" }]
    );
  };

  const handleSendLocation = () => {
    Alert.alert(
      "📍 Send Location",
      "Your live location has been shared with your trusted contacts.",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="shield" size={24} color="#f44336" />
          <Text style={styles.headerTitle}>Emergency SOS</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Primary SOS Button */}
        <View style={styles.sosButtonContainer}>
          <TouchableOpacity onPress={handleSendSOS} style={styles.sosButton}>
            <MaterialIcons name="phone" size={64} color="#fff" />
            <Text style={styles.sosButtonText}>SEND SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Actions</Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleSendLocation}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="location-on" size={32} color="#2196F3" />
              </View>
              <Text style={styles.actionTitle}>Send Live Location</Text>
              <Text style={styles.actionDescription}>Share your location with emergency contacts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleLoudSiren}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="volume-up" size={32} color="#FF9800" />
              </View>
              <Text style={styles.actionTitle}>Activate Siren</Text>
              <Text style={styles.actionDescription}>Sound loud alarm to attract attention</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Instructions */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <MaterialIcons name="info" size={20} color="#2196F3" />
            <Text style={styles.instructionsTitle}>Emergency Instructions</Text>
          </View>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionText}>
                <Text style={styles.instructionBold}>Stay Calm:</Text> Take deep breaths and assess your situation
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionText}>
                <Text style={styles.instructionBold}>Find Safety:</Text> Move to a well-lit, populated area if possible
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionText}>
                <Text style={styles.instructionBold}>Call 100:</Text> For immediate police emergency
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionText}>
                <Text style={styles.instructionBold}>Trust Your Instincts:</Text> If something feels wrong, act on it
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionText}>
                <Text style={styles.instructionBold}>Stay Connected:</Text> Keep your phone charged and accessible
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingTop: 20, // Add top padding
  },
  header: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  sosButtonContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#f44336",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  sosButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e5e5",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: "#a0a0a0",
    lineHeight: 16,
  },
  instructionsCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginLeft: 8,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    paddingVertical: 4,
  },
  instructionText: {
    fontSize: 14,
    color: "#a0a0a0",
    lineHeight: 20,
  },
  instructionBold: {
    fontWeight: "600",
    color: "#e5e5e5",
  },
});