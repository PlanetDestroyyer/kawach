import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { submitSafetyPoll } from "../../utils/safety_poll_api";

export default function SafetyPollScreen() {
  const [location, setLocation] = useState("");
  const [isSafe, setIsSafe] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!location.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }

    if (isSafe === null) {
      Alert.alert("Error", "Please indicate if this area feels safe or unsafe");
      return;
    }

    setLoading(true);
    try {
      // In a real app, we would get the user's actual location coordinates
      // For now, we'll use dummy coordinates for Pune
      const latitude = 18.5204 + (Math.random() - 0.5) * 0.1;
      const longitude = 73.8567 + (Math.random() - 0.5) * 0.1;

      const result = await submitSafetyPoll({
        location: location.trim(),
        latitude,
        longitude,
        is_safe: isSafe,
        comment: comment.trim(),
      });

      if (result.success) {
        Alert.alert(
          "Thank You!",
          "Your safety feedback has been submitted and will help improve the community heatmap.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        Alert.alert("Error", result.data.message || "Failed to submit feedback");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
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
          <Text style={styles.formSubtitle}>Share your experience at a specific location</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="location-on" size={20} color="#a0a0a0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter location (e.g., FC Road, Koregaon Park)"
                placeholderTextColor="#a0a0a0"
                value={location}
                onChangeText={setLocation}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>How safe does this area feel?</Text>
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
            <Text style={styles.submitButtonText}>
              {loading ? "Submitting..." : "Submit Safety Feedback"}
            </Text>
            <MaterialIcons name="send" size={20} color="#fff" style={styles.buttonIcon} />
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
    paddingTop: 40, // Add top padding
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
    marginBottom: 24, // Add bottom margin
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