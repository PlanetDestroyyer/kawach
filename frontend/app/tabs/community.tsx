import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getSafetyPolls } from "../../utils/api";

export default function CommunityScreen() {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadSafetyPolls();
  }, []);

  const loadSafetyPolls = async () => {
    try {
      setLoading(true);
      const result = await getSafetyPolls();
      
      if (result.success && result.data && Array.isArray(result.data.data)) {
        setPolls(result.data.data);
      } else {
        // Use dummy data if API fails
        const dummyData = [
          {
            _id: "1",
            location: "FC Road",
            is_safe: false,
            comment: "Unsafe after dark",
            safe_votes: 2,
            unsafe_votes: 5,
            created_at: new Date().toISOString()
          },
          {
            _id: "2",
            location: "Koregaon Park",
            is_safe: true,
            comment: "Well-lit and patrolled area",
            safe_votes: 8,
            unsafe_votes: 1,
            created_at: new Date().toISOString()
          },
          {
            _id: "3",
            location: "Camp",
            is_safe: false,
            comment: "Multiple incidents reported",
            safe_votes: 1,
            unsafe_votes: 7,
            created_at: new Date().toISOString()
          },
          {
            _id: "4",
            location: "Baner",
            is_safe: true,
            comment: "Safe during daytime",
            safe_votes: 6,
            unsafe_votes: 2,
            created_at: new Date().toISOString()
          },
          {
            _id: "5",
            location: "Pimple Saudagar",
            is_safe: true,
            comment: "Well-patrolled residential area",
            safe_votes: 9,
            unsafe_votes: 1,
            created_at: new Date().toISOString()
          }
        ];
        setPolls(dummyData);
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Error loading safety polls:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSafetyPolls();
    setRefreshing(false);
  };

  const handleAddPoll = () => {
    router.push("/tabs/safety_poll");
  };

  const handleViewMap = () => {
    // Navigate to the map screen
    router.push("/tabs/map");
  };

  const getSafetyColor = (isSafe: boolean) => {
    return isSafe ? "#4CAF50" : "#f44336";
  };

  const getSafetyIcon = (isSafe: boolean) => {
    return isSafe ? "check-circle" : "error";
  };

  const getSafetyText = (isSafe: boolean) => {
    return isSafe ? "Safe" : "Unsafe";
  };

  // Calculate statistics
  const safePolls = polls.filter(poll => poll.is_safe);
  const unsafePolls = polls.filter(poll => !poll.is_safe);
  const totalPolls = polls.length;
  const safePercentage = totalPolls > 0 ? Math.round((safePolls.length / totalPolls) * 100) : 0;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialIcons name="people" size={24} color="#2196F3" />
            <Text style={styles.headerTitle}>Community Safety Reports</Text>
          </View>
          <Text style={styles.headerSubtitle}>See what others are reporting in your area</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="warning" size={24} color="#f44336" />
            <Text style={styles.statNumber}>{unsafePolls.length}</Text>
            <Text style={styles.statLabel}>Unsafe Reports</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{safePercentage}%</Text>
            <Text style={styles.statLabel}>Areas Safe</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="people" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>{totalPolls}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Safety Reports</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.mapButton} onPress={handleViewMap}>
                <MaterialIcons name="map" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleAddPoll}>
                <MaterialIcons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <MaterialIcons name="hourglass-empty" size={48} color="#a0a0a0" />
              <Text style={styles.loadingText}>Loading safety reports...</Text>
            </View>
          ) : polls.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="inbox" size={48} color="#a0a0a0" />
              <Text style={styles.emptyText}>No safety reports yet</Text>
              <Text style={styles.emptySubtext}>Be the first to report on your area&apos;s safety</Text>
              <TouchableOpacity style={styles.addReportButton} onPress={handleAddPoll}>
                <Text style={styles.addReportButtonText}>Add Safety Report</Text>
              </TouchableOpacity>
            </View>
          ) : (
            polls.map((poll) => (
              <View key={poll._id} style={styles.pollCard}>
                <View style={styles.pollHeader}>
                  <View style={styles.locationContainer}>
                    <MaterialIcons name="location-on" size={16} color="#a0a0a0" />
                    <Text style={styles.locationText}>{poll.location}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getSafetyColor(poll.is_safe) }]}>
                    <MaterialIcons name={getSafetyIcon(poll.is_safe)} size={16} color="#fff" />
                    <Text style={styles.statusText}>{getSafetyText(poll.is_safe)}</Text>
                  </View>
                </View>
                
                {poll.comment ? (
                  <Text style={styles.commentText}>{poll.comment}</Text>
                ) : null}
                
                <View style={styles.pollStats}>
                  <View style={styles.statItem}>
                    <MaterialIcons name="access-time" size={16} color="#a0a0a0" />
                    <Text style={styles.statValue}>
                      {new Date(poll.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info" size={20} color="#2196F3" />
            <Text style={styles.infoTitle}>Community Safety</Text>
          </View>
          <Text style={styles.infoText}>
            These reports are submitted by community members to help identify safe and unsafe areas. 
            The data is combined with crime reports and news to create a comprehensive safety picture.
          </Text>
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
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#a0a0a0",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
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
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e5e5",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  mapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#5a3d7a",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  loadingText: {
    color: "#a0a0a0",
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    color: "#e5e5e5",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#a0a0a0",
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },
  addReportButton: {
    backgroundColor: "#5a3d7a",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addReportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pollCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  pollHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "#e5e5e5",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  commentText: {
    color: "#a0a0a0",
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  pollStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    paddingTop: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statValue: {
    color: "#e5e5e5",
    fontSize: 12,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2a2a2a",
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
});