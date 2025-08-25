import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ServiceScreen() {
  const [activeSection, setActiveSection] = useState("all");
  const router = useRouter();

  const services = [
    {
      id: 1,
      title: "Emergency SOS",
      description: "Send immediate distress signal to contacts and authorities",
      icon: "warning",
      color: "#f44336",
      category: "emergency",
    },
    {
      id: 2,
      title: "Trusted Contacts",
      description: "Manage your emergency contacts and quick dial options",
      icon: "people",
      color: "#2196F3",
      category: "contacts",
    },
    {
      id: 3,
      title: "Incident Reporting",
      description: "Document and report safety concerns with evidence",
      icon: "report",
      color: "#FF9800",
      category: "reporting",
    },
    {
      id: 4,
      title: "Safety Tips",
      description: "Learn self-defense and safety techniques",
      icon: "lightbulb",
      color: "#4CAF50",
      category: "tips",
    },
  ];

  const handleServicePress = (service: any) => {
    switch (service.id) {
      case 1: // Emergency SOS
        router.push("/tabs/sos");
        break;
      case 2: // Trusted Contacts
        router.push("/tabs");
        break;
      case 3: // Incident Reporting
        router.push("/tabs/safety_poll");
        break;
      case 4: // Safety Tips
        // We'll handle this in the safety tips section
        setExpandedTips(!expandedTips);
        break;
      case 5: // Location Tracking
        Alert.alert("Location Tracking", "Share your live location with trusted contacts.");
        break;
      
      default:
        Alert.alert("Service", `Access ${service.title} feature.`);
    }
  };

  const filteredServices = activeSection === "all" 
    ? services 
    : services.filter(service => service.category === activeSection);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Safety Services</Text>
          <Text style={styles.headerSubtitle}>Essential features to keep you safe</Text>
        </View>

        {/* Category Filters */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
            <View style={styles.filterButtons}>
              <TouchableOpacity 
                style={[styles.filterButton, activeSection === "all" && styles.activeFilterButton]}
                onPress={() => setActiveSection("all")}
              >
                <Text style={[styles.filterText, activeSection === "all" && styles.activeFilterText]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, activeSection === "emergency" && styles.activeFilterButton]}
                onPress={() => setActiveSection("emergency")}
              >
                <Text style={[styles.filterText, activeSection === "emergency" && styles.activeFilterText]}>Emergency</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, activeSection === "contacts" && styles.activeFilterButton]}
                onPress={() => setActiveSection("contacts")}
              >
                <Text style={[styles.filterText, activeSection === "contacts" && styles.activeFilterText]}>Contacts</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, activeSection === "tips" && styles.activeFilterButton]}
                onPress={() => setActiveSection("tips")}
              >
                <Text style={[styles.filterText, activeSection === "tips" && styles.activeFilterText]}>Tips</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesGrid}>
          {filteredServices.map((service) => (
            <TouchableOpacity 
              key={service.id} 
              style={styles.serviceCard}
              onPress={() => handleServicePress(service)}
            >
              <View style={[styles.serviceIconContainer, { backgroundColor: `${service.color}20` }]}>
                <MaterialIcons name={service.icon as any} size={32} color={service.color} />
              </View>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/tabs/sos")}>
              <View style={styles.quickActionIcon}>
                <MaterialIcons name="warning" size={24} color="#f44336" />
              </View>
              <Text style={styles.quickActionText}>Send SOS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => Alert.alert("Call", "Calling emergency services...")}>
              <View style={styles.quickActionIcon}>
                <MaterialIcons name="local-police" size={24} color="#2196F3" />
              </View>
              <Text style={styles.quickActionText}>Police (100)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/tabs")}>
              <View style={styles.quickActionIcon}>
                <MaterialIcons name="people" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Trusted Contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/tabs/safety_poll")}>
              <View style={styles.quickActionIcon}>
                <MaterialIcons name="report" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.quickActionText}>Incident Reporting</Text>
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
    paddingTop: 20, // Add top padding
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e5e5e5",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#a0a0a0",
    marginTop: 4,
  },
  filterContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  activeFilterButton: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  filterText: {
    color: "#a0a0a0",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#fff",
  },
  servicesGrid: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    marginTop: 30,
  },
  serviceCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e5e5",
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#a0a0a0",
    lineHeight: 20,
  },
  quickActionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  quickActionButton: {
    width: "45%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e5e5",
    textAlign: "center",
  },
});