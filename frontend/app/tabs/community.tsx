import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function CommunityScreen() {
  const [posts] = useState([
    {
      id: 1,
      user: "Safety Advocate",
      time: "2 hours ago",
      content: "Remember to trust your instincts. If something feels wrong, don't hesitate to seek help or leave the situation.",
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      user: "Empowerment Group",
      time: "5 hours ago",
      content: "Join our self-defense workshop this Saturday at 2 PM. Learn essential techniques to protect yourself.",
      likes: 42,
      comments: 8,
    },
    {
      id: 3,
      user: "Community Support",
      time: "1 day ago",
      content: "Local authorities have increased patrols in the downtown area following recent safety concerns. Stay alert and report anything suspicious.",
      likes: 67,
      comments: 12,
    },
  ]);

  const handleJoinGroup = () => {
    Alert.alert(
      "Join Community",
      "You've successfully joined the women's safety community group!",
      [{ text: "OK" }]
    );
  };

  const handleCreatePost = () => {
    Alert.alert(
      "Create Post",
      "This feature will allow you to share safety tips and experiences with the community.",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialIcons name="people" size={32} color="#2196F3" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Women's Safety Community</Text>
              <Text style={styles.headerSubtitle}>Connect, share, and support each other</Text>
            </View>
          </View>
        </View>

        {/* Community Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2,847</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1,204</Text>
            <Text style={styles.statLabel}>Active Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleJoinGroup}>
            <MaterialIcons name="group-add" size={20} color="#fff" />
            <Text style={styles.buttonText}>Join Group</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleCreatePost}>
            <MaterialIcons name="edit" size={20} color="#2196F3" />
            <Text style={styles.secondaryButtonText}>Create Post</Text>
          </TouchableOpacity>
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Safety Tips of the Day</Text>
          </View>
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <MaterialIcons name="lightbulb" size={24} color="#FFC107" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Connected</Text>
              <Text style={styles.tipText}>
                Share your location with trusted contacts when going to new places, 
                especially at night. Use our built-in location sharing feature.
              </Text>
            </View>
          </View>
        </View>

        {/* Community Posts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Feed</Text>
          </View>
          
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.userAvatar}>
                  <MaterialIcons name="account-circle" size={32} color="#2196F3" />
                </View>
                <View style={styles.postUserInfo}>
                  <Text style={styles.postUserName}>{post.user}</Text>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>
              </View>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.postActionButton}>
                  <MaterialIcons name="thumb-up" size={16} color="#a0a0a0" />
                  <Text style={styles.postActionText}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postActionButton}>
                  <MaterialIcons name="comment" size={16} color="#a0a0a0" />
                  <Text style={styles.postActionText}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postActionButton}>
                  <MaterialIcons name="share" size={16} color="#a0a0a0" />
                  <Text style={styles.postActionText}>Share</Text>
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
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#1a1a1a",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e5e5",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#a0a0a0",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
  },
  statLabel: {
    fontSize: 14,
    color: "#a0a0a0",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 16,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e5e5e5",
  },
  tipCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    flexDirection: "row",
  },
  tipIcon: {
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e5e5",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#a0a0a0",
    lineHeight: 20,
  },
  postCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userAvatar: {
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e5e5",
  },
  postTime: {
    fontSize: 12,
    color: "#a0a0a0",
  },
  postContent: {
    fontSize: 14,
    color: "#e5e5e5",
    lineHeight: 20,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    paddingTop: 12,
  },
  postActionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  postActionText: {
    fontSize: 14,
    color: "#a0a0a0",
    marginLeft: 4,
  },
});