import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [safetyPreferences, setSafetyPreferences] = useState({
    autoSOS: true,
    fakeCallTimer: false,
    alertTone: true,
  });

  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userProfileStr = await AsyncStorage.getItem("userProfile");
      const isVerifiedStr = await AsyncStorage.getItem("isVerified");
      
      if (userProfileStr) {
        const profile = JSON.parse(userProfileStr);
        setUserProfile(profile);
      }
      
      if (isVerifiedStr) {
        setIsVerified(isVerifiedStr === "true");
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const toggleSafetyPreference = (key: keyof typeof safetyPreferences) => {
    setSafetyPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "This feature allows you to update your personal information.");
  };

  const handleEmergencyReset = () => {
    Alert.alert(
      "Emergency Reset",
      "This will reset all your safety settings to default. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: () => Alert.alert("Settings Reset", "All safety settings have been reset to default.") }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userProfile");
              await AsyncStorage.removeItem("isVerified");
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleVerifyIdentity = () => {
    router.push("/(auth)/verify");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="account-circle" size={80} color="#2196F3" />
          </View>
          <Text style={styles.profileName}>
            {userProfile ? userProfile.name : "Loading..."}
          </Text>
          <Text style={styles.profileId}>
            Emergency ID: {userProfile ? `SG-${userProfile._id?.substring(0, 8) || '00000000'}` : "Loading..."}
          </Text>
          <View style={styles.verificationStatus}>
            <MaterialIcons 
              name={isVerified ? "verified" : "warning"} 
              size={16} 
              color={isVerified ? "#4CAF50" : "#FF9800"} 
            />
            <Text style={[styles.verificationText, isVerified ? styles.verifiedText : styles.unverifiedText]}>
              {isVerified ? "Identity Verified" : "Identity Not Verified"}
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <MaterialIcons name="edit" size={16} color="#2196F3" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="person" size={20} color="#2196F3" />
            <Text style={styles.sectionTitle}>Profile Information</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>
                {userProfile ? userProfile.name : "Loading..."}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {userProfile ? userProfile.email : "Loading..."}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Aadhar Number</Text>
              <Text style={styles.infoValue}>
                {userProfile ? userProfile.aadhar_number : "Loading..."}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Emergency Contact</Text>
              <Text style={styles.infoValue}>
                {userProfile?.emergency_contact?.name || "Not set"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>
                {userProfile?.emergency_contact?.phone || "Not set"}
              </Text>
            </View>
          </View>
        </View>

        {/* Safety Preferences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="security" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Safety Preferences</Text>
          </View>
          <View style={styles.preferencesCard}>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Auto-SOS on Power Off</Text>
                <Text style={styles.preferenceDescription}>Send SOS when phone powers off</Text>
              </View>
              <Switch
                value={safetyPreferences.autoSOS}
                onValueChange={() => toggleSafetyPreference("autoSOS")}
                trackColor={{ false: "#767577", true: "#2196F3" }}
                thumbColor={safetyPreferences.autoSOS ? "#f4f3f4" : "#f4f3f4"}
              />
            </View>
            
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Fake Call Timer</Text>
                <Text style={styles.preferenceDescription}>Set a timer for a fake incoming call</Text>
              </View>
              <Switch
                value={safetyPreferences.fakeCallTimer}
                onValueChange={() => toggleSafetyPreference("fakeCallTimer")}
                trackColor={{ false: "#767577", true: "#2196F3" }}
                thumbColor={safetyPreferences.fakeCallTimer ? "#f4f3f4" : "#f4f3f4"}
              />
            </View>
            
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Alert Tone Volume</Text>
                <Text style={styles.preferenceDescription}>Adjust the volume of alert tones</Text>
              </View>
              <Switch
                value={safetyPreferences.alertTone}
                onValueChange={() => toggleSafetyPreference("alertTone")}
                trackColor={{ false: "#767577", true: "#2196F3" }}
                thumbColor={safetyPreferences.alertTone ? "#f4f3f4" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>

        {/* Identity Verification */}
        {!isVerified && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="verified-user" size={20} color="#FF9800" />
              <Text style={styles.sectionTitle}>Identity Verification</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.verificationDescription}>
                Verify your identity to unlock all features and emergency services.
              </Text>
              <TouchableOpacity 
                style={styles.verifyButton}
                onPress={handleVerifyIdentity}
              >
                <Text style={styles.verifyButtonText}>Verify Identity Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Language Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="language" size={20} color="#9C27B0" />
            <Text style={styles.sectionTitle}>Language</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Selected Language</Text>
              <Text style={styles.infoValue}>{selectedLanguage}</Text>
            </View>
            <TouchableOpacity 
              style={styles.changeLanguageButton}
              onPress={() => Alert.alert(
                "Change Language",
                "Select your preferred language",
                [
                  { text: "English", onPress: () => setSelectedLanguage("English") },
                  { text: "Spanish", onPress: () => setSelectedLanguage("Spanish") },
                  { text: "French", onPress: () => setSelectedLanguage("French") },
                  { text: "Cancel", style: "cancel" }
                ]
              )}
            >
              <Text style={styles.changeLanguageText}>Change Language</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="warning" size={20} color="#f44336" />
            <Text style={styles.sectionTitle}>Emergency Actions</Text>
          </View>
          <View style={styles.emergencyCard}>
            <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyReset}>
              <MaterialIcons name="restart-alt" size={20} color="#f44336" />
              <Text style={styles.emergencyButtonText}>Reset Safety Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.emergencyButton, styles.logoutButton]} onPress={handleLogout}>
              <MaterialIcons name="logout" size={20} color="#f44336" />
              <Text style={styles.emergencyButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e5e5e5",
  },
  profileId: {
    fontSize: 14,
    color: "#a0a0a0",
    marginTop: 4,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
  },
  editButtonText: {
    color: "#2196F3",
    fontWeight: "500",
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 16,
    color: "#a0a0a0",
  },
  infoValue: {
    fontSize: 16,
    color: "#e5e5e5",
    fontWeight: "500",
  },
  preferencesCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  preferenceRowLast: {
    borderBottomWidth: 0,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontSize: 16,
    color: "#e5e5e5",
    fontWeight: "500",
  },
  preferenceDescription: {
    fontSize: 14,
    color: "#a0a0a0",
    marginTop: 4,
  },
  changeLanguageButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  changeLanguageText: {
    color: "#fff",
    fontWeight: "600",
  },
  emergencyCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  emergencyButtonText: {
    color: "#f44336",
    fontWeight: "600",
    marginLeft: 12,
  },
});