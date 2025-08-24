import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [safetyPreferences, setSafetyPreferences] = useState({
    autoSOS: true,
    fakeCallTimer: false,
    alertTone: true,
  });

  const [selectedLanguage, setSelectedLanguage] = useState("English");

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="account-circle" size={80} color="#2196F3" />
          </View>
          <Text style={styles.profileName}>Sarah Johnson</Text>
          <Text style={styles.profileId}>Emergency ID: SG-2024-001</Text>
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
              <Text style={styles.infoValue}>Sarah Johnson</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Blood Group</Text>
              <Text style={styles.infoValue}>O+</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Emergency ID</Text>
              <Text style={styles.infoValue}>SG-2024-001</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>sarah.johnson@example.com</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>+1 234-567-8901</Text>
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